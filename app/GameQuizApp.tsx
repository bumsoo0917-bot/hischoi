"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { bossEncounter, encounterById, encounters, practiceEncounters } from "./encounters";
import { Lesson, Question, lessons, questionBank } from "./questions";
import FirebaseAuthButton from "./FirebaseAuthButton";

type BossLevel=1|2|3;
type Screen="home"|"lesson"|"quiz"|"result"|"leaderboard"|"collection";
type Mode="practice"|"boss";
type User={displayName:string;email:string};
type RankingPlayer={rank:number;displayName:string;currentGold:number;totalGold:number;bossesDefeated:number;masteredLessons:number;lessonBosses:Record<number,number>};
type RankingData={players:RankingPlayer[];me:(RankingPlayer&{defeated:Record<string,boolean>;collection:Record<string,boolean>;attempts:Record<string,number>})|null};
type Progress={
  defeated:Record<string,boolean>;
  collection:Record<string,boolean>;
  attempts:Record<string,number>;
  seen:Record<string,number>;
  wrong:Record<string,number>;
  recent:string[];
  recentEncounters:string[];
  gold:number;
  totalGold:number;
};
type Answer={question:Question;selected:string;correct:boolean};

const empty:Progress={defeated:{},collection:{},attempts:{},seen:{},wrong:{},recent:[],recentEncounters:[],gold:0,totalGold:0};
const bossLevels:BossLevel[]=[1,2,3];
const bossCosts:Record<BossLevel,number>={1:30,2:50,3:70};
const bossKey=(lesson:number,level:BossLevel)=>`${lesson}-${level}`;
const playableLessonIds=Array.from({length:30},(_,index)=>index+1);

function shuffle<T>(items:T[]){
  const copy=[...items];
  for(let i=copy.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
}

function choose(pool:Question[],progress:Progress,count:number){
  const recent=new Set(progress.recent.slice(-20));
  return pool.map(question=>({
    question,
    priority:(progress.seen[question.id]?0:1000)+(progress.wrong[question.id]??0)*100-(recent.has(question.id)?500:0)+Math.random()*50,
  })).sort((a,b)=>b.priority-a.priority).slice(0,count)
    .map(({question})=>({...question,choices:shuffle(question.choices)}));
}

function defeatedCount(progress:Progress,lesson:number){
  return bossLevels.filter(level=>progress.defeated[bossKey(lesson,level)]).length;
}

function nextBoss(progress:Progress,lesson:number):BossLevel{
  return bossLevels.find(level=>!progress.defeated[bossKey(lesson,level)])??3;
}

function migrateProgress():Progress{
  const saved=localStorage.getItem("history-master-progress-v3");
  if(saved){
    try{
      const parsed=JSON.parse(saved);
      return {...empty,...parsed,totalGold:parsed.totalGold??parsed.gold??0};
    }catch{return empty}
  }
  return empty;
}

export default function GameQuizApp({user,signOutHref,firebaseUser=false,anonymousUser=false}:{user:User|null;signOutHref:string;firebaseUser?:boolean;anonymousUser?:boolean}){
  const [screen,setScreen]=useState<Screen>("home");
  const [progress,setProgress]=useState<Progress>(empty);
  const [ready,setReady]=useState(false);
  const [serverReady,setServerReady]=useState(false);
  const [lesson,setLesson]=useState<Lesson>(lessons[0]);
  const [level,setLevel]=useState<BossLevel>(1);
  const [mode,setMode]=useState<Mode>("practice");
  const [encounterId,setEncounterId]=useState("l1-map");
  const [quiz,setQuiz]=useState<Question[]>([]);
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Answer[]>([]);
  const [choice,setChoice]=useState<string|null>(null);
  const [ranking,setRanking]=useState<RankingData>({players:[],me:null});
  const [rankingLoading,setRankingLoading]=useState(false);

  // Local storage is an external progress store; hydration intentionally happens once after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{setProgress(migrateProgress());setReady(true)},[]);
  useEffect(()=>{if(ready)localStorage.setItem("history-master-progress-v3",JSON.stringify(progress))},[progress,ready]);
  useEffect(()=>{
    if(!ready)return;
    if(!user){
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setServerReady(true);return
    }
    let active=true;
    fetch("/api/leaderboard",{cache:"no-store"})
      .then(response=>response.ok?response.json():Promise.reject())
      .then((data:RankingData)=>{
        if(!active)return;
        setRanking(data);
        if(data.me)setProgress(old=>({...old,gold:data.me!.currentGold,totalGold:data.me!.totalGold,defeated:data.me!.defeated,collection:data.me!.collection,attempts:data.me!.attempts}));
      }).finally(()=>{if(active)setServerReady(true)});
    return()=>{active=false};
  },[ready,user]);
  useEffect(()=>{
    if(!ready||!serverReady||!user)return;
    const timer=setTimeout(()=>fetch("/api/leaderboard",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({currentGold:progress.gold,totalGold:progress.totalGold,defeated:progress.defeated,collection:progress.collection,attempts:progress.attempts}),
    }).catch(()=>{}),250);
    return()=>clearTimeout(timer);
  },[progress.gold,progress.totalGold,progress.defeated,progress.collection,progress.attempts,ready,serverReady,user]);

  const current=quiz[index];
  const score=answers.filter(answer=>answer.correct).length;
  const quizLength=mode==="practice"?5:10;
  const totalDefeated=playableLessonIds.reduce((sum,id)=>sum+defeatedCount(progress,id),0);
  const mastered=playableLessonIds.filter(id=>defeatedCount(progress,id)===3).length;
  const collectionCount=encounters.filter(item=>progress.collection[item.id]).length;
  const encounter=encounterById(encounterId);
  const rank=useMemo(()=>{
    if(mastered)return `${mastered}개 강의 달인`;
    if(totalDefeated>=3)return "한국사 보스 사냥꾼";
    if(totalDefeated)return "한국사 도전자";
    return "수련을 시작한 모험가";
  },[mastered,totalDefeated]);

  const openLeaderboard=()=>{
    setScreen("leaderboard");setRankingLoading(true);scrollTo({top:0,behavior:"smooth"});
    fetch("/api/leaderboard",{cache:"no-store"}).then(response=>response.ok?response.json():Promise.reject())
      .then((data:RankingData)=>setRanking(data)).finally(()=>setRankingLoading(false));
  };
  const openCollection=()=>{setScreen("collection");scrollTo({top:0,behavior:"smooth"})};
  const goLesson=(target:Lesson)=>{
    if(target.status==="coming")return;
    setLesson(target);setScreen("lesson");scrollTo({top:0,behavior:"smooth"});
  };
  const begin=(targetMode:Mode,targetLevel:BossLevel)=>{
    const count=targetMode==="practice"?5:10;
    const pool=questionBank.filter(q=>q.lessonId===lesson.id&&q.level===targetLevel);
    const target=targetMode==="boss"
      ?bossEncounter(lesson.id,targetLevel)
      :shuffle(practiceEncounters(lesson.id).filter(item=>!progress.recentEncounters.slice(-1).includes(item.id)))[0]??practiceEncounters(lesson.id)[0];
    if(!target)return;
    setEncounterId(target.id);setMode(targetMode);setLevel(targetLevel);setQuiz(choose(pool,progress,count));
    setIndex(0);setAnswers([]);setChoice(null);setScreen("quiz");scrollTo({top:0});
  };
  const startPractice=()=>begin("practice",nextBoss(progress,lesson.id));
  const startBoss=(targetLevel:BossLevel)=>{
    const defeated=progress.defeated[bossKey(lesson.id,targetLevel)];
    const cost=defeated?0:bossCosts[targetLevel];
    const unlocked=targetLevel===1||progress.defeated[bossKey(lesson.id,(targetLevel-1) as BossLevel)];
    if(!unlocked||progress.gold<cost)return;
    if(cost)setProgress(old=>({...old,gold:old.gold-cost}));
    begin("boss",targetLevel);
  };
  const answer=(selected:string)=>{
    if(choice||!current)return;
    setChoice(selected);
    setAnswers(old=>[...old,{question:current,selected,correct:selected===current.answer}]);
  };
  const next=()=>{
    if(index<quizLength-1){setIndex(value=>value+1);setChoice(null);return}
    const won=mode==="boss"&&score>=9;
    const attempt=bossKey(lesson.id,level);
    setProgress(old=>{
      const seen={...old.seen},wrong={...old.wrong};
      answers.forEach(item=>{
        seen[item.question.id]=(seen[item.question.id]??0)+1;
        if(!item.correct)wrong[item.question.id]=(wrong[item.question.id]??0)+1;
      });
      const collect=mode==="practice"||won;
      return {
        ...old,
        gold:old.gold+(mode==="practice"?score*10:0),
        totalGold:old.totalGold+(mode==="practice"?score*10:0),
        defeated:{...old.defeated,...(won?{[attempt]:true}:{})},
        collection:{...old.collection,...(collect?{[encounterId]:true}:{})},
        attempts:{...old.attempts,[`${mode}-${attempt}`]:(old.attempts[`${mode}-${attempt}`]??0)+1},
        seen,wrong,
        recent:[...old.recent,...answers.map(item=>item.question.id)].slice(-50),
        recentEncounters:[...old.recentEncounters,encounterId].slice(-10),
      };
    });
    setScreen("result");scrollTo({top:0,behavior:"smooth"});
  };

  if(!ready)return <main className="loading"><span>史</span><p>모험 기록을 불러오는 중...</p></main>;

  const nav=<Nav home={screen==="home"?undefined:()=>setScreen("home")} gold={progress.gold} user={user}
    onLeaderboard={openLeaderboard} onCollection={openCollection} collectionCount={collectionCount}/>;

  if(screen==="quiz"&&current&&encounter){
    const correct=choice===current.answer;
    return <main className={`quiz-shell ${mode}-quiz`}>
      <header className="quiz-head">
        <button onClick={()=>setScreen("lesson")}>← 중단</button>
        <div><span>{lesson.id}강 · {mode==="practice"?"연습":"보스전"}</span><strong>{encounter.name}</strong></div>
        <b className="gold-badge">{progress.gold} G</b>
      </header>
      <div className="progress"><i style={{width:`${((index+1)/quizLength)*100}%`}}/></div>
      <section className="question">
        <div className={`battle-opponent ${choice?(correct?"hit":"counter"):""}`}>
          <Image src={encounter.image} alt={encounter.name} width={92} height={72}/>
          <div><small>{mode==="practice"?"연습 상대":`${level}단계 보스`}</small><strong>{encounter.name}</strong><span>{encounter.type}</span></div>
          <b>{choice?(correct?"정답!":"반격!"):`${index+1}/${quizLength}`}</b>
        </div>
        <div className="q-meta"><span>문제 {index+1} / {quizLength}</span><span>{mode==="practice"?"정답마다 +10 G":"통과 기준 9 / 10"}</span></div>
        <p className="pdf-page">주 출처 · 최태성 강의 필기 {current.page}</p>
        <h1>{current.prompt}</h1>
        <div className="choices">{current.choices.map((item,i)=>{
          const className=choice?(item===current.answer?"correct":item===choice?"wrong":"dim"):"";
          return <button key={item} className={className} onClick={()=>answer(item)} disabled={Boolean(choice)}><span>{i+1}</span>{item}</button>;
        })}</div>
        {choice&&<div className={`explain ${correct?"right":"miss"}`}>
          <strong>{correct?"정답입니다!":"아쉽지만 해설로 다시 기억해요."}</strong>
          <p>{current.explanation}</p>
          <small className="question-source">근거: {current.source}<span className="source-links"><a href={current.noteUrl} target="_blank" rel="noreferrer">해당 필기 보기 ↗</a><a href={current.sourceUrl} target="_blank" rel="noreferrer">검증 자료 ↗</a></span></small>
          <button className="primary" onClick={next}>{index===quizLength-1?"결과 확인":"다음 문제"} →</button>
        </div>}
      </section>
    </main>;
  }

  if(screen==="result"&&encounter){
    const practice=mode==="practice";
    const won=!practice&&score>=9;
    const collected=practice||won;
    const wrong=answers.filter(item=>!item.correct);
    return <main className="result-shell"><section className={`result ${practice||won?"passed":""}`}>
      <Image className="result-art" src={encounter.image} alt={encounter.name} width={150} height={112}/>
      <p className="eyebrow">{lesson.id}강 · {practice?"연습 완료":`${level}단계 보스전`}</p>
      <h1>{practice?`${score*10} 골드 획득!`:won?"보스를 쓰러뜨렸습니다!":"9문제를 맞히면 승리합니다"}</h1>
      <div className="result-score"><strong>{score}</strong><span>/ {quizLength}</span></div>
      {collected&&<p className="collection-added">도감에 ‘{encounter.name}’이 등록되었습니다.</p>}
      {wrong.length>0&&<div className="review"><h2>이번 오답 개념</h2>{wrong.map(item=><div key={item.question.id}><strong>{item.question.concept}</strong><small>강의 필기 {item.question.page}</small><p>{item.question.explanation}</p></div>)}</div>}
      <div className="actions">
        {practice?<button className="primary" onClick={startPractice}>다시 연습하기</button>:won?<button className="primary" onClick={()=>setScreen("lesson")}>다음 보스 준비</button>:<button className="primary" onClick={startPractice}>연습하기</button>}
        <button className="secondary" onClick={openCollection}>도감 보기</button>
        <button className="secondary" onClick={()=>setScreen("lesson")}>강의로 돌아가기</button>
      </div>
    </section></main>;
  }

  if(screen==="collection"){
    return <main>{nav}
      <section className="simple-hero"><p className="eyebrow">한국사 도감</p><h1>{collectionCount} / {encounters.length} 수집</h1><p>연습을 마치거나 보스를 처치하면 등록됩니다.</p></section>
      <section className="collection-section">{playableLessonIds.map(lessonId=><div className="collection-group" key={lessonId}>
        <h2>{lessonId}강</h2>
        <div className="collection-grid">{encounters.filter(item=>item.lessonId===lessonId).map(item=>{
          const unlocked=progress.collection[item.id];
          return <article className={unlocked?"":"locked"} key={item.id}>
            {unlocked?<Image src={item.image} alt={item.name} width={180} height={180}/>:<div className="locked-art">?</div>}
            <div><small>{unlocked?`${item.type} · ${item.role==="boss"?"보스":"연습"}`:"미발견"}</small><h3>{unlocked?item.name:"아직 만나지 못했습니다"}</h3>
              {unlocked&&<><p>{item.summary}</p><b>{item.examTip}</b><span className="collection-links"><a href={item.noteUrl} target="_blank" rel="noreferrer">{item.page} 필기 ↗</a><a href={item.sourceUrl} target="_blank" rel="noreferrer">검증 자료 ↗</a></span></>}
            </div>
          </article>;
        })}</div>
      </div>)}</section>
    </main>;
  }

  if(screen==="leaderboard"){
    return <main>{nav}
      <section className="simple-hero"><p className="eyebrow">명예의 전당</p><h1>한국사 원정대 TOP 10</h1><p>보스 처치 수, 총 획득 골드, 보유 골드 순으로 정합니다.</p></section>
      <section className="ranking-section">
        {user?<div className="my-ranking"><div><small>나의 순위</small><strong>{ranking.me?`${ranking.me.rank}위`:"기록 대기 중"}</strong><span>{user.displayName}{anonymousUser?" · 이 브라우저에서만 이어집니다.":""}</span></div><div><small>총 골드</small><strong>{ranking.me?.totalGold??progress.totalGold} G</strong></div><div><small>보스</small><strong>{ranking.me?.bossesDefeated??totalDefeated}명</strong></div><FirebaseAuthButton authenticated firebaseUser={firebaseUser} anonymousUser={anonymousUser} fallbackHref={signOutHref}/></div>
          :<div className="signin-panel"><div><strong>로그인하면 기록이 계정에 저장됩니다.</strong><p>Google 계정 또는 익명 계정으로 골드와 보스 진행 상황을 저장할 수 있습니다.</p></div><Link className="auth-page-link" href="/">로그인하기</Link></div>}
        <div className="ranking-table"><div className="ranking-head"><span>순위</span><span>도전자</span><span>보스</span><span>총 골드</span><span>진행</span></div>
          {rankingLoading?<p className="ranking-empty">순위표를 불러오는 중...</p>:ranking.players.length===0?<p className="ranking-empty">아직 등록된 도전자가 없습니다.</p>:ranking.players.map(player=><div className="ranking-row" key={`${player.rank}-${player.displayName}`}><b>{player.rank}</b><strong>{player.displayName}</strong><span>{player.bossesDefeated}명</span><span>{player.totalGold} G</span><span className="mini-progress"><i style={{width:`${player.bossesDefeated/90*100}%`}}/><small>완료 강의 {Object.values(player.lessonBosses??{}).filter(count=>count===3).length}/30</small></span></div>)}
        </div>
      </section>
    </main>;
  }

  if(screen==="lesson"){
    const done=defeatedCount(progress,lesson.id);
    const trainingLevel=nextBoss(progress,lesson.id);
    return <main>{nav}
      <section className="lesson-hero"><div><p className="eyebrow">{lesson.id}강 보스 원정</p><h1>{lesson.title}</h1><p>연습 5문제로 골드를 모으고, 보스전에서 10문제 중 9문제를 맞히세요.</p></div><div className="lesson-stat"><span>보스 처치</span><strong>{done}<small>/3</small></strong><div><i style={{width:`${done/3*100}%`}}/></div></div></section>
      <section className="stage-section">
        <div className="section-head"><div><p className="eyebrow">연습과 보스전</p><h2>한 단계씩 도전하세요</h2></div><a href={lesson.videoUrl} target="_blank" rel="noreferrer">강의 다시 보기 ↗</a></div>
        <div className="practice-panel"><div><p>연습 · {trainingLevel}단계 문제</p><h3>5문제, 정답마다 10 G</h3><span>연습 상대는 시작할 때 공개됩니다.</span></div><div className="practice-reward"><strong>{progress.gold} G</strong><button className="primary" onClick={startPractice}>연습 시작</button></div></div>
        <div className="bosses">{bossLevels.map(item=>{
          const target=bossEncounter(lesson.id,item)!;
          const defeated=progress.defeated[bossKey(lesson.id,item)];
          const unlocked=item===1||progress.defeated[bossKey(lesson.id,(item-1) as BossLevel)];
          const cost=defeated?0:bossCosts[item];
          const affordable=progress.gold>=cost;
          return <article key={item} className={`${defeated?"complete":""} ${!unlocked?"locked":""}`}>
            <Image className="boss-art" src={target.image} alt={target.name} width={320} height={220}/>
            <p>{item}단계 보스</p><h3>{target.name}</h3><span>{target.summary}</span>
            <div className="boss-stats"><span>10문제</span><span>통과 9/10</span><b>{defeated?"복습 무료":`${cost} G`}</b></div>
            <button onClick={()=>startBoss(item)} disabled={!unlocked||!affordable}>{defeated?"다시 도전":!unlocked?"이전 보스 필요":!affordable?`${cost-progress.gold} G 부족`:"보스 도전"}</button>
          </article>;
        })}</div>
      </section>
    </main>;
  }

  return <main>{nav}
    <section className="home-hero"><div><p className="eyebrow">한국사 퀴즈 원정</p><h1>연습하고<br/><em>보스를 쓰러뜨리세요</em></h1><p className="hero-desc">5문제 연습으로 골드를 모으고, 각 강의의 보스 3명에게 도전하세요. 만난 유물과 유적은 도감에 기록됩니다.</p><button className="primary" onClick={()=>goLesson(lessons[0])}>첫 원정 시작 →</button></div>
      <div className="master"><div><span>현재 칭호</span><span className="gold-text">{progress.gold} G</span></div><strong>{rank}</strong><p>보스 {totalDefeated}/90 · 도감 {collectionCount}/{encounters.length}</p><button className="rank-button" onClick={openCollection}>도감 보기</button><button className="rank-button" onClick={openLeaderboard}>TOP 10 보기</button></div>
    </section>
    <section className="curriculum"><div className="section-head"><div><p className="eyebrow">30강 지도</p><h2>현재 1~30강 전체를 플레이할 수 있습니다</h2></div></div>
      <div className="lessons">{lessons.map(item=>{const done=defeatedCount(progress,item.id);return <button key={item.id} className={item.status} onClick={()=>goLesson(item)} disabled={item.status==="coming"}><span className="lesson-no">{String(item.id).padStart(2,"0")}</span><div><strong>{item.shortTitle}</strong><span>{item.status==="ready"?`보스 ${done}/3`:"준비 중"}</span></div><b>{done===3?"✓":item.status==="ready"?"→":"·"}</b></button>})}</div>
    </section>
  </main>;
}

function Nav({home,gold,user,onLeaderboard,onCollection,collectionCount}:{home?:()=>void;gold:number;user:User|null;onLeaderboard:()=>void;onCollection:()=>void;collectionCount:number}){
  return <nav><button className="brand" onClick={home}><span>史</span>한국사 수련장</button><span>기본별개념 · 30강 원정</span><button className="nav-rank" onClick={onCollection}>도감 {collectionCount}/{encounters.length}</button><button className="nav-rank" onClick={onLeaderboard}>TOP 10</button><b className="nav-gold">{gold} G</b>{user&&<small className="nav-user">{user.displayName}</small>}{home&&<button className="nav-link" onClick={home}>전체 강의</button>}</nav>;
}

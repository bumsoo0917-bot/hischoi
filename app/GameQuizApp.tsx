"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { bossEncounter, encounterById, practiceEncounters } from "./encounters";
import { Lesson, Question, lessons, questionBank } from "./questions";
import FirebaseAuthButton from "./FirebaseAuthButton";
import AppNavigation from "./AppNavigation";
import { collectionEncounters, COLLECTION_TOTAL, lessonCollectionEncounters, LESSON_COLLECTION_TOTAL, VISUAL_COLLECTION_TOTAL, visualOnlyEncounterIds } from "./collection-data";
import { bossCountForLesson, clientProgressSummary, emptyClientProgress, migrateClientProgress, PROGRESS_STORAGE_KEY, progressWrite, type ClientProgress } from "./client-progress";
import { rewards } from "../lib/gamification";

type BossLevel=1|2|3;
type Screen="home"|"lesson"|"quiz"|"result"|"leaderboard"|"collection";
type Mode="practice"|"boss";
type LessonEraKey="ancient"|"goryeo"|"joseon"|"occupation"|"modern";
type CollectionType="전체"|"인물"|"유물"|"유적"|"역사 자료";
type User={displayName:string;email:string};
type RankingPlayer={rank:number;displayName:string;currentGold:number;totalGold:number;bossesDefeated:number;masteredLessons:number;lessonBosses:Record<number,number>};
type RankingData={players:Array<RankingPlayer&{xp:number;level:number;title:string}>;me:(RankingPlayer&{xp:number;level:number;title:string;rewardVersion:number;visualCorrect:number;selectedTitle:string;titles:string[];defeated:Record<string,boolean>;collection:Record<string,boolean>;attempts:Record<string,number>;perfectBosses:Record<string,boolean>;visualPerfectEras:Record<string,boolean>})|null};
type Answer={question:Question;selected:string;correct:boolean};

const bossLevels:BossLevel[]=[1,2,3];
const bossCosts:Record<BossLevel,number>={1:30,2:50,3:70};
const bossKey=(lesson:number,level:BossLevel)=>`${lesson}-${level}`;
const playableLessonIds=Array.from({length:30},(_,index)=>index+1);
const lessonEraGroups:{id:LessonEraKey;label:string;period:string;from:number;to:number}[]=[
  {id:"ancient",label:"선사·고대",period:"1~7강",from:1,to:7},
  {id:"goryeo",label:"고려",period:"8~12강",from:8,to:12},
  {id:"joseon",label:"조선",period:"13~18강",from:13,to:18},
  {id:"occupation",label:"개항·일제",period:"19~27강",from:19,to:27},
  {id:"modern",label:"현대",period:"28~30강",from:28,to:30},
];
const collectionTypes:CollectionType[]=["전체","인물","유물","유적","역사 자료"];
const eraForLesson=(lessonId:number)=>lessonEraGroups.find(group=>lessonId>=group.from&&lessonId<=group.to)??lessonEraGroups[0];

function shuffle<T>(items:T[]){
  const copy=[...items];
  for(let i=copy.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
}

function choose(pool:Question[],progress:ClientProgress,count:number){
  const recent=new Set(progress.recent.slice(-20));
  return pool.map(question=>({
    question,
    priority:(progress.seen[question.id]?0:1000)+(progress.wrong[question.id]??0)*100-(recent.has(question.id)?500:0)+Math.random()*50,
  })).sort((a,b)=>b.priority-a.priority).slice(0,count)
    .map(({question})=>({...question,choices:shuffle(question.choices)}));
}

const defeatedCount=bossCountForLesson;

function nextBoss(progress:ClientProgress,lesson:number):BossLevel{
  return bossLevels.find(level=>!progress.defeated[bossKey(lesson,level)])??3;
}

export default function GameQuizApp({user,signOutHref,firebaseUser=false,anonymousUser=false}:{user:User|null;signOutHref:string;firebaseUser?:boolean;anonymousUser?:boolean}){
  const [screen,setScreen]=useState<Screen>("home");
  const [progress,setProgress]=useState<ClientProgress>(emptyClientProgress);
  const [ready,setReady]=useState(false);
  const [serverReady,setServerReady]=useState(!user);
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
  const [homeEra,setHomeEra]=useState<LessonEraKey|null>(null);
  const [collectionEra,setCollectionEra]=useState<LessonEraKey>("ancient");
  const [collectionType,setCollectionType]=useState<CollectionType>("전체");
  const [collectionFoundOnly,setCollectionFoundOnly]=useState(false);
  const [collectionSource,setCollectionSource]=useState<"전체"|"강의"|"그림 퀴즈">("전체");
  const [showTitles,setShowTitles]=useState(false);
  const [resultReward,setResultReward]=useState({gold:0,xp:0,newTitles:[] as string[]});

  // Local storage is an external progress store; hydration intentionally happens once after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{setProgress(migrateClientProgress(localStorage.getItem(PROGRESS_STORAGE_KEY)));setReady(true)},[]);
  useEffect(()=>{if(ready)localStorage.setItem(PROGRESS_STORAGE_KEY,JSON.stringify(progress))},[progress,ready]);
  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      const view=new URLSearchParams(window.location.search).get("view");
      if(view==="collection")setScreen("collection");
      if(view==="leaderboard"){
        setScreen("leaderboard");setRankingLoading(true);
        fetch("/api/leaderboard",{cache:"no-store"}).then(response=>response.ok?response.json():Promise.reject())
          .then((data:RankingData)=>setRanking(data)).finally(()=>setRankingLoading(false));
      }
    },0);
    return()=>window.clearTimeout(timer);
  },[]);
  useEffect(()=>{
    if(!ready)return;
    if(!user)return;
    let active=true;
    fetch("/api/leaderboard",{cache:"no-store"})
      .then(response=>response.ok?response.json():Promise.reject())
      .then((data:RankingData)=>{
        if(!active)return;
        setRanking(data);
        if(data.me)setProgress(old=>({...old,gold:data.me!.currentGold,totalGold:data.me!.totalGold,xp:data.me!.xp,rewardVersion:data.me!.rewardVersion,visualCorrect:data.me!.visualCorrect,selectedTitle:data.me!.selectedTitle,defeated:data.me!.defeated,collection:data.me!.collection,attempts:data.me!.attempts,perfectBosses:data.me!.perfectBosses,visualPerfectEras:data.me!.visualPerfectEras}));
      }).finally(()=>{if(active)setServerReady(true)});
    return()=>{active=false};
  },[ready,user]);
  useEffect(()=>{
    if(!ready||!serverReady||!user)return;
    const timer=setTimeout(()=>fetch("/api/leaderboard",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify(progressWrite(progress)),
    }).catch(()=>{}),250);
    return()=>clearTimeout(timer);
  },[progress,ready,serverReady,user]);

  const current=quiz[index];
  const score=answers.filter(answer=>answer.correct).length;
  const quizLength=mode==="practice"?5:10;
  const progressSummary=clientProgressSummary(progress);
  const totalDefeated=progressSummary.bossesDefeated;
  const mastered=progressSummary.masteredLessons;
  const collectionCount=progressSummary.collectionCount;
  const lessonCollectionCount=lessonCollectionEncounters.filter(item=>progress.collection[item.id]).length;
  const visualCollectionCount=progressSummary.visualOnlyCollected;
  const encounter=encounterById(encounterId);
  const recommendedLesson=lessons.find(item=>item.status==="ready"&&defeatedCount(progress,item.id)<3)??lessons[lessons.length-1];
  const recommendedDone=defeatedCount(progress,recommendedLesson.id);
  const recommendedEra=eraForLesson(recommendedLesson.id);
  const activeHomeEra=lessonEraGroups.find(group=>group.id===(homeEra??recommendedEra.id))??recommendedEra;
  const homeLessons=lessons.filter(item=>item.id>=activeHomeEra.from&&item.id<=activeHomeEra.to);
  const collectionGroup=lessonEraGroups.find(group=>group.id===collectionEra)??lessonEraGroups[0];
  const overallProgress=Math.round(totalDefeated/90*100);
  const rank=progressSummary.selectedTitle;
  const playerLevel=progressSummary.level;

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
    setIndex(0);setAnswers([]);setChoice(null);setResultReward({gold:0,xp:0,newTitles:[]});setScreen("quiz");scrollTo({top:0});
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
    const firstClear=won&&!progress.defeated[attempt];
    const firstPerfect=mode==="boss"&&score===10&&!progress.perfectBosses[attempt];
    const firstMaster=firstClear&&defeatedCount(progress,lesson.id)===2;
    const goldEarned=mode==="practice"?score*rewards.practiceGoldPerCorrect:0;
    const xpEarned=mode==="practice"
      ?score*rewards.practiceXpPerCorrect
      :score*rewards.bossXpPerCorrect+(firstClear?rewards.bossFirstClearXp:0)+(firstPerfect?rewards.bossFirstPerfectXp:0)+(firstMaster?rewards.lessonMasterXp:0);
    const collect=mode==="practice"||won;
    const preview:ClientProgress={...progress,gold:progress.gold+goldEarned,totalGold:progress.totalGold+goldEarned,xp:progress.xp+xpEarned,defeated:{...progress.defeated,...(firstClear?{[attempt]:true}:{})},collection:{...progress.collection,...(collect?{[encounterId]:true}:{})},perfectBosses:{...progress.perfectBosses,...(firstPerfect?{[attempt]:true}:{})}};
    const beforeTitles=progressSummary.titles;
    const newTitles=clientProgressSummary(preview).titles.filter(title=>!beforeTitles.includes(title));
    setResultReward({gold:goldEarned,xp:xpEarned,newTitles});
    setProgress(old=>{
      const seen={...old.seen},wrong={...old.wrong};
      answers.forEach(item=>{
        seen[item.question.id]=(seen[item.question.id]??0)+1;
        if(!item.correct)wrong[item.question.id]=(wrong[item.question.id]??0)+1;
      });
      return {
        ...old,
        gold:old.gold+goldEarned,
        totalGold:old.totalGold+goldEarned,
        xp:old.xp+xpEarned,
        defeated:{...old.defeated,...(firstClear?{[attempt]:true}:{})},
        collection:{...old.collection,...(collect?{[encounterId]:true}:{})},
        perfectBosses:{...old.perfectBosses,...(firstPerfect?{[attempt]:true}:{})},
        attempts:{...old.attempts,[`${mode}-${attempt}`]:(old.attempts[`${mode}-${attempt}`]??0)+1},
        seen,wrong,
        recent:[...old.recent,...answers.map(item=>item.question.id)].slice(-50),
        recentEncounters:[...old.recentEncounters,encounterId].slice(-10),
      };
    });
    setScreen("result");scrollTo({top:0,behavior:"smooth"});
  };

  if(!ready)return <main className="loading"><span>史</span><p>모험 기록을 불러오는 중...</p></main>;

  const nav=<AppNavigation gold={progress.gold} userName={user?.displayName} onBrandClick={()=>setScreen("home")} items={[
    {label:"30강 원정",shortLabel:"원정",active:screen==="home"||screen==="lesson",onClick:()=>setScreen("home")},
    {label:"그림 퀴즈",shortLabel:"그림 퀴즈",href:"/era-visual-quiz"},
    {label:`도감 ${collectionCount}/${COLLECTION_TOTAL}`,shortLabel:"도감",active:screen==="collection",onClick:openCollection},
    {label:"TOP 10",shortLabel:"순위",active:screen==="leaderboard",onClick:openLeaderboard},
  ]}/>;

  if(screen==="quiz"&&current&&encounter){
    const correct=choice===current.answer;
    const correctCount=answers.filter(item=>item.correct).length;
    const wrongCount=answers.length-correctCount;
    const combo=answerStreak(answers);
    const bossHp=Math.max(0,90-correctCount*10);
    const shield=Math.max(0,1-wrongCount);
    return <main className={`quiz-shell ${mode}-quiz`}>
      <header className="quiz-head">
        <button className="quiet-button" onClick={()=>setScreen("lesson")}>← 중단</button>
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
        {mode==="boss"&&<div className="battle-hud">
          <div className="boss-hp"><span><b>{encounter.name}</b><small>{bossHp} / 90 HP</small></span><div><i style={{width:`${bossHp/90*100}%`}}/></div></div>
          <div className={`player-shield ${shield===0?"broken":""}`}><span>나의 방패</span><b>{shield?"●":"○"}</b><small>{wrongCount>=2?"승리 조건 실패 · 끝까지 복습하세요":shield?"한 번의 실수를 막을 수 있습니다":"다음 오답부터 승리할 수 없습니다"}</small></div>
          {combo>=2&&<strong className={`combo combo-${Math.min(combo,5)}`}>{combo}연속 정답{combo>=5?" · 금빛 일격!":"!"}</strong>}
        </div>}
        {mode==="practice"&&combo>=2&&<div className="practice-combo">{combo}연속 정답!</div>}
        <div className="q-meta"><span>문제 {index+1} / {quizLength}</span><span>{mode==="practice"?"정답마다 +10 G":"통과 기준 9 / 10"}</span></div>
        <p className="question-kicker">{lesson.id}강 · {mode==="practice"?"개념 연습":`${level}단계 보스전`}</p>
        <h1>{current.prompt}</h1>
        <div className="choices">{current.choices.map((item,i)=>{
          const className=choice?(item===current.answer?"correct":item===choice?"wrong":"dim"):"";
          return <button key={item} className={className} onClick={()=>answer(item)} disabled={Boolean(choice)}><span>{i+1}</span>{item}</button>;
        })}</div>
        {choice&&<div className={`explain ${correct?"right":"miss"}`}>
          <strong>{correct?"정답입니다!":"아쉽지만 해설로 다시 기억해요."}</strong>
          <p>{current.explanation}</p>
          <details className="source-details"><summary>문제 근거 확인</summary><small className="question-source">근거: {current.source}<span className="source-links"><a href={current.noteUrl} target="_blank" rel="noreferrer">강의 필기 {current.page} ↗</a><a href={current.sourceUrl} target="_blank" rel="noreferrer">검증 자료 ↗</a></span></small></details>
          <div className="answer-actions"><button className="primary" onClick={next}>{index===quizLength-1?"결과 확인":"다음 문제"} →</button></div>
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
      <div className="reward-summary"><span><small>획득 골드</small><strong>+{resultReward.gold} G</strong></span><span><small>획득 경험치</small><strong>+{resultReward.xp} XP</strong></span></div>
      {collected&&<p className="collection-added">도감에 ‘{encounter.name}’이 등록되었습니다.</p>}
      {resultReward.newTitles.length>0&&<div className="title-unlocked"><small>새 칭호 획득</small><strong>{resultReward.newTitles.join(" · ")}</strong></div>}
      {wrong.length>0&&<div className="review"><h2>이번 오답 개념</h2>{wrong.map(item=><div key={item.question.id}><strong>{item.question.concept}</strong><small>강의 필기 {item.question.page}</small><p>{item.question.explanation}</p></div>)}</div>}
      <div className="actions">
        {practice?<button className="primary" onClick={()=>setScreen("lesson")}>보스 준비하기</button>:won?<button className="primary" onClick={()=>setScreen("lesson")}>다음 보스 준비</button>:<button className="primary" onClick={startPractice}>연습하고 다시 도전</button>}
        {practice&&<button className="secondary" onClick={startPractice}>다시 연습하기</button>}
        <button className="secondary" onClick={openCollection}>도감 보기</button>
        <button className="secondary" onClick={()=>setScreen("lesson")}>강의로 돌아가기</button>
      </div>
    </section></main>;
  }

  if(screen==="collection"){
    const visibleLessonIds=playableLessonIds.filter(id=>id>=collectionGroup.from&&id<=collectionGroup.to);
    return <main className="app-screen">{nav}
      <section className="simple-hero collection-hero"><p className="eyebrow">한국사 도감</p><h1>{collectionCount} / {COLLECTION_TOTAL} 수집</h1><p>강의 도감 {lessonCollectionCount}/{LESSON_COLLECTION_TOTAL} · 그림 퀴즈 도감 {visualCollectionCount}/{VISUAL_COLLECTION_TOTAL}</p><div className="hero-progress"><i style={{width:`${collectionCount/COLLECTION_TOTAL*100}%`}}/></div></section>
      <section className="collection-section">
        <div className="filter-panel" aria-label="도감 필터">
          <div className="filter-row"><strong>시대</strong><div>{lessonEraGroups.map(group=><button key={group.id} className={collectionEra===group.id?"active":""} onClick={()=>setCollectionEra(group.id)}>{group.label}</button>)}</div></div>
          <div className="filter-row"><strong>종류</strong><div>{collectionTypes.map(type=><button key={type} className={collectionType===type?"active":""} onClick={()=>setCollectionType(type)}>{type}</button>)}</div></div>
          <div className="filter-row"><strong>출처</strong><div>{(["전체","강의","그림 퀴즈"] as const).map(source=><button key={source} className={collectionSource===source?"active":""} onClick={()=>setCollectionSource(source)}>{source}</button>)}</div></div>
          <label className="found-toggle"><input type="checkbox" checked={collectionFoundOnly} onChange={event=>setCollectionFoundOnly(event.target.checked)}/> 발견한 항목만 보기</label>
        </div>
        {visibleLessonIds.map(lessonId=>{
          const lessonItems=collectionEncounters.filter(item=>item.lessonId===lessonId&&(collectionType==="전체"||item.type===collectionType)&&(collectionSource==="전체"||(collectionSource==="그림 퀴즈"?visualOnlyEncounterIds.has(item.id):!visualOnlyEncounterIds.has(item.id)))&&(!collectionFoundOnly||progress.collection[item.id]));
          if(!lessonItems.length)return null;
          return <div className="collection-group" key={lessonId}>
        <h2>{lessonId}강</h2>
        <div className="collection-grid">{lessonItems.map(item=>{
          const unlocked=progress.collection[item.id];
          return <article className={unlocked?"":"locked"} key={item.id}>
            {unlocked?<Image src={item.image} alt={item.name} width={180} height={180}/>:<div className="locked-art">?</div>}
            <div><small>{unlocked?`${item.type} · ${item.role==="boss"?"보스":"연습"}`:"미발견"}</small><h3>{unlocked?item.name:"아직 만나지 못했습니다"}</h3>
              {unlocked&&<><p>{item.summary}</p><b>{item.examTip}</b><span className="collection-links"><a href={item.noteUrl} target="_blank" rel="noreferrer">{item.page} 필기 ↗</a><a href={item.sourceUrl} target="_blank" rel="noreferrer">검증 자료 ↗</a></span></>}
            </div>
          </article>;
        })}</div>
      </div>})}</section>
    </main>;
  }

  if(screen==="leaderboard"){
    const podium=ranking.players.slice(0,3);
    const remaining=ranking.players.slice(3);
    return <main className="app-screen">{nav}
      <section className="simple-hero"><p className="eyebrow">명예의 전당</p><h1>한국사 원정대 TOP 10</h1><p>보스 처치 수, 총 획득 골드, 보유 골드 순으로 정합니다.</p></section>
      <section className="ranking-section">
        {user?<div className="my-ranking"><div><small>나의 순위</small><strong>{ranking.me?`${ranking.me.rank}위`:"기록 대기 중"}</strong><span>{user.displayName} · Lv.{ranking.me?.level??playerLevel.level} · {ranking.me?.title??rank}{anonymousUser?" · 이 브라우저에서만 이어집니다.":""}</span></div><div><small>총 골드</small><strong>{ranking.me?.totalGold??progress.totalGold} G</strong></div><div><small>보스</small><strong>{ranking.me?.bossesDefeated??totalDefeated}명</strong></div><FirebaseAuthButton authenticated firebaseUser={firebaseUser} anonymousUser={anonymousUser} fallbackHref={signOutHref}/></div>
          :<div className="signin-panel"><div><strong>로그인하면 기록이 계정에 저장됩니다.</strong><p>Google 계정 또는 익명 계정으로 골드와 보스 진행 상황을 저장할 수 있습니다.</p></div><Link className="auth-page-link" href="/">로그인하기</Link></div>}
        {!rankingLoading&&podium.length>0&&<div className="podium">{podium.map(player=><article key={`${player.rank}-${player.displayName}`} className={player.rank===1?"first":""}><span>{player.rank}위</span><strong>{player.displayName}</strong><small>Lv.{player.level} · {player.title}</small><p>보스 {player.bossesDefeated}명</p><b>{player.totalGold} G</b></article>)}</div>}
        <div className="ranking-table"><div className="ranking-head"><span>순위</span><span>도전자</span><span>보스</span><span>총 골드</span><span>진행</span></div>
          {rankingLoading?<p className="ranking-empty">순위표를 불러오는 중...</p>:ranking.players.length===0?<p className="ranking-empty">아직 등록된 도전자가 없습니다.</p>:(remaining.length?remaining:ranking.players).map(player=><div className="ranking-row" key={`${player.rank}-${player.displayName}`}><b>{player.rank}</b><span className="ranking-name"><strong>{player.displayName}</strong><small>Lv.{player.level} · {player.title}</small></span><span>{player.bossesDefeated}명</span><span>{player.totalGold} G</span><span className="mini-progress"><i style={{width:`${player.bossesDefeated/90*100}%`}}/><small>완료 강의 {Object.values(player.lessonBosses??{}).filter(count=>count===3).length}/30</small></span></div>)}
        </div>
      </section>
    </main>;
  }

  if(screen==="lesson"){
    const done=defeatedCount(progress,lesson.id);
    const trainingLevel=nextBoss(progress,lesson.id);
    return <main className="app-screen">{nav}
      <section className="lesson-hero"><div><p className="eyebrow">{lesson.id}강 보스 원정</p><h1>{lesson.title}</h1><p>연습 5문제로 골드를 모으고, 보스전에서 10문제 중 9문제를 맞히세요.</p></div><div className="lesson-stat"><span>보스 처치</span><strong>{done}<small>/3</small></strong><div><i style={{width:`${done/3*100}%`}}/></div></div></section>
      <section className="stage-section">
        <div className="section-head"><div><p className="eyebrow">연습과 보스전</p><h2>한 단계씩 도전하세요</h2></div><a href={lesson.videoUrl} target="_blank" rel="noreferrer">강의 다시 보기 ↗</a></div>
        <div className="practice-panel"><div><p>연습 · {trainingLevel}단계 문제</p><h3>5문제, 정답마다 10 G · 5 XP</h3><span>연습 상대는 시작할 때 공개됩니다.</span></div><div className="practice-reward"><strong>{progress.gold} G</strong><button className="primary" onClick={startPractice}>연습 시작</button></div></div>
        <div className="bosses">{bossLevels.map(item=>{
          const target=bossEncounter(lesson.id,item)!;
          const defeated=progress.defeated[bossKey(lesson.id,item)];
          const unlocked=item===1||progress.defeated[bossKey(lesson.id,(item-1) as BossLevel)];
          const cost=defeated?0:bossCosts[item];
          const affordable=progress.gold>=cost;
          return <article key={item} className={`${defeated?"complete":""} ${!unlocked?"locked":""}`}>
            <div className="boss-card-head"><span>{item}단계</span><b>{defeated?"처치 완료":!unlocked?"잠김":affordable?"도전 가능":`${cost-progress.gold} G 부족`}</b></div>
            <Image className="boss-art" src={target.image} alt={target.name} width={320} height={220}/>
            <p>보스</p><h3>{target.name}</h3><span>{target.summary}</span>
            <div className="boss-stats"><span>10문제</span><span>통과 9/10</span><span>정답 +8 XP</span><b>{defeated?"복습 무료":`${cost} G`}</b></div>
            <button onClick={()=>startBoss(item)} disabled={!unlocked||!affordable}>{defeated?"다시 도전":!unlocked?"이전 보스 필요":!affordable?`${cost-progress.gold} G 부족`:"보스 도전"}</button>
          </article>;
        })}</div>
      </section>
    </main>;
  }

  return <main className="app-screen">{nav}
    <section className="home-dashboard">
      <article className="continue-card">
        <div className="continue-copy"><p className="eyebrow">이어서 하기</p><h1>{recommendedLesson.id}강 · {recommendedLesson.shortTitle}</h1><p>{recommendedDone===3?"달인으로 완료한 강의입니다. 복습으로 기억을 확인해 보세요.":`${recommendedDone}단계 보스까지 처치했습니다. ${nextBoss(progress,recommendedLesson.id)}단계 도전을 준비하세요.`}</p></div>
        <div className="continue-progress"><span><b>{recommendedDone}</b>/3 보스</span><div><i style={{width:`${recommendedDone/3*100}%`}}/></div></div>
        <div className="hero-actions"><button className="primary" onClick={()=>goLesson(recommendedLesson)}>원정 계속하기 →</button><Link className="secondary" href="/era-visual-quiz">그림 퀴즈</Link></div>
      </article>
      <aside className="profile-card"><div><span>Lv.{playerLevel.level} · {playerLevel.label}</span><b className="gold-text">{progress.gold} G</b></div><div className="title-line"><h2>{rank}</h2><button onClick={()=>setShowTitles(value=>!value)}>업적·칭호 {Math.max(0,progressSummary.titles.length-1)}</button></div>{showTitles&&<div className="title-picker" role="dialog" aria-label="획득 업적과 대표 칭호 선택">{progressSummary.titles.map(title=><button key={title} className={title===rank?"active":""} onClick={()=>{setProgress(old=>({...old,selectedTitle:title}));setShowTitles(false)}}>{title===rank?"✓ ":""}{title}</button>)}</div>}<div className="xp-progress"><span>{playerLevel.current} / {playerLevel.required} XP</span><div><i style={{width:`${playerLevel.percent}%`}}/></div></div><div className="profile-stats"><span><small>쓰러뜨린 보스</small><strong>{totalDefeated}<b>/90</b></strong></span><span><small>도감 수집</small><strong>{collectionCount}<b>/{COLLECTION_TOTAL}</b></strong></span><span><small>완료 강의</small><strong>{mastered}<b>/30</b></strong></span></div><div className="overall-progress"><span>전체 원정 {overallProgress}%</span><div><i style={{width:`${overallProgress}%`}}/></div></div></aside>
    </section>
    <section className="curriculum"><div className="section-head"><div><p className="eyebrow">30강 원정 지도</p><h2>시대별로 강의를 선택하세요</h2></div><span className="section-period">{activeHomeEra.label} · {activeHomeEra.period}</span></div>
      <div className="era-tabs" role="group" aria-label="강의 시대 선택">{lessonEraGroups.map(group=><button key={group.id} className={activeHomeEra.id===group.id?"active":""} onClick={()=>setHomeEra(group.id)}>{group.label}<small>{group.period}</small></button>)}</div>
      <div className="lessons">{homeLessons.map(item=>{const done=defeatedCount(progress,item.id);return <button key={item.id} className={`${item.status} ${done===3?"complete":done>0?"in-progress":""}`} onClick={()=>goLesson(item)} disabled={item.status==="coming"}><span className="lesson-no">{String(item.id).padStart(2,"0")}</span><div><strong>{item.shortTitle}</strong><span>{done===3?"달인 완료":done>0?`진행 중 · 보스 ${done}/3`:item.status==="ready"?"미도전":"준비 중"}</span></div><b>{done===3?"✓":"→"}</b></button>})}</div>
    </section>
  </main>;
}

function answerStreak(items:Answer[]){
  let streak=0;
  for(let index=items.length-1;index>=0&&items[index].correct;index-=1)streak+=1;
  return streak;
}

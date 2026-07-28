"use client";
import { useEffect, useMemo, useState } from "react";
import { Lesson, Question, lessons, questionBank } from "./questions";

type BossLevel=1|2|3;
type Screen="home"|"lesson"|"quiz"|"result"|"leaderboard";
type Mode="practice"|"boss";
type User={displayName:string;email:string};
type RankingPlayer={rank:number;displayName:string;currentGold:number;totalGold:number;bossesDefeated:number;lesson1Bosses:number;lesson2Bosses:number};
type RankingData={players:RankingPlayer[];me:(RankingPlayer&{defeated:Record<string,boolean>})|null};
type Progress={
  defeated:Record<string,boolean>;
  attempts:Record<string,number>;
  seen:Record<string,number>;
  wrong:Record<string,number>;
  recent:string[];
  gold:number;
  totalGold:number;
};
type Answer={question:Question;selected:string;correct:boolean};

const empty:Progress={defeated:{},attempts:{},seen:{},wrong:{},recent:[],gold:0,totalGold:0};
const bossLevels:BossLevel[]=[1,2,3];
const bossCosts:Record<BossLevel,number>={1:30,2:50,3:70};
const bossNames:Record<BossLevel,string>={1:"핵심 개념 보스",2:"개념 연결 보스",3:"자료 분석 보스"};
const bossDescriptions:Record<BossLevel,string>={
  1:"핵심 용어와 시대 구분을 묻습니다.",
  2:"개념과 설명의 정확한 연결을 시험합니다.",
  3:"자료와 상황에서 역사 개념을 찾아야 합니다.",
};
const questionTypes:Record<BossLevel,string>={1:"핵심 개념 확인",2:"개념 연결",3:"자료 분석"};
const bossKey=(lesson:number,level:BossLevel)=>`${lesson}-${level}`;

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
  return pool
    .map(question=>({
      question,
      priority:(progress.seen[question.id]?0:1000)+(progress.wrong[question.id]??0)*100-(recent.has(question.id)?500:0)+Math.random()*50,
    }))
    .sort((a,b)=>b.priority-a.priority)
    .slice(0,count)
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
    }
    catch{return empty}
  }
  const legacy=localStorage.getItem("history-master-progress-v2");
  if(!legacy)return empty;
  try{
    const old=JSON.parse(legacy);
    const defeated:Record<string,boolean>={};
    bossLevels.forEach(level=>{
      [1,2].forEach(lesson=>{
        if(old.passed?.[bossKey(lesson,level)])defeated[bossKey(lesson,level)]=true;
      });
    });
    return {...empty,defeated,attempts:old.attempts??{},seen:old.seen??{},wrong:old.wrong??{},recent:old.recent??[]};
  }catch{return empty}
}

export default function GameQuizApp({user,signInHref,signOutHref}:{user:User|null;signInHref:string;signOutHref:string}){
  const [screen,setScreen]=useState<Screen>("home");
  const [progress,setProgress]=useState<Progress>(empty);
  const [ready,setReady]=useState(false);
  const [lesson,setLesson]=useState<Lesson>(lessons[0]);
  const [level,setLevel]=useState<BossLevel>(1);
  const [mode,setMode]=useState<Mode>("practice");
  const [quiz,setQuiz]=useState<Question[]>([]);
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Answer[]>([]);
  const [choice,setChoice]=useState<string|null>(null);
  const [ranking,setRanking]=useState<RankingData>({players:[],me:null});
  const [rankingLoading,setRankingLoading]=useState(false);
  const [serverReady,setServerReady]=useState(false);

  useEffect(()=>{setProgress(migrateProgress());setReady(true)},[]);
  useEffect(()=>{if(ready)localStorage.setItem("history-master-progress-v3",JSON.stringify(progress))},[progress,ready]);
  useEffect(()=>{
    if(!ready){return}
    if(!user){setServerReady(true);return}
    let active=true;
    fetch("/api/leaderboard",{cache:"no-store"})
      .then(response=>response.ok?response.json():Promise.reject())
      .then((data:RankingData)=>{
        if(!active)return;
        setRanking(data);
        if(data.me)setProgress(old=>({...old,gold:data.me!.currentGold,totalGold:data.me!.totalGold,defeated:data.me!.defeated}));
      })
      .finally(()=>{if(active)setServerReady(true)});
    return()=>{active=false};
  },[ready,user?.email]);
  useEffect(()=>{
    if(!ready||!serverReady||!user)return;
    const timer=setTimeout(()=>{
      fetch("/api/leaderboard",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({currentGold:progress.gold,totalGold:progress.totalGold,defeated:progress.defeated}),
      }).catch(()=>{});
    },250);
    return()=>clearTimeout(timer);
  },[progress.gold,progress.totalGold,progress.defeated,ready,serverReady,user?.email]);

  const current=quiz[index];
  const score=answers.filter(answer=>answer.correct).length;
  const quizLength=mode==="practice"?5:10;
  const totalDefeated=[1,2].reduce((sum,id)=>sum+defeatedCount(progress,id),0);
  const mastered=[1,2].filter(id=>defeatedCount(progress,id)===3).length;
  const rank=useMemo(()=>{
    if(mastered)return `${mastered}개 강의 달인`;
    if(totalDefeated>=3)return "한국사 보스 사냥꾼";
    if(totalDefeated)return "한국사 도전자";
    return "수련을 시작한 모험가";
  },[mastered,totalDefeated]);

  const goLesson=(target:Lesson)=>{
    if(target.status==="coming")return;
    setLesson(target);setScreen("lesson");scrollTo({top:0,behavior:"smooth"});
  };
  const openLeaderboard=()=>{
    setScreen("leaderboard");setRankingLoading(true);scrollTo({top:0,behavior:"smooth"});
    fetch("/api/leaderboard",{cache:"no-store"})
      .then(response=>response.ok?response.json():Promise.reject())
      .then((data:RankingData)=>setRanking(data))
      .finally(()=>setRankingLoading(false));
  };

  const begin=(targetMode:Mode,targetLevel:BossLevel)=>{
    const count=targetMode==="practice"?5:10;
    const pool=questionBank.filter(q=>q.lessonId===lesson.id&&q.level===targetLevel);
    setMode(targetMode);setLevel(targetLevel);setQuiz(choose(pool,progress,count));
    setIndex(0);setAnswers([]);setChoice(null);setScreen("quiz");scrollTo({top:0});
  };

  const startPractice=()=>begin("practice",nextBoss(progress,lesson.id));

  const startBoss=(targetLevel:BossLevel)=>{
    const alreadyDefeated=progress.defeated[bossKey(lesson.id,targetLevel)];
    const cost=alreadyDefeated?0:bossCosts[targetLevel];
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
    if(index<quizLength-1){setIndex(i=>i+1);setChoice(null);return}
    const won=mode==="boss"&&score>=9;
    const attempt=bossKey(lesson.id,level);
    setProgress(old=>{
      const seen={...old.seen},wrong={...old.wrong};
      answers.forEach(a=>{
        seen[a.question.id]=(seen[a.question.id]??0)+1;
        if(!a.correct)wrong[a.question.id]=(wrong[a.question.id]??0)+1;
      });
      return {
        ...old,
        gold:old.gold+(mode==="practice"?score*10:0),
        totalGold:old.totalGold+(mode==="practice"?score*10:0),
        defeated:{...old.defeated,...(won?{[attempt]:true}:{})},
        attempts:{...old.attempts,[`${mode}-${attempt}`]:(old.attempts[`${mode}-${attempt}`]??0)+1},
        seen,wrong,
        recent:[...old.recent,...answers.map(a=>a.question.id)].slice(-50),
      };
    });
    setScreen("result");scrollTo({top:0,behavior:"smooth"});
  };

  if(!ready)return <main className="loading"><span>史</span><p>모험 기록을 펼치는 중…</p></main>;

  if(screen==="quiz"&&current){
    const isPractice=mode==="practice";
    return <main className={`quiz-shell ${isPractice?"practice-quiz":"boss-quiz"}`}>
      <header className="quiz-head">
        <button onClick={()=>setScreen("lesson")}>← 도전 중단</button>
        <div><span>{lesson.id}강 · {isPractice?"연습":"보스전"}</span><strong>{bossNames[level]}</strong></div>
        <b className="gold-badge">● {progress.gold} G</b>
      </header>
      <div className="progress"><i style={{width:`${((index+1)/quizLength)*100}%`}} /></div>
      <section className="question">
        <div className="q-meta">
          <span>문제 {index+1} / {quizLength}</span>
          <span>{isPractice?"정답마다 +10 G":"승리 기준 9 / 10"}</span>
        </div>
        <p className="pdf-page">주 출처 · 최태성 별별한국사 강의 필기 {current.page}</p>
        <p className="concept">{isPractice?"연습":"보스"} 문제 · {questionTypes[level]}</p>
        <h1>{current.prompt}</h1>
        <div className="choices">{current.choices.map((item,i)=>{
          const className=choice?(item===current.answer?"correct":item===choice?"wrong":"dim"):"";
          return <button key={item} className={className} onClick={()=>answer(item)} disabled={Boolean(choice)}><span>{i+1}</span>{item}</button>;
        })}</div>
        {choice&&<div className={`explain ${choice===current.answer?"right":"miss"}`}>
          <strong>{choice===current.answer?(isPractice?"정답! 10골드 획득 예정":"보스에게 유효타를 입혔습니다"):"아쉽지만 해설로 다시 기억해요"}</strong>
          <p>{current.explanation}</p>
          <small className="question-source">근거: {current.source}<span className="source-links"><a href={current.noteUrl} target="_blank" rel="noreferrer">검증 자료 · 해당 필기 보기 ↗</a><a href={current.sourceUrl} target="_blank" rel="noreferrer">우리역사넷 사실 확인 ↗</a></span></small>
          <button className="primary" onClick={next}>{index===quizLength-1?"결과 확인":"다음 문제"} →</button>
        </div>}
      </section>
    </main>;
  }

  if(screen==="result"){
    const isPractice=mode==="practice";
    const won=!isPractice&&score>=9;
    const wrong=answers.filter(a=>!a.correct);
    return <main className="result-shell"><section className={`result ${isPractice||won?"passed":""}`}>
      <span className="result-seal">{isPractice?"金":won?"勝":"再"}</span>
      <p className="eyebrow">{lesson.id}강 · {isPractice?"연습 완료":`${level}단계 보스전`}</p>
      <h1>{isPractice?`${score*10}골드 획득!`:won?"보스를 쓰러뜨렸습니다!":"보스가 아직 버티고 있습니다"}</h1>
      <div className="result-score"><strong>{score}</strong><span>/ {quizLength}</span></div>
      <p>{isPractice
        ?`정답 ${score}개로 ${score*10}골드를 얻었습니다. 모은 골드로 보스에게 도전하세요.`
        :won
          ?level===3?`${lesson.shortTitle}의 세 보스를 모두 쓰러뜨려 달인 칭호를 얻었습니다.`:`${level+1}단계 보스가 모습을 드러냈습니다.`
          :"9문제 이상 맞혀야 보스를 쓰러뜨릴 수 있습니다. 연습으로 실력과 골드를 더 모아 보세요."}</p>
      {wrong.length>0&&<div className="review"><h2>이번 오답 개념</h2>{wrong.map(a=><div key={a.question.id}><strong>{a.question.concept}</strong><small>강의 필기 {a.question.page}</small><p>{a.question.explanation}</p></div>)}</div>}
      <div className="actions">
        {isPractice
          ?<button className="primary" onClick={startPractice}>5문제 더 연습하기 →</button>
          :won
            ?<button className="primary" onClick={()=>setScreen("lesson")}>다음 보스 준비하기 →</button>
            :<button className="primary" onClick={startPractice}>연습하고 골드 모으기 →</button>}
        <button className="secondary" onClick={()=>setScreen("lesson")}>보스 선택으로</button>
      </div>
    </section></main>;
  }

  if(screen==="leaderboard"){
    return <main><Nav home={()=>setScreen("home")} gold={progress.gold} user={user} onLeaderboard={openLeaderboard}/>
      <section className="ranking-hero"><p className="eyebrow">명예의 전당</p><h1>한국사 원정대 TOP 10</h1><p>보스 처치 수를 먼저 비교하고, 같으면 총 획득 골드와 현재 보유 골드 순으로 순위를 정합니다.</p></section>
      <section className="ranking-section">
        {user?<div className="my-ranking">
          <div><small>나의 순위</small><strong>{ranking.me?`${ranking.me.rank}위`:"첫 기록을 기다리는 중"}</strong><span>{user.displayName}</span></div>
          <div><small>총 획득 골드</small><strong>{ranking.me?.totalGold??progress.totalGold} G</strong></div>
          <div><small>쓰러뜨린 보스</small><strong>{ranking.me?.bossesDefeated??totalDefeated}명</strong></div>
          <a href={signOutHref}>로그아웃</a>
        </div>:<div className="signin-panel"><div><strong>내 기록을 순위표에 올리려면 로그인하세요</strong><p>로그인하면 골드와 보스 진행 상황이 계정에 저장되어 다른 기기에서도 이어집니다.</p></div><a href={signInHref}>ChatGPT로 로그인 →</a></div>}
        <div className="ranking-table">
          <div className="ranking-head"><span>순위</span><span>도전자</span><span>보스</span><span>총 골드</span><span>진행 상황</span></div>
          {rankingLoading?<p className="ranking-empty">순위표를 불러오는 중…</p>:ranking.players.length===0?<p className="ranking-empty">아직 등록된 도전자가 없습니다.</p>:ranking.players.map(player=><div className={`ranking-row ${ranking.me?.rank===player.rank&&ranking.me.displayName===player.displayName?"mine":""}`} key={`${player.rank}-${player.displayName}`}>
            <b>{player.rank<=3?["🥇","🥈","🥉"][player.rank-1]:player.rank}</b>
            <strong>{player.displayName}</strong>
            <span>{player.bossesDefeated}명</span>
            <span>{player.totalGold} G</span>
            <span className="mini-progress"><i style={{width:`${player.bossesDefeated/6*100}%`}}/><small>1강 {player.lesson1Bosses}/3 · 2강 {player.lesson2Bosses}/3</small></span>
          </div>)}
        </div>
        <button className="secondary ranking-back" onClick={()=>setScreen("home")}>← 원정 지도로 돌아가기</button>
      </section>
    </main>;
  }

  if(screen==="lesson"){
    const done=defeatedCount(progress,lesson.id);
    const trainingLevel=nextBoss(progress,lesson.id);
    return <main><Nav home={()=>setScreen("home")} gold={progress.gold} user={user} onLeaderboard={openLeaderboard}/>
      <section className="lesson-hero">
        <div><p className="eyebrow">{lesson.id}강 보스 원정</p><h1>{lesson.title}</h1><p>5문제 연습으로 골드를 모으고 세 단계의 보스에게 도전하세요. 보스전에서 10문제 중 9문제를 맞히면 승리합니다.</p></div>
        <div className="lesson-stat"><span>보스 처치</span><strong>{done}<small>/3</small></strong><div><i style={{width:`${done/3*100}%`}} /></div></div>
      </section>
      <section className="stage-section">
        <div className="section-head"><div><p className="eyebrow">연습과 보스전</p><h2>골드를 모아 보스를 쓰러뜨리세요</h2></div><a href={lesson.videoUrl} target="_blank" rel="noreferrer">강의 다시 보기 ↗</a></div>
        <div className="practice-panel">
          <div className="practice-icon">金</div>
          <div><p>연습하기 · {trainingLevel}단계 난이도</p><h3>5문제, 4지 선다형</h3><span>정답 1개당 10골드 · 오답과 새 문제 우선 출제</span></div>
          <div className="practice-reward"><small>보유 골드</small><strong>{progress.gold} G</strong><button className="primary" onClick={startPractice}>연습 시작 →</button></div>
        </div>
        <div className="source-note"><strong>문항 출처 안내</strong><p>{lesson.id===1?"강의 필기 PDF 2쪽의 시대 흐름":"강의 필기 PDF 3~5쪽의 선사 시대·여러 나라 내용"}을 주 자료로 사용하고 우리역사넷으로 사실을 검증했습니다. 풀이 뒤 해당 필기를 바로 열 수 있습니다.</p></div>
        <div className="bosses">{bossLevels.map(item=>{
          const defeated=progress.defeated[bossKey(lesson.id,item)];
          const unlocked=item===1||progress.defeated[bossKey(lesson.id,(item-1) as BossLevel)];
          const cost=defeated?0:bossCosts[item];
          const affordable=progress.gold>=cost;
          return <article key={item} className={`${defeated?"complete":""} ${!unlocked?"locked":""}`}>
            <div className="boss-mark">{defeated?"✓":item}</div>
            <p>{item}단계 보스</p><h3>{bossNames[item]}</h3><span>{bossDescriptions[item]}</span>
            <div className="boss-stats"><span>10문제</span><span>승리 9/10</span><b>{defeated?"복습 무료":`${cost} G`}</b></div>
            <button onClick={()=>startBoss(item)} disabled={!unlocked||!affordable}>
              {defeated?"보스 다시 만나기":!unlocked?"이전 보스 처치 필요":!affordable?`${cost-progress.gold} G 더 필요`:"보스에게 도전"}
            </button>
          </article>;
        })}</div>
        <div className="rule"><strong>원정 규칙</strong><p>연습에서는 정답마다 10골드를 얻습니다. 보스 도전 시 골드가 사용되며, 이미 처치한 보스는 무료로 다시 풀 수 있습니다. 세 보스를 모두 처치하면 강의 달인 칭호를 획득합니다.</p></div>
      </section>
    </main>;
  }

  return <main><Nav gold={progress.gold} user={user} onLeaderboard={openLeaderboard}/>
    <section className="home-hero"><div>
      <p className="eyebrow">연습으로 성장하고 보스를 쓰러뜨리는 한국사 문제은행</p>
      <h1>골드를 모으고,<br/><em>역사의 보스를 넘어라</em></h1>
      <p className="hero-desc">5문제 연습으로 골드를 얻고, 각 강의의 세 보스에게 도전하세요. 모든 보스를 쓰러뜨리면 강의별 달인 칭호가 열립니다.</p>
      <button className="primary" onClick={()=>goLesson(lessons[0])}>첫 원정 시작하기 →</button>
    </div>
    <div className="master"><div><span>나의 현재 칭호</span><span className="gold-text">● {progress.gold} G · 누적 {progress.totalGold} G</span></div><strong>{rank}</strong><section>{["모험가","도전자","사냥꾼","달인"].map((name,i)=><div className={totalDefeated>i||mastered>0?"active":""} key={name}><span>{i+1}</span><small>{name}</small></div>)}</section><p>현재 공개된 2개 강의에서 보스 {totalDefeated}명을 쓰러뜨렸습니다.</p><button className="rank-button" onClick={openLeaderboard}>TOP 10 순위표 보기 →</button></div>
    </section>
    <section className="curriculum"><div className="section-head"><div><p className="eyebrow">30강 보스 지도</p><h2>강의마다 세 보스가 기다립니다</h2></div><div className="legend"><span><i className="ready-dot"/>원정 가능</span><span><i/>준비 중</span></div></div>
      <div className="lessons">{lessons.map(item=>{const done=defeatedCount(progress,item.id);return <button key={item.id} className={item.status} onClick={()=>goLesson(item)} disabled={item.status==="coming"}><span className="lesson-no">{String(item.id).padStart(2,"0")}</span><div><strong>{item.shortTitle}</strong><span>{item.status==="ready"?`보스 ${done}/3 처치`:"문제 준비 중"}</span></div><b>{done===3?"♛":item.status==="ready"?"→":"·"}</b></button>})}</div>
    </section>
    <footer><span>史</span><p>연습으로 골드를 모으고, 보스에게 도전하며<br/>나만의 한국사 달인 칭호를 완성해 보세요.</p></footer>
  </main>;
}

function Nav({home,gold,user,onLeaderboard}:{home?:()=>void;gold:number;user:User|null;onLeaderboard:()=>void}){
  return <nav><button className="brand" onClick={home}><span>史</span>한국사 수련장</button><span>기본별개념3 · 30강 보스 원정</span><button className="nav-rank" onClick={onLeaderboard}>TOP 10</button><b className="nav-gold">● {gold} G</b>{user&&<small className="nav-user">{user.displayName}</small>}{home&&<button className="nav-link" onClick={home}>전체 강의</button>}</nav>;
}

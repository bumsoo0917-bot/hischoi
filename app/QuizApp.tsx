"use client";
import { useEffect, useMemo, useState } from "react";
import { Lesson, Level, Question, lessons, levelDescriptions, levelNames, questionBank } from "./questions";

type Screen="home"|"lesson"|"quiz"|"result";
type Progress={passed:Record<string,boolean>;attempts:Record<string,number>;seen:Record<string,number>;wrong:Record<string,number>;recent:string[]};
type Answer={question:Question;selected:string;correct:boolean};
const empty:Progress={passed:{},attempts:{},seen:{},wrong:{},recent:[]};
const key=(lesson:number,level:Level)=>`${lesson}-${level}`;

function shuffle<T>(items:T[]){
  const copy=[...items];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
  return copy;
}
function choose(pool:Question[],progress:Progress){
  const recent=new Set(progress.recent.slice(-20));
  return pool.map(question=>({question,score:(progress.seen[question.id]?0:1000)+(progress.wrong[question.id]??0)*100-(recent.has(question.id)?500:0)+Math.random()*50}))
    .sort((a,b)=>b.score-a.score).slice(0,10).map(({question})=>({...question,choices:shuffle(question.choices)}));
}
function passedCount(progress:Progress,lesson:number){
  return ([1,2,3,4] as Level[]).filter(level=>progress.passed[key(lesson,level)]).length;
}

export default function QuizApp(){
  const [screen,setScreen]=useState<Screen>("home");
  const [progress,setProgress]=useState<Progress>(empty);
  const [ready,setReady]=useState(false);
  const [lesson,setLesson]=useState<Lesson>(lessons[0]);
  const [level,setLevel]=useState<Level>(1);
  const [quiz,setQuiz]=useState<Question[]>([]);
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Answer[]>([]);
  const [choice,setChoice]=useState<string|null>(null);

  useEffect(()=>{const saved=localStorage.getItem("history-master-progress-v2");if(saved){try{setProgress({...empty,...JSON.parse(saved)})}catch{setProgress(empty)}}setReady(true)},[]);
  useEffect(()=>{if(ready)localStorage.setItem("history-master-progress-v2",JSON.stringify(progress))},[progress,ready]);

  const current=quiz[index];
  const score=answers.filter(answer=>answer.correct).length;
  const questionTypes:Record<Level,string>={1:"핵심 개념 확인",2:"개념 연결",3:"자료 분석",4:"심화 판단"};
  const totalPassed=[1,2].reduce((sum,id)=>sum+passedCount(progress,id),0);
  const mastered=[1,2].filter(id=>passedCount(progress,id)===4).length;
  const rank=useMemo(()=>mastered?`${mastered}개 강의 달인`:totalPassed>=3?"한국사 고수":totalPassed?"한국사 탐구자":"첫 수련을 기다리는 새싹",[mastered,totalPassed]);

  const goLesson=(target:Lesson)=>{if(target.status==="coming")return;setLesson(target);setScreen("lesson");scrollTo({top:0,behavior:"smooth"})};
  const start=(nextLevel:Level)=>{
    const pool=questionBank.filter(q=>q.lessonId===lesson.id&&q.level===nextLevel);
    setLevel(nextLevel);setQuiz(choose(pool,progress));setIndex(0);setAnswers([]);setChoice(null);setScreen("quiz");scrollTo({top:0});
  };
  const answer=(selected:string)=>{if(choice||!current)return;setChoice(selected);setAnswers(old=>[...old,{question:current,selected,correct:selected===current.answer}])};
  const next=()=>{
    if(index<9){setIndex(i=>i+1);setChoice(null);return}
    const didPass=score>=9, attempt=key(lesson.id,level);
    setProgress(old=>{
      const seen={...old.seen},wrong={...old.wrong};
      answers.forEach(a=>{seen[a.question.id]=(seen[a.question.id]??0)+1;if(!a.correct)wrong[a.question.id]=(wrong[a.question.id]??0)+1});
      return {passed:{...old.passed,...(didPass?{[attempt]:true}:{})},attempts:{...old.attempts,[attempt]:(old.attempts[attempt]??0)+1},seen,wrong,recent:[...old.recent,...answers.map(a=>a.question.id)].slice(-50)};
    });
    setScreen("result");scrollTo({top:0,behavior:"smooth"});
  };
  const open=(target:Level)=>target===1||progress.passed[key(lesson.id,(target-1) as Level)];

  if(!ready)return <main className="loading"><span>史</span><p>수련 기록을 펼치는 중…</p></main>;

  if(screen==="quiz"&&current){
    return <main className="quiz-shell">
      <header className="quiz-head"><button onClick={()=>setScreen("lesson")}>← 수련 중단</button><div><span>{lesson.id}강</span><strong>{levelNames[level]} 단계</strong></div><b>현재 {score}점</b></header>
      <div className="progress"><i style={{width:`${(index+1)*10}%`}} /></div>
      <section className="question">
        <div className="q-meta"><span>문제 {index+1}</span><span>통과 기준 9 / 10</span></div>
        <p className="pdf-page">주 출처 · 최태성 별별한국사 강의 필기 {current.page}</p>
        <p className="concept">문제 유형 · {questionTypes[level]}</p><h1>{current.prompt}</h1>
        <div className="choices">{current.choices.map((item,i)=>{
          const className=choice?(item===current.answer?"correct":item===choice?"wrong":"dim"):"";
          return <button key={item} className={className} onClick={()=>answer(item)} disabled={Boolean(choice)}><span>{i+1}</span>{item}</button>
        })}</div>
        {choice&&<div className={`explain ${choice===current.answer?"right":"miss"}`}><strong>{choice===current.answer?"정답입니다":"아쉽지만 다시 기억해요"}</strong><p>{current.explanation}</p><small className="question-source">근거: {current.source}<span className="source-links"><a href={current.noteUrl} target="_blank" rel="noreferrer">검증 자료 · 해당 필기 보기 ↗</a><a href={current.sourceUrl} target="_blank" rel="noreferrer">우리역사넷 사실 확인 ↗</a></span></small><button className="primary" onClick={next}>{index===9?"결과 확인":"다음 문제"} →</button></div>}
      </section>
    </main>;
  }

  if(screen==="result"){
    const didPass=score>=9,wrong=answers.filter(a=>!a.correct),nextLevel=level<4?(level+1) as Level:null;
    return <main className="result-shell"><section className={`result ${didPass?"passed":""}`}>
      <span className="result-seal">{didPass?"通":"再"}</span><p className="eyebrow">{lesson.id}강 · {levelNames[level]} 단계</p>
      <h1>{didPass?"수련 통과!":"한 번 더 도전해요"}</h1><div className="result-score"><strong>{score}</strong><span>/ 10</span></div>
      <p>{didPass?(level===4?`${lesson.shortTitle} 달인 칭호를 획득했습니다.`:`${levelNames[nextLevel!]} 수련이 열렸습니다.`):"9문제 이상 맞히면 통과합니다. 오답을 확인하고 새로운 문제로 다시 도전해 보세요."}</p>
      {wrong.length>0&&<div className="review"><h2>이번 오답 개념</h2>{wrong.map(a=><div key={a.question.id}><strong>{a.question.concept}</strong><small>강의 필기 {a.question.page}</small><p>{a.question.explanation}</p></div>)}</div>}
      <div className="actions">{didPass&&nextLevel?<button className="primary" onClick={()=>start(nextLevel)}>{levelNames[nextLevel]} 단계 시작 →</button>:<button className="primary" onClick={()=>start(level)}>새로운 문제로 재도전 →</button>}<button className="secondary" onClick={()=>setScreen("lesson")}>단계 선택으로</button></div>
    </section></main>;
  }

  if(screen==="lesson"){
    const done=passedCount(progress,lesson.id);
    return <main><Nav home={()=>setScreen("home")} />
      <section className="lesson-hero"><div><p className="eyebrow">{lesson.id}강 수련</p><h1>{lesson.title}</h1><p>난이도별 25문제, 총 100문제 중 매번 새로운 10문제를 만납니다. 9문제 이상 맞히고 네 단계를 넘어 달인이 되어 보세요.</p></div><div className="lesson-stat"><span>진행도</span><strong>{done}<small>/4</small></strong><div><i style={{width:`${done*25}%`}} /></div></div></section>
      <section className="stage-section"><div className="section-head"><div><p className="eyebrow">네 단계의 수련</p><h2>현재 단계에 도전하세요</h2></div><a href={lesson.videoUrl} target="_blank" rel="noreferrer">강의 다시 보기 ↗</a></div>
      <div className="source-note"><strong>문항 출처 안내</strong><p>{lesson.id===1?"공유받은 강의 필기 PDF 2쪽의 시대 흐름을 주 자료로 사용하고, 국사편찬위원회 우리역사넷 자료로 사실을 검증했습니다.":"공유받은 강의 필기 PDF 3~5쪽의 선사 시대·여러 나라 내용을 주 자료로 사용하고, 국사편찬위원회 우리역사넷 자료로 사실을 검증했습니다."} 각 문제를 푼 뒤 상세 근거와 검증 링크를 확인할 수 있습니다.</p></div>
      <div className="stages">{([1,2,3,4] as Level[]).map(item=>{const unlocked=open(item),done=progress.passed[key(lesson.id,item)];return <article key={item} className={`${done?"complete":""} ${!unlocked?"locked":""}`}><div className="stage-no">{done?"✓":item}</div><p>{item}단계</p><h3>{levelNames[item]}</h3><span>{levelDescriptions[item]}</span><div className="stage-info"><span>문제은행 25</span><span>무작위 10</span></div><button onClick={()=>unlocked&&start(item)} disabled={!unlocked}>{done?"다시 수련하기":unlocked?"도전 시작":"이전 단계 통과 필요"}</button></article>})}</div>
      <div className="rule"><strong>출제 규칙</strong><p>미출제 문제와 이전 오답을 먼저 보여 주고, 최근 문제는 잠시 쉬어 갑니다. 선택지 순서도 매번 달라집니다.</p></div></section>
    </main>;
  }

  return <main><Nav />
    <section className="home-hero"><div><p className="eyebrow">기본별개념3 목차를 따라가는 단계별 문제은행</p><h1>외우는 공부를 넘어,<br/><em>달인이 되는 수련</em></h1><p className="hero-desc">매번 달라지는 10문제를 풀고 9문제 이상 맞히세요. 네 단계를 통과하면 강의별 달인 칭호가 열립니다.</p><button className="primary" onClick={()=>goLesson(lessons[0])}>첫 수련 시작하기 →</button></div>
      <div className="master"><div><span>나의 현재 칭호</span><span>{totalPassed}/120 단계</span></div><strong>{rank}</strong><section>{["새싹","탐구자","고수","달인"].map((name,i)=><div className={totalPassed>i?"active":""} key={name}><span>{i+1}</span><small>{name}</small></div>)}</section><p>현재 공개된 2개 강의에서 {totalPassed}개 단계를 통과했습니다.</p></div>
    </section>
    <section className="curriculum"><div className="section-head"><div><p className="eyebrow">30강 수련 지도</p><h2>시대의 흐름을 따라가세요</h2></div><div className="legend"><span><i className="ready-dot"/>수련 가능</span><span><i/>준비 중</span></div></div>
      <div className="lessons">{lessons.map(item=>{const done=passedCount(progress,item.id);return <button key={item.id} className={item.status} onClick={()=>goLesson(item)} disabled={item.status==="coming"}><span className="lesson-no">{String(item.id).padStart(2,"0")}</span><div><strong>{item.shortTitle}</strong><span>{item.status==="ready"?`100문제 · ${done}/4 단계 통과`:"문제 준비 중"}</span></div><b>{item.status==="ready"?"→":"·"}</b></button>})}</div>
    </section>
    <footer><span>史</span><p>강의를 듣고, 문제를 풀고, 오답을 다시 만나며<br/>나만의 한국사 실력을 쌓아 갑니다.</p></footer>
  </main>;
}

function Nav({home}:{home?:()=>void}){
  return <nav><button className="brand" onClick={home}><span>史</span>한국사 수련장</button><span>기본별개념3 · 30강 완주 프로젝트</span>{home&&<button className="nav-link" onClick={home}>전체 강의</button>}</nav>;
}

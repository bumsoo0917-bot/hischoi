"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppNavigation from "../AppNavigation";
import { buildVisualQuiz, type VisualEra, type VisualQuestion, visualEncountersForEra, visualEras } from "./quiz-data";
import { clientProgressSummary, emptyClientProgress, migrateClientProgress, PROGRESS_STORAGE_KEY, progressWrite, type ClientProgress } from "../client-progress";
import { rewards } from "../../lib/gamification";

type Screen="select"|"quiz"|"result";
type VisualAnswer={question:VisualQuestion;selected:string;correct:boolean};

export default function EraVisualQuiz(){
  const [screen,setScreen]=useState<Screen>("select");
  const [era,setEra]=useState<VisualEra>(visualEras[0]);
  const [quiz,setQuiz]=useState<VisualQuestion[]>([]);
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<VisualAnswer[]>([]);
  const [choice,setChoice]=useState<string|null>(null);
  const [progress,setProgress]=useState<ClientProgress>(emptyClientProgress);
  const [ready,setReady]=useState(false);
  const [serverReady,setServerReady]=useState(false);
  const [resultReward,setResultReward]=useState({gold:0,xp:0,newCollection:0,newTitles:[] as string[]});

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{setProgress(migrateClientProgress(localStorage.getItem(PROGRESS_STORAGE_KEY)));setReady(true)},[]);
  useEffect(()=>{if(ready)localStorage.setItem(PROGRESS_STORAGE_KEY,JSON.stringify(progress))},[progress,ready]);
  useEffect(()=>{
    if(!ready)return;
    let active=true;
    fetch("/api/leaderboard",{cache:"no-store"}).then(response=>response.ok?response.json():Promise.reject())
      .then(data=>{if(active&&data.me)setProgress(old=>({...old,gold:data.me.currentGold,totalGold:data.me.totalGold,xp:data.me.xp,rewardVersion:data.me.rewardVersion,visualCorrect:data.me.visualCorrect,selectedTitle:data.me.selectedTitle,defeated:data.me.defeated,collection:data.me.collection,attempts:data.me.attempts,perfectBosses:data.me.perfectBosses,visualPerfectEras:data.me.visualPerfectEras}))})
      .finally(()=>{if(active)setServerReady(true)});
    return()=>{active=false};
  },[ready]);
  useEffect(()=>{
    if(!ready||!serverReady)return;
    const timer=setTimeout(()=>fetch("/api/leaderboard",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(progressWrite(progress))}).catch(()=>{}),250);
    return()=>clearTimeout(timer);
  },[progress,ready,serverReady]);

  const current=quiz[index];
  const score=answers.filter(item=>item.correct).length;
  const goTop=()=>window.scrollTo({top:0,behavior:"smooth"});
  const openSelect=()=>{setScreen("select");goTop()};
  const start=(targetEra:VisualEra)=>{
    const nextQuiz=buildVisualQuiz(targetEra.id,10);
    if(nextQuiz.length<4)return;
    setEra(targetEra);setQuiz(nextQuiz);setIndex(0);setAnswers([]);setChoice(null);setResultReward({gold:0,xp:0,newCollection:0,newTitles:[]});setScreen("quiz");goTop();
  };
  const answer=(selected:string)=>{
    if(choice||!current)return;
    setChoice(selected);
    setAnswers(old=>[...old,{question:current,selected,correct:selected===current.answer}]);
  };
  const next=()=>{
    if(index<quiz.length-1){setIndex(value=>value+1);setChoice(null);return}
    const correctAnswers=answers.filter(item=>item.correct);
    const newItems=correctAnswers.filter(item=>!progress.collection[item.question.encounter.id]);
    const goldEarned=score*rewards.visualGoldPerCorrect;
    const xpEarned=score*rewards.visualXpPerCorrect+(score>=8?rewards.visualPassXp:0)+(score===10?rewards.visualPerfectXp:0)+newItems.length*rewards.visualDiscoveryXp;
    const nextProgress:ClientProgress={...progress,gold:progress.gold+goldEarned,totalGold:progress.totalGold+goldEarned,xp:progress.xp+xpEarned,visualCorrect:progress.visualCorrect+score,collection:{...progress.collection,...Object.fromEntries(correctAnswers.map(item=>[item.question.encounter.id,true]))},attempts:{...progress.attempts,[`visual-${era.id}`]:(progress.attempts[`visual-${era.id}`]??0)+1},visualPerfectEras:{...progress.visualPerfectEras,...(score===10?{[era.id]:true}:{})}};
    const beforeTitles=clientProgressSummary(progress).titles;
    const newTitles=clientProgressSummary(nextProgress).titles.filter(title=>!beforeTitles.includes(title));
    setProgress(nextProgress);
    setResultReward({gold:goldEarned,xp:xpEarned,newCollection:newItems.length,newTitles});
    setScreen("result");goTop();
  };

  const nav=<AppNavigation gold={progress.gold} items={[
    {label:"30강 원정",shortLabel:"원정",href:"/"},
    {label:"그림 퀴즈",shortLabel:"그림 퀴즈",active:true,onClick:openSelect},
    {label:"도감",shortLabel:"도감",href:"/?view=collection"},
    {label:"TOP 10",shortLabel:"순위",href:"/?view=leaderboard"},
  ]}/>;

  if(!ready)return <main className="loading"><span>史</span><p>그림 원정 기록을 불러오는 중...</p></main>;

  if(screen==="quiz"&&current){
    const correct=choice===current.answer;
    return <main className="quiz-shell visual-quiz">
      <header className="quiz-head">
        <button className="quiet-button" onClick={openSelect}>← 중단</button>
        <div><span>{era.title} · 그림 퀴즈</span><strong>인물·유물·유적 맞히기</strong></div>
        <b>{answers.filter(item=>item.correct).length*rewards.visualGoldPerCorrect} G · {answers.filter(item=>item.correct).length*rewards.visualXpPerCorrect} XP</b>
      </header>
      <div className="progress"><i style={{width:`${((index+1)/quiz.length)*100}%`}}/></div>
      <section className="question visual-question">
        <div className="visual-art-frame">
          <Image src={current.encounter.image} alt={`${current.encounter.type} 문제 그림`} width={720} height={480} priority/>
          <span>{current.encounter.type}</span>
        </div>
        <div className="q-meta"><span>{era.title}</span><span>문제 {index+1} / {quiz.length}</span></div>
        <p className="visual-clue">{current.clue}</p>
        <h1>그림 속 {current.encounter.type}의 이름은 무엇일까요?</h1>
        <div className="choices">{current.choices.map((item,choiceIndex)=>{
          const className=choice?(item===current.answer?"correct":item===choice?"wrong":"dim"):"";
          return <button key={item} className={className} onClick={()=>answer(item)} disabled={Boolean(choice)}><span>{choiceIndex+1}</span>{item}</button>;
        })}</div>
        {choice&&<div className={`explain ${correct?"right":"miss"}`}>
          <strong>{correct?"정답입니다!":`정답은 ‘${current.answer}’입니다.`}</strong>
          <p>{current.encounter.examTip}</p>
          <details className="source-details"><summary>문제 근거 확인</summary><small className="question-source">근거: 최태성 강의 필기 {current.encounter.page}<span className="source-links"><a href={current.encounter.noteUrl} target="_blank" rel="noreferrer">해당 필기 보기 ↗</a><a href={current.encounter.sourceUrl} target="_blank" rel="noreferrer">검증 자료 ↗</a></span></small></details>
          <div className="answer-actions"><button className="primary" onClick={next}>{index===quiz.length-1?"결과 확인":"다음 문제"} →</button></div>
        </div>}
      </section>
    </main>;
  }

  if(screen==="result"){
    const missed=answers.filter(item=>!item.correct);
    return <main className="result-shell"><section className={`result ${score>=8?"passed":""}`}>
      <div className="result-seal">目</div>
      <p className="eyebrow">{era.title} 그림 퀴즈 완료</p>
      <h1>{score>=8?"시대의 얼굴을 잘 알아보셨습니다!":"그림과 이름을 한 번 더 연결해 보세요"}</h1>
      <div className="result-score"><strong>{score}</strong><span>/ {quiz.length}</span></div>
      <div className="reward-summary"><span><small>획득 골드</small><strong>+{resultReward.gold} G</strong></span><span><small>획득 경험치</small><strong>+{resultReward.xp} XP</strong></span><span><small>새 도감</small><strong>{resultReward.newCollection}개</strong></span></div>
      {resultReward.newTitles.length>0&&<div className="title-unlocked"><small>새 칭호 획득</small><strong>{resultReward.newTitles.join(" · ")}</strong></div>}
      {missed.length>0&&<div className="review"><h2>다시 볼 대상</h2>{missed.map(item=><div key={item.question.id}><strong>{item.question.answer}</strong><small>선택: {item.selected}</small><p>{item.question.encounter.summary}</p></div>)}</div>}
      <div className="actions">
        <button className="primary" onClick={()=>start(era)}>같은 시대 다시 하기</button>
        <button className="secondary" onClick={openSelect}>다른 시대 고르기</button>
        <Link className="secondary" href="/">30강 원정으로</Link>
      </div>
    </section></main>;
  }

  return <main className="app-screen">{nav}
    <section className="simple-hero visual-hero"><p className="eyebrow">시대별 그림 퀴즈</p><h1>그림으로 시대를 기억하세요</h1><p>인물·유물·유적을 보고 여러 시대가 섞인 네 보기 중 정답을 고르세요.</p></section>
    <section className="visual-era-section">
      <div className="visual-era-guide"><strong>진행 방식</strong><span>시대 선택</span><b>→</b><span>무작위 10문제</span><b>→</b><span>같은 시대 + 다른 시대 선지</span><b>→</b><span>바로 정답 확인</span></div>
      <p className="visual-reward-rule"><strong>보상</strong> 정답마다 5 G · 6 XP / 8문제 이상 +20 XP / 10문제 전부 정답 +50 XP / 새 도감 발견 +10 XP</p>
      <div className="visual-era-grid">{visualEras.map(targetEra=>{
        const items=visualEncountersForEra(targetEra.id);
        const typeCounts=items.reduce<Record<string,number>>((result,item)=>({...result,[item.type]:(result[item.type]??0)+1}),{});
        return <article key={targetEra.id}>
          <small>{targetEra.period}</small><h2>{targetEra.title}</h2><p>{targetEra.description}</p>
          <div>{["인물","유물","유적"].map(type=>typeCounts[type]?<span key={type}>{type} {typeCounts[type]}</span>:null)}</div>
          <button onClick={()=>start(targetEra)}>10문제 시작 →</button>
        </article>;
      })}</div>
    </section>
  </main>;
}

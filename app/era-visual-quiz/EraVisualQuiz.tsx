"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { buildVisualQuiz, type VisualEra, type VisualQuestion, visualEncountersForEra, visualEras } from "./quiz-data";

type Screen="select"|"quiz"|"result";
type VisualAnswer={question:VisualQuestion;selected:string;correct:boolean};

export default function EraVisualQuiz(){
  const [screen,setScreen]=useState<Screen>("select");
  const [era,setEra]=useState<VisualEra>(visualEras[0]);
  const [quiz,setQuiz]=useState<VisualQuestion[]>([]);
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<VisualAnswer[]>([]);
  const [choice,setChoice]=useState<string|null>(null);

  const current=quiz[index];
  const score=answers.filter(item=>item.correct).length;
  const goTop=()=>window.scrollTo({top:0,behavior:"smooth"});
  const openSelect=()=>{setScreen("select");goTop()};
  const start=(targetEra:VisualEra)=>{
    const nextQuiz=buildVisualQuiz(targetEra.id,10);
    if(nextQuiz.length<4)return;
    setEra(targetEra);setQuiz(nextQuiz);setIndex(0);setAnswers([]);setChoice(null);setScreen("quiz");goTop();
  };
  const answer=(selected:string)=>{
    if(choice||!current)return;
    setChoice(selected);
    setAnswers(old=>[...old,{question:current,selected,correct:selected===current.answer}]);
  };
  const next=()=>{
    if(index<quiz.length-1){setIndex(value=>value+1);setChoice(null);return}
    setScreen("result");goTop();
  };

  const nav=<nav><Link className="brand" href="/"><span>史</span>한국사 수련장</Link><span>시대별 그림 퀴즈</span><Link className="nav-rank" href="/">30강 원정</Link>{screen!=="select"&&<button className="nav-link" onClick={openSelect}>시대 선택</button>}</nav>;

  if(screen==="quiz"&&current){
    const correct=choice===current.answer;
    return <main className="quiz-shell visual-quiz">
      <header className="quiz-head">
        <button onClick={openSelect}>← 중단</button>
        <div><span>{era.title} · 그림 퀴즈</span><strong>인물·유물·유적 맞히기</strong></div>
        <b>{index+1} / {quiz.length}</b>
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
          <small className="question-source">근거: 최태성 강의 필기 {current.encounter.page}<span className="source-links"><a href={current.encounter.noteUrl} target="_blank" rel="noreferrer">해당 필기 보기 ↗</a><a href={current.encounter.sourceUrl} target="_blank" rel="noreferrer">검증 자료 ↗</a></span></small>
          <button className="primary" onClick={next}>{index===quiz.length-1?"결과 확인":"다음 문제"} →</button>
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
      {missed.length>0&&<div className="review"><h2>다시 볼 대상</h2>{missed.map(item=><div key={item.question.id}><strong>{item.question.answer}</strong><small>선택: {item.selected}</small><p>{item.question.encounter.summary}</p></div>)}</div>}
      <div className="actions">
        <button className="primary" onClick={()=>start(era)}>같은 시대 다시 하기</button>
        <button className="secondary" onClick={openSelect}>다른 시대 고르기</button>
        <Link className="secondary" href="/">30강 원정으로</Link>
      </div>
    </section></main>;
  }

  return <main>{nav}
    <section className="simple-hero"><p className="eyebrow">시대별 그림 퀴즈</p><h1>어느 시대부터 알아볼까요?</h1><p>그림과 짧은 설명을 보고 같은 시대의 네 보기 중 정답을 고르세요.</p></section>
    <section className="visual-era-section">
      <div className="visual-era-guide"><strong>진행 방식</strong><span>시대 선택</span><b>→</b><span>무작위 10문제</span><b>→</b><span>바로 정답 확인</span></div>
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

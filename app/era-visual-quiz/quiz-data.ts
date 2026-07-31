import { type Encounter, encounters } from "../encounters";
import { visualQuizExtras } from "./extra-encounters";

export type VisualEraId="prehistory"|"ancient"|"goryeo"|"joseon"|"opening"|"occupation"|"modern";

export type VisualEra={
  id:VisualEraId;
  title:string;
  period:string;
  description:string;
  lessonIds:number[];
};

export type VisualQuestion={
  id:string;
  encounter:Encounter;
  clue:string;
  choices:string[];
  answer:string;
};

export const visualEras:VisualEra[]=[
  {id:"prehistory",title:"선사·고조선",period:"2강",description:"선사 시대의 생활 도구와 대표 유적",lessonIds:[2]},
  {id:"ancient",title:"고대",period:"3~7강",description:"삼국과 남북국 시대의 인물·유물·유적",lessonIds:[3,4,5,6,7]},
  {id:"goryeo",title:"고려",period:"8~12강",description:"고려의 왕과 대외 항쟁, 문화유산",lessonIds:[8,9,10,11,12]},
  {id:"joseon",title:"조선",period:"13~18강",description:"조선의 정치 인물과 과학·문화유산",lessonIds:[13,14,15,16,17,18]},
  {id:"opening",title:"개항기",period:"19~23강",description:"개항과 근대 개혁, 국권 수호의 현장",lessonIds:[19,20,21,22,23]},
  {id:"occupation",title:"일제강점기",period:"24~27강",description:"독립운동가와 민족 운동의 상징",lessonIds:[24,25,26,27]},
  {id:"modern",title:"현대",period:"28~30강",description:"정부 수립, 민주화와 경제 발전의 장면",lessonIds:[28,29,30]},
];

function shuffle<T>(items:T[]):T[]{
  const copy=[...items];
  for(let index=copy.length-1;index>0;index--){
    const target=Math.floor(Math.random()*(index+1));
    [copy[index],copy[target]]=[copy[target],copy[index]];
  }
  return copy;
}

function uniqueByName(items:Encounter[]):Encounter[]{
  return [...new Map(items.map(item=>[item.name,item])).values()];
}

function clueFor(item:Encounter):string{
  const hidden=item.summary.split(item.name).join("이 대상");
  return hidden.replace(/^(이 대상은|이 대상이)\s*/,"").trim();
}

export function visualEncountersForEra(eraId:VisualEraId):Encounter[]{
  const era=visualEras.find(item=>item.id===eraId);
  if(!era)return [];
  return uniqueByName([...encounters,...visualQuizExtras].filter(item=>
    era.lessonIds.includes(item.lessonId)&&item.type!=="역사 자료"
  ));
}

export function buildVisualQuiz(eraId:VisualEraId,count=10):VisualQuestion[]{
  const candidates=visualEncountersForEra(eraId);
  if(candidates.length<4)return [];
  const era=visualEras.find(item=>item.id===eraId);
  if(!era)return [];
  const eraIndex=visualEras.findIndex(item=>item.id===eraId);
  const adjacentLessons=new Set([
    ...(visualEras[eraIndex-1]?.lessonIds??[]),
    ...(visualEras[eraIndex+1]?.lessonIds??[]),
  ]);
  const allCandidates=uniqueByName([...encounters,...visualQuizExtras].filter(item=>item.type!=="역사 자료"));

  return shuffle(candidates).slice(0,Math.min(count,candidates.length)).map(answer=>{
    const eligible=(item:Encounter)=>item.id!==answer.id&&item.name!==answer.name;
    const sameEra=uniqueByName([
      ...shuffle(candidates.filter(item=>eligible(item)&&item.type===answer.type)),
      ...shuffle(candidates.filter(item=>eligible(item)&&item.type!==answer.type)),
    ]).slice(0,2);
    const outsideEra=allCandidates.filter(item=>eligible(item)&&!era.lessonIds.includes(item.lessonId));
    const crossEra=uniqueByName([
      ...shuffle(outsideEra.filter(item=>adjacentLessons.has(item.lessonId)&&item.type===answer.type)),
      ...shuffle(outsideEra.filter(item=>!adjacentLessons.has(item.lessonId)&&item.type===answer.type)),
      ...shuffle(outsideEra.filter(item=>adjacentLessons.has(item.lessonId)&&item.type!==answer.type)),
      ...shuffle(outsideEra.filter(item=>!adjacentLessons.has(item.lessonId)&&item.type!==answer.type)),
    ]);
    const distractors=uniqueByName([...sameEra,...crossEra]).slice(0,3);
    return {
      id:`visual-${eraId}-${answer.id}`,
      encounter:answer,
      clue:clueFor(answer),
      choices:shuffle([answer.name,...distractors.map(item=>item.name)]),
      answer:answer.name,
    };
  });
}

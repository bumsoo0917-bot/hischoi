export const REWARD_VERSION=1;
export const BASE_TITLE="수련을 시작한 모험가";
export const VISUAL_ERA_IDS=["prehistory","ancient","goryeo","joseon","opening","occupation","modern"] as const;
export type VisualEraKey=(typeof VISUAL_ERA_IDS)[number];

export const rewards={
  practiceGoldPerCorrect:10,
  practiceXpPerCorrect:5,
  bossXpPerCorrect:8,
  bossFirstClearXp:50,
  bossFirstPerfectXp:50,
  lessonMasterXp:200,
  visualGoldPerCorrect:5,
  visualXpPerCorrect:6,
  visualPassXp:20,
  visualPerfectXp:50,
  visualDiscoveryXp:10,
} as const;

export function levelInfo(xp:number){
  let level=1;
  let floor=0;
  let required=100;
  while(xp>=floor+required&&level<99){floor+=required;level+=1;required=100+(level-1)*25}
  const label=level>=30?"한국사 달인":level>=20?"왕조 전략가":level>=10?"유물 감정가":level>=5?"시대 탐험가":"견습 사관";
  return {level,label,current:xp-floor,required,totalFloor:floor,percent:Math.min(100,Math.round((xp-floor)/required*100))};
}

type TitleProgress={
  bossesDefeated:number;
  masteredLessons:number;
  lessonBosses:Record<string,number>;
  collectionCount:number;
  totalCollection:number;
  visualOnlyCollected:number;
  visualOnlyTotal:number;
  visualCorrect:number;
  perfectBosses:Record<string,boolean>;
  visualPerfectEras:Record<string,boolean>;
};

const allMastered=(lessonBosses:Record<string,number>,from:number,to:number)=>{
  for(let lesson=from;lesson<=to;lesson+=1)if((lessonBosses[String(lesson)]??0)<3)return false;
  return true;
};

export function unlockedTitles(progress:TitleProgress){
  const titles=[BASE_TITLE];
  if(progress.bossesDefeated>=1)titles.push("첫 승리를 거둔 자");
  if(Object.keys(progress.perfectBosses).length>=1)titles.push("빈틈없는 사관");
  if(progress.bossesDefeated>=30)titles.push("백전의 원정대");
  if(progress.bossesDefeated>=90)titles.push("역사를 정복한 자");
  if(progress.masteredLessons>=1)titles.push("첫 달인");
  if(allMastered(progress.lessonBosses,8,12))titles.push("고려를 지킨 자");
  if(allMastered(progress.lessonBosses,13,18))titles.push("조선의 기록관");
  if(progress.masteredLessons>=30)titles.push("한국사 대달인");
  if(progress.collectionCount>=30)titles.push("유물 수집가");
  if(progress.collectionCount>=75)titles.push("박물관 탐험가");
  if(progress.collectionCount>=150)titles.push("역사의 보관자");
  if(progress.collectionCount>=progress.totalCollection)titles.push("살아 있는 역사책");
  if(progress.visualOnlyCollected>=progress.visualOnlyTotal)titles.push("시대를 보는 눈");
  if(progress.visualCorrect>=50)titles.push("그림 감정가");
  if(progress.visualCorrect>=100)titles.push("유물을 알아보는 자");
  if(VISUAL_ERA_IDS.every(era=>progress.visualPerfectEras[era]))titles.push("역사의 눈");
  return [...new Set(titles)];
}

export function legacyXp({bossesDefeated,masteredLessons,collectionCount}:{bossesDefeated:number;masteredLessons:number;collectionCount:number}){
  return bossesDefeated*rewards.bossFirstClearXp+masteredLessons*rewards.lessonMasterXp+collectionCount*5;
}

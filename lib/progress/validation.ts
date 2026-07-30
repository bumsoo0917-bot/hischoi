import { encounters } from "../../app/encounters";
import { PLAYABLE_LESSONS, type BooleanMap, type NumberMap, type PlayerProgress, type ProgressWrite } from "./types";

const bossCosts=new Set([30,50,70]);
const bossKeys=new Set(PLAYABLE_LESSONS.flatMap(lesson=>[1,2,3].map(level=>`${lesson}-${level}`)));
const encounterIds=new Set(encounters.map(item=>item.id));
const attemptPattern=/^(practice|boss)-(20|1[0-9]|[1-9])-[123]$/;
const cleanBooleanMap=(value:unknown,allowed:Set<string>):BooleanMap|null=>{
  if(!value||typeof value!=="object"||Array.isArray(value))return null;
  const result:BooleanMap={};
  for(const [key,item] of Object.entries(value)){
    if(!allowed.has(key)||item!==true)return null;
    result[key]=true;
  }
  return result;
};
const cleanAttempts=(value:unknown):NumberMap|null=>{
  if(!value||typeof value!=="object"||Array.isArray(value))return null;
  const result:NumberMap={};
  for(const [key,item] of Object.entries(value)){
    if(!attemptPattern.test(key)||!Number.isInteger(item)||Number(item)<0)return null;
    result[key]=Number(item);
  }
  return result;
};
export function parseProgressWrite(value:unknown):ProgressWrite|null{
  if(!value||typeof value!=="object"||Array.isArray(value))return null;
  const input=value as Record<string,unknown>;
  const currentGold=Number(input.currentGold),totalGold=Number(input.totalGold);
  const defeated=cleanBooleanMap(input.defeated,bossKeys),collection=cleanBooleanMap(input.collection,encounterIds),attempts=cleanAttempts(input.attempts);
  if(!Number.isInteger(currentGold)||currentGold<0||!Number.isInteger(totalGold)||totalGold<currentGold||!defeated||!collection||!attempts)return null;
  return {currentGold,totalGold,defeated,collection,attempts};
}
const containsAll=(before:Record<string,unknown>,after:Record<string,unknown>)=>Object.keys(before).every(key=>key in after);
const changedAttempts=(before:NumberMap,after:NumberMap)=>Object.entries(after).filter(([key,value])=>value!==(before[key]??0));
export function verifyTransition(before:PlayerProgress,input:ProgressWrite){
  if(!containsAll(before.defeated,input.defeated)||!containsAll(before.collection,input.collection)||!containsAll(before.attempts,input.attempts))throw new Error("진행 기록은 되돌릴 수 없습니다.");
  const goldEarned=input.totalGold-before.totalGold;
  const bossAdded=Object.keys(input.defeated).length-Object.keys(before.defeated).length;
  const collectionAdded=Object.keys(input.collection).length-Object.keys(before.collection).length;
  const attemptChanges=changedAttempts(before.attempts,input.attempts);
  if(goldEarned<0||goldEarned>50||bossAdded<0||bossAdded>1||collectionAdded<0||collectionAdded>1||attemptChanges.length>1)throw new Error("한 번에 허용되지 않는 진행 변화입니다.");
  if(attemptChanges.some(([key,value])=>value!==(before.attempts[key]??0)+1))throw new Error("시도 횟수가 올바르지 않습니다.");
  const balanceDelta=input.currentGold-before.currentGold;
  const validEarn=goldEarned>0&&balanceDelta===goldEarned&&bossAdded===0;
  const validSpend=goldEarned===0&&balanceDelta<0&&bossCosts.has(-balanceDelta)&&bossAdded===0;
  const validBossResult=goldEarned===0&&balanceDelta===0&&bossAdded<=1;
  if(!(validEarn||validSpend||validBossResult))throw new Error("골드 또는 보스 진행 변화가 게임 규칙과 일치하지 않습니다.");
}
export function derived(input:ProgressWrite){
  const lessonBosses=Object.fromEntries(PLAYABLE_LESSONS.map(lesson=>[String(lesson),[1,2,3].filter(level=>input.defeated[`${lesson}-${level}`]).length]));
  const bossesDefeated=Object.keys(input.defeated).length;
  const masteredLessons=Object.values(lessonBosses).filter(count=>count===3).length;
  const lessonProgress=Object.fromEntries(PLAYABLE_LESSONS.map(lesson=>[String(lesson),{practiceAttempts:[1,2,3].reduce((sum,level)=>sum+(input.attempts[`practice-${lesson}-${level}`]??0),0),bossAttempts:[1,2,3].reduce((sum,level)=>sum+(input.attempts[`boss-${lesson}-${level}`]??0),0),bossesDefeated:lessonBosses[String(lesson)],mastered:lessonBosses[String(lesson)]===3}]));
  const title=masteredLessons?`${masteredLessons}개 강의 달인`:bossesDefeated>=3?"한국사 보스 사냥꾼":bossesDefeated?"한국사 도전자":"수련을 시작한 모험가";
  return {lessonBosses,lessonProgress,bossesDefeated,masteredLessons,title,rankScore:bossesDefeated*1_000_000_000_000+input.totalGold*1_000+input.currentGold};
}

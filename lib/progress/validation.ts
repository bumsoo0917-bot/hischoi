import { collectionEncounters, COLLECTION_TOTAL, VISUAL_COLLECTION_TOTAL, visualOnlyEncounterIds } from "../../app/collection-data";
import { BASE_TITLE, levelInfo, REWARD_VERSION, rewards, unlockedTitles, VISUAL_ERA_IDS } from "../gamification";
import { PLAYABLE_LESSONS, type BooleanMap, type NumberMap, type PlayerProgress, type ProgressWrite } from "./types";

const bossCosts=new Set([30,50,70]);
const bossKeys=new Set(PLAYABLE_LESSONS.flatMap(lesson=>[1,2,3].map(level=>`${lesson}-${level}`)));
const encounterIds=new Set(collectionEncounters.map(item=>item.id));
const encountersById=new Map(collectionEncounters.map(item=>[item.id,item]));
const visualEraIds=new Set<string>(VISUAL_ERA_IDS);
const visualLessonRanges:Record<string,[number,number]>={prehistory:[1,2],ancient:[3,7],goryeo:[8,12],joseon:[13,18],opening:[19,20],occupation:[21,27],modern:[28,30]};
const attemptPattern=/^(?:(practice|boss)-(30|[12][0-9]|[1-9])-[123]|visual-(prehistory|ancient|goryeo|joseon|opening|occupation|modern))$/;

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
  const currentGold=Number(input.currentGold),totalGold=Number(input.totalGold),xp=Number(input.xp),rewardVersion=Number(input.rewardVersion),visualCorrect=Number(input.visualCorrect);
  const selectedTitle=typeof input.selectedTitle==="string"?input.selectedTitle:"";
  const defeated=cleanBooleanMap(input.defeated,bossKeys);
  const collection=cleanBooleanMap(input.collection,encounterIds);
  const attempts=cleanAttempts(input.attempts);
  const perfectBosses=cleanBooleanMap(input.perfectBosses,bossKeys);
  const visualPerfectEras=cleanBooleanMap(input.visualPerfectEras,visualEraIds);
  if(!Number.isInteger(currentGold)||currentGold<0||!Number.isInteger(totalGold)||totalGold<currentGold||!Number.isInteger(xp)||xp<0||rewardVersion!==REWARD_VERSION||!Number.isInteger(visualCorrect)||visualCorrect<0||!selectedTitle||!defeated||!collection||!attempts||!perfectBosses||!visualPerfectEras)return null;
  return {currentGold,totalGold,xp,rewardVersion,visualCorrect,selectedTitle,defeated,collection,attempts,perfectBosses,visualPerfectEras};
}

const containsAll=(before:Record<string,unknown>,after:Record<string,unknown>)=>Object.keys(before).every(key=>key in after);
const changedAttempts=(before:NumberMap,after:NumberMap)=>Object.entries(after).filter(([key,value])=>value!==(before[key]??0));
const addedCount=(before:Record<string,unknown>,after:Record<string,unknown>)=>Object.keys(after).length-Object.keys(before).length;
const addedKeys=(before:Record<string,unknown>,after:Record<string,unknown>)=>Object.keys(after).filter(key=>!(key in before));

export function verifyTransition(before:PlayerProgress,input:ProgressWrite){
  if(!containsAll(before.defeated,input.defeated)||!containsAll(before.collection,input.collection)||!containsAll(before.attempts,input.attempts)||!containsAll(before.perfectBosses,input.perfectBosses)||!containsAll(before.visualPerfectEras,input.visualPerfectEras))throw new Error("진행 기록은 되돌릴 수 없습니다.");
  const afterDerived=derived(input);
  if(!afterDerived.titles.includes(input.selectedTitle))throw new Error("획득하지 않은 칭호는 선택할 수 없습니다.");

  const goldEarned=input.totalGold-before.totalGold;
  const balanceDelta=input.currentGold-before.currentGold;
  const xpDelta=input.xp-before.xp;
  const visualCorrectDelta=input.visualCorrect-before.visualCorrect;
  const bossAdded=addedCount(before.defeated,input.defeated);
  const collectionAdded=addedCount(before.collection,input.collection);
  const perfectBossAdded=addedCount(before.perfectBosses,input.perfectBosses);
  const visualPerfectAdded=addedCount(before.visualPerfectEras,input.visualPerfectEras);
  const masterAdded=afterDerived.masteredLessons-before.masteredLessons;
  const attemptChanges=changedAttempts(before.attempts,input.attempts);
  const addedBossKeys=addedKeys(before.defeated,input.defeated);
  const addedCollectionKeys=addedKeys(before.collection,input.collection);
  const addedPerfectBossKeys=addedKeys(before.perfectBosses,input.perfectBosses);
  const addedVisualPerfectKeys=addedKeys(before.visualPerfectEras,input.visualPerfectEras);

  if(goldEarned<0||xpDelta<0||visualCorrectDelta<0||bossAdded<0||collectionAdded<0||perfectBossAdded<0||visualPerfectAdded<0||masterAdded<0||attemptChanges.length>1)throw new Error("한 번에 허용되지 않는 진행 변화입니다.");
  if(attemptChanges.some(([key,value])=>value!==(before.attempts[key]??0)+1))throw new Error("시도 횟수가 올바르지 않습니다.");

  const noProgressChange=goldEarned===0&&balanceDelta===0&&xpDelta===0&&visualCorrectDelta===0&&bossAdded===0&&collectionAdded===0&&perfectBossAdded===0&&visualPerfectAdded===0&&masterAdded===0&&attemptChanges.length===0;
  if(noProgressChange)return;

  const validSpend=attemptChanges.length===0&&goldEarned===0&&xpDelta===0&&visualCorrectDelta===0&&bossAdded===0&&collectionAdded===0&&perfectBossAdded===0&&visualPerfectAdded===0&&balanceDelta<0&&bossCosts.has(-balanceDelta);
  if(validSpend)return;
  if(attemptChanges.length!==1)throw new Error("게임 결과에 시도 기록이 없습니다.");

  const attemptKey=attemptChanges[0][0];
  if(attemptKey.startsWith("practice-")){
    const lesson=Number(attemptKey.split("-")[1]);
    const correct=goldEarned/rewards.practiceGoldPerCorrect;
    const validCollection=addedCollectionKeys.every(id=>{const encounter=encountersById.get(id);return encounter?.role==="practice"&&encounter.lessonId===lesson});
    const valid=Number.isInteger(correct)&&correct>=0&&correct<=5&&balanceDelta===goldEarned&&xpDelta===correct*rewards.practiceXpPerCorrect&&visualCorrectDelta===0&&bossAdded===0&&collectionAdded<=1&&validCollection&&perfectBossAdded===0&&visualPerfectAdded===0&&masterAdded===0;
    if(valid)return;
  }

  if(attemptKey.startsWith("boss-")){
    const [,lessonText,levelText]=attemptKey.split("-");
    const resultKey=`${lessonText}-${levelText}`;
    const bonus=bossAdded*rewards.bossFirstClearXp+perfectBossAdded*rewards.bossFirstPerfectXp+masterAdded*rewards.lessonMasterXp;
    const answerXp=xpDelta-bonus;
    const won=answerXp>=9*rewards.bossXpPerCorrect;
    const validCollection=addedCollectionKeys.every(id=>{const encounter=encountersById.get(id);return encounter?.role==="boss"&&encounter.lessonId===Number(lessonText)&&encounter.level===Number(levelText)});
    const valid=goldEarned===0&&balanceDelta===0&&visualCorrectDelta===0&&bossAdded<=1&&addedBossKeys.every(key=>key===resultKey)&&(!bossAdded||won)&&collectionAdded<=1&&validCollection&&(!collectionAdded||won)&&perfectBossAdded<=1&&addedPerfectBossKeys.every(key=>key===resultKey)&&visualPerfectAdded===0&&masterAdded<=1&&answerXp>=0&&answerXp<=10*rewards.bossXpPerCorrect&&answerXp%rewards.bossXpPerCorrect===0&&(!perfectBossAdded||answerXp===10*rewards.bossXpPerCorrect);
    if(valid)return;
  }

  if(attemptKey.startsWith("visual-")){
    const era=attemptKey.slice("visual-".length);
    const range=visualLessonRanges[era];
    const correct=goldEarned/rewards.visualGoldPerCorrect;
    const expectedXp=correct*rewards.visualXpPerCorrect+(correct>=8?rewards.visualPassXp:0)+(correct===10?rewards.visualPerfectXp:0)+collectionAdded*rewards.visualDiscoveryXp;
    const validCollection=Boolean(range)&&addedCollectionKeys.every(id=>{const encounter=encountersById.get(id);return Boolean(encounter&&encounter.lessonId>=range[0]&&encounter.lessonId<=range[1])});
    const valid=Number.isInteger(correct)&&correct>=0&&correct<=10&&balanceDelta===goldEarned&&visualCorrectDelta===correct&&bossAdded===0&&collectionAdded<=correct&&validCollection&&perfectBossAdded===0&&visualPerfectAdded<=1&&addedVisualPerfectKeys.every(key=>key===era)&&masterAdded===0&&xpDelta===expectedXp&&(!visualPerfectAdded||correct===10);
    if(valid)return;
  }

  throw new Error("골드·경험치 또는 진행 변화가 게임 규칙과 일치하지 않습니다.");
}

export function derived(input:ProgressWrite){
  const lessonBosses=Object.fromEntries(PLAYABLE_LESSONS.map(lesson=>[String(lesson),[1,2,3].filter(level=>input.defeated[`${lesson}-${level}`]).length]));
  const bossesDefeated=Object.keys(input.defeated).length;
  const masteredLessons=Object.values(lessonBosses).filter(count=>count===3).length;
  const lessonProgress=Object.fromEntries(PLAYABLE_LESSONS.map(lesson=>[String(lesson),{
    practiceAttempts:[1,2,3].reduce((sum,level)=>sum+(input.attempts[`practice-${lesson}-${level}`]??0),0),
    bossAttempts:[1,2,3].reduce((sum,level)=>sum+(input.attempts[`boss-${lesson}-${level}`]??0),0),
    bossesDefeated:lessonBosses[String(lesson)],
    mastered:lessonBosses[String(lesson)]===3,
  }]));
  const collectionCount=Object.keys(input.collection).length;
  const visualOnlyCollected=Object.keys(input.collection).filter(id=>visualOnlyEncounterIds.has(id)).length;
  const titles=unlockedTitles({bossesDefeated,masteredLessons,lessonBosses,collectionCount,totalCollection:COLLECTION_TOTAL,visualOnlyCollected,visualOnlyTotal:VISUAL_COLLECTION_TOTAL,visualCorrect:input.visualCorrect,perfectBosses:input.perfectBosses,visualPerfectEras:input.visualPerfectEras});
  const selectedTitle=titles.includes(input.selectedTitle)?input.selectedTitle:titles[titles.length-1]??BASE_TITLE;
  const level=levelInfo(input.xp).level;
  return {lessonBosses,lessonProgress,bossesDefeated,masteredLessons,title:selectedTitle,selectedTitle,titles,level,rankScore:bossesDefeated*1_000_000_000_000+input.xp*1_000_000+input.totalGold*1_000+input.currentGold};
}

import { COLLECTION_TOTAL, VISUAL_COLLECTION_TOTAL, visualOnlyEncounterIds } from "./collection-data";
import { BASE_TITLE, legacyXp, levelInfo, REWARD_VERSION, unlockedTitles } from "../lib/gamification";

export type ClientProgress={
  defeated:Record<string,boolean>;
  collection:Record<string,boolean>;
  attempts:Record<string,number>;
  perfectBosses:Record<string,boolean>;
  visualPerfectEras:Record<string,boolean>;
  seen:Record<string,number>;
  wrong:Record<string,number>;
  recent:string[];
  recentEncounters:string[];
  gold:number;
  totalGold:number;
  xp:number;
  rewardVersion:number;
  visualCorrect:number;
  selectedTitle:string;
};

export const emptyClientProgress:ClientProgress={defeated:{},collection:{},attempts:{},perfectBosses:{},visualPerfectEras:{},seen:{},wrong:{},recent:[],recentEncounters:[],gold:0,totalGold:0,xp:0,rewardVersion:REWARD_VERSION,visualCorrect:0,selectedTitle:BASE_TITLE};
export const PROGRESS_STORAGE_KEY="history-master-progress-v3";

export const bossCountForLesson=(progress:ClientProgress,lesson:number)=>[1,2,3].filter(level=>progress.defeated[`${lesson}-${level}`]).length;

export function clientProgressSummary(progress:ClientProgress){
  const lessonBosses=Object.fromEntries(Array.from({length:30},(_,index)=>[String(index+1),bossCountForLesson(progress,index+1)]));
  const bossesDefeated=Object.keys(progress.defeated).length;
  const masteredLessons=Object.values(lessonBosses).filter(count=>count===3).length;
  const collectionCount=Object.keys(progress.collection).length;
  const visualOnlyCollected=Object.keys(progress.collection).filter(id=>visualOnlyEncounterIds.has(id)).length;
  const titles=unlockedTitles({bossesDefeated,masteredLessons,lessonBosses,collectionCount,totalCollection:COLLECTION_TOTAL,visualOnlyCollected,visualOnlyTotal:VISUAL_COLLECTION_TOTAL,visualCorrect:progress.visualCorrect,perfectBosses:progress.perfectBosses,visualPerfectEras:progress.visualPerfectEras});
  const selectedTitle=titles.includes(progress.selectedTitle)?progress.selectedTitle:titles[titles.length-1]??BASE_TITLE;
  return {lessonBosses,bossesDefeated,masteredLessons,collectionCount,visualOnlyCollected,titles,selectedTitle,level:levelInfo(progress.xp)};
}

export function migrateClientProgress(raw:string|null):ClientProgress{
  if(!raw)return emptyClientProgress;
  try{
    const parsed=JSON.parse(raw) as Partial<ClientProgress>;
    const progress:ClientProgress={...emptyClientProgress,...parsed,totalGold:parsed.totalGold??parsed.gold??0,perfectBosses:parsed.perfectBosses??{},visualPerfectEras:parsed.visualPerfectEras??{},visualCorrect:parsed.visualCorrect??0,selectedTitle:parsed.selectedTitle??BASE_TITLE};
    if(progress.rewardVersion!==REWARD_VERSION){
      const summary=clientProgressSummary({...progress,xp:0,rewardVersion:REWARD_VERSION});
      progress.xp=legacyXp({bossesDefeated:summary.bossesDefeated,masteredLessons:summary.masteredLessons,collectionCount:summary.collectionCount});
      progress.rewardVersion=REWARD_VERSION;
    }
    const summary=clientProgressSummary(progress);
    progress.selectedTitle=summary.selectedTitle;
    return progress;
  }catch{return emptyClientProgress}
}

export const progressWrite=(progress:ClientProgress)=>({currentGold:progress.gold,totalGold:progress.totalGold,xp:progress.xp,rewardVersion:progress.rewardVersion,visualCorrect:progress.visualCorrect,selectedTitle:progress.selectedTitle,defeated:progress.defeated,collection:progress.collection,attempts:progress.attempts,perfectBosses:progress.perfectBosses,visualPerfectEras:progress.visualPerfectEras});

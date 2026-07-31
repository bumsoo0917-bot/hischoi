export const PLAYABLE_LESSONS=Array.from({length:30},(_,index)=>index+1);

export type BooleanMap=Record<string,boolean>;
export type NumberMap=Record<string,number>;
export type PlayerProgress={
  userId:string; displayName:string; currentGold:number; totalGold:number;
  xp:number; level:number; rewardVersion:number; visualCorrect:number;
  bossesDefeated:number; masteredLessons:number; title:string; selectedTitle:string; titles:string[]; lessonBosses:Record<string,number>;
  lessonProgress:Record<string,{practiceAttempts:number;bossAttempts:number;bossesDefeated:number;mastered:boolean}>;
  defeated:BooleanMap; collection:BooleanMap; attempts:NumberMap; perfectBosses:BooleanMap; visualPerfectEras:BooleanMap;
  updatedAt:number; rankScore:number;
};
export type ProgressWrite=Pick<PlayerProgress,"currentGold"|"totalGold"|"xp"|"rewardVersion"|"visualCorrect"|"selectedTitle"|"defeated"|"collection"|"attempts"|"perfectBosses"|"visualPerfectEras">;
export type RankedPlayer=Pick<PlayerProgress,"displayName"|"currentGold"|"totalGold"|"xp"|"level"|"title"|"bossesDefeated"|"masteredLessons"|"lessonBosses">&{rank:number};
export interface ProgressRepository{
  ensure(userId:string,displayName:string):Promise<PlayerProgress>;
  get(userId:string):Promise<PlayerProgress|null>;
  saveVerified(userId:string,displayName:string,input:ProgressWrite):Promise<PlayerProgress>;
  leaderboard(limit:number):Promise<RankedPlayer[]>;
  rankOf(player:PlayerProgress):Promise<number>;
}

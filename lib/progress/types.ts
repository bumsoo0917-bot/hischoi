export const PLAYABLE_LESSONS=Array.from({length:20},(_,index)=>index+1);

export type BooleanMap=Record<string,boolean>;
export type NumberMap=Record<string,number>;
export type PlayerProgress={
  userId:string; displayName:string; currentGold:number; totalGold:number;
  bossesDefeated:number; masteredLessons:number; title:string; lessonBosses:Record<string,number>;
  lessonProgress:Record<string,{practiceAttempts:number;bossAttempts:number;bossesDefeated:number;mastered:boolean}>;
  defeated:BooleanMap; collection:BooleanMap; attempts:NumberMap;
  updatedAt:number; rankScore:number;
};
export type ProgressWrite=Pick<PlayerProgress,"currentGold"|"totalGold"|"defeated"|"collection"|"attempts">;
export type RankedPlayer=Pick<PlayerProgress,"displayName"|"currentGold"|"totalGold"|"bossesDefeated"|"masteredLessons"|"lessonBosses">&{rank:number};
export interface ProgressRepository{
  ensure(userId:string,displayName:string):Promise<PlayerProgress>;
  get(userId:string):Promise<PlayerProgress|null>;
  saveVerified(userId:string,displayName:string,input:ProgressWrite):Promise<PlayerProgress>;
  leaderboard(limit:number):Promise<RankedPlayer[]>;
  rankOf(player:PlayerProgress):Promise<number>;
}

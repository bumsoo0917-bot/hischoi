import { derived, verifyTransition } from "./validation";
import { PLAYABLE_LESSONS, type PlayerProgress, type ProgressRepository, type ProgressWrite, type RankedPlayer } from "./types";
const blank=(userId:string,displayName:string):PlayerProgress=>({userId,displayName,currentGold:0,totalGold:0,bossesDefeated:0,masteredLessons:0,title:"수련을 시작한 모험가",lessonProgress:Object.fromEntries(PLAYABLE_LESSONS.map(lesson=>[String(lesson),{practiceAttempts:0,bossAttempts:0,bossesDefeated:0,mastered:false}])),lessonBosses:Object.fromEntries(PLAYABLE_LESSONS.map(lesson=>[String(lesson),0])),defeated:{},collection:{},attempts:{},updatedAt:0,rankScore:0});
export class MemoryProgressRepository implements ProgressRepository{
 private players=new Map<string,PlayerProgress>();
 async ensure(userId:string,displayName:string){const found=this.players.get(userId);if(found)return structuredClone(found);const player=blank(userId,displayName);this.players.set(userId,player);return structuredClone(player);}
 async get(userId:string){const player=this.players.get(userId);return player?structuredClone(player):null;}
 async saveVerified(userId:string,displayName:string,input:ProgressWrite){const before=this.players.get(userId);if(!before)throw new Error("먼저 계정 진행 기록을 생성해야 합니다.");verifyTransition(before,input);const player={...before,...structuredClone(input),...derived(input),displayName,updatedAt:before.updatedAt+1};this.players.set(userId,player);return structuredClone(player);}
 async leaderboard(limit:number){return [...this.players.values()].sort((a,b)=>b.rankScore-a.rankScore||a.updatedAt-b.updatedAt).slice(0,limit).map((player,index)=>this.public(player,index+1));}
 async rankOf(player:PlayerProgress){return [...this.players.values()].filter(item=>item.rankScore>player.rankScore).length+1;}
 private public(player:PlayerProgress,rank:number):RankedPlayer{return {rank,displayName:player.displayName,currentGold:player.currentGold,totalGold:player.totalGold,bossesDefeated:player.bossesDefeated,masteredLessons:player.masteredLessons,lessonBosses:player.lessonBosses};}
}

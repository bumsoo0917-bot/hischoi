import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { adminFirestore } from "../firebase-admin";
import { derived, verifyTransition } from "./validation";
import type { PlayerProgress, ProgressRepository, ProgressWrite, RankedPlayer } from "./types";

const collectionName="playerProgress";
const blank=(userId:string,displayName:string):PlayerProgress=>({userId,displayName,currentGold:0,totalGold:0,bossesDefeated:0,masteredLessons:0,title:"수련을 시작한 모험가",lessonProgress:Object.fromEntries(Array.from({length:10},(_,i)=>[String(i+1),{practiceAttempts:0,bossAttempts:0,bossesDefeated:0,mastered:false}])),lessonBosses:Object.fromEntries(Array.from({length:10},(_,i)=>[String(i+1),0])),defeated:{},collection:{},attempts:{},updatedAt:Date.now(),rankScore:0});
const decode=(data:DocumentData):PlayerProgress=>({...data,updatedAt:data.updatedAt?.toMillis?.()??Number(data.updatedAt)}) as PlayerProgress;
export class FirestoreProgressRepository implements ProgressRepository{
  private db=adminFirestore();
  async ensure(userId:string,displayName:string){
    const ref=this.db.collection(collectionName).doc(userId);
    return this.db.runTransaction(async tx=>{const snapshot=await tx.get(ref);if(snapshot.exists)return decode(snapshot.data()!);const player=blank(userId,displayName);tx.create(ref,{...player,updatedAt:FieldValue.serverTimestamp()});return player;});
  }
  async get(userId:string){const snapshot=await this.db.collection(collectionName).doc(userId).get();return snapshot.exists?decode(snapshot.data()!):null;}
  async saveVerified(userId:string,displayName:string,input:ProgressWrite){
    const ref=this.db.collection(collectionName).doc(userId);
    return this.db.runTransaction(async tx=>{const snapshot=await tx.get(ref);if(!snapshot.exists)throw new Error("먼저 계정 진행 기록을 생성해야 합니다.");const before=decode(snapshot.data()!);verifyTransition(before,input);const player={...before,...input,...derived(input),displayName,updatedAt:Date.now()};tx.update(ref,{...player,updatedAt:FieldValue.serverTimestamp()});return player;});
  }
  async leaderboard(limit:number){const snapshot=await this.db.collection(collectionName).orderBy("rankScore","desc").orderBy("updatedAt","asc").limit(limit).get();return snapshot.docs.map((doc,index)=>{const player=decode(doc.data());return this.public(player,index+1);});}
  async rankOf(player:PlayerProgress){const snapshot=await this.db.collection(collectionName).where("rankScore",">",player.rankScore).count().get();return snapshot.data().count+1;}
  private public(player:PlayerProgress,rank:number):RankedPlayer{return {rank,displayName:player.displayName,currentGold:player.currentGold,totalGold:player.totalGold,bossesDefeated:player.bossesDefeated,masteredLessons:player.masteredLessons,lessonBosses:player.lessonBosses};}
}
let repository:ProgressRepository|undefined;
export const progressRepository=()=>repository??=new FirestoreProgressRepository();

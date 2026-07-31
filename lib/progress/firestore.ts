import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { adminFirestore } from "../firebase-admin";
import { derived, verifyTransition } from "./validation";
import { type PlayerProgress, type ProgressRepository, type ProgressWrite, type RankedPlayer } from "./types";
import { BASE_TITLE, legacyXp, REWARD_VERSION } from "../gamification";

const collectionName="playerProgress";
const blankWrite=():ProgressWrite=>({currentGold:0,totalGold:0,xp:0,rewardVersion:REWARD_VERSION,visualCorrect:0,selectedTitle:BASE_TITLE,defeated:{},collection:{},attempts:{},perfectBosses:{},visualPerfectEras:{}});
const blank=(userId:string,displayName:string):PlayerProgress=>{const input=blankWrite();return {userId,displayName,...input,...derived(input),updatedAt:Date.now()}};
const decode=(data:DocumentData):PlayerProgress=>{
  const defaults=blank(String(data.userId??""),String(data.displayName??"도전자"));
  const input:ProgressWrite={...blankWrite(),currentGold:Number(data.currentGold??0),totalGold:Number(data.totalGold??0),defeated:data.defeated??{},collection:data.collection??{},attempts:data.attempts??{},perfectBosses:data.perfectBosses??{},visualPerfectEras:data.visualPerfectEras??{},visualCorrect:Number(data.visualCorrect??0),selectedTitle:typeof data.selectedTitle==="string"?data.selectedTitle:BASE_TITLE,xp:Number(data.xp??0),rewardVersion:Number(data.rewardVersion??0)};
  if(input.rewardVersion!==REWARD_VERSION){const previous=derived({...input,xp:0,rewardVersion:REWARD_VERSION});input.xp=legacyXp({bossesDefeated:previous.bossesDefeated,masteredLessons:previous.masteredLessons,collectionCount:Object.keys(input.collection).length});input.rewardVersion=REWARD_VERSION}
  const computed=derived(input);
  return {...defaults,...data,...input,...computed,lessonProgress:{...defaults.lessonProgress,...computed.lessonProgress},lessonBosses:{...defaults.lessonBosses,...computed.lessonBosses},updatedAt:data.updatedAt?.toMillis?.()??Number(data.updatedAt)} as PlayerProgress;
};
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
  private public(player:PlayerProgress,rank:number):RankedPlayer{return {rank,displayName:player.displayName,currentGold:player.currentGold,totalGold:player.totalGold,xp:player.xp,level:player.level,title:player.title,bossesDefeated:player.bossesDefeated,masteredLessons:player.masteredLessons,lessonBosses:player.lessonBosses};}
}
let repository:ProgressRepository|undefined;
export const progressRepository=()=>repository??=new FirestoreProgressRepository();

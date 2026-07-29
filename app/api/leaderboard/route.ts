import { getCurrentUser } from "../../current-user";
import { progressRepository } from "../../../lib/progress/firestore";
import { parseProgressWrite } from "../../../lib/progress/validation";
import type { PlayerProgress } from "../../../lib/progress/types";

export const dynamic="force-dynamic";
const publicPlayer=(player:PlayerProgress,rank:number)=>({rank,displayName:player.displayName,currentGold:player.currentGold,totalGold:player.totalGold,bossesDefeated:player.bossesDefeated,masteredLessons:player.masteredLessons,lessonBosses:player.lessonBosses});
export async function GET(){
 try{const user=await getCurrentUser();const repository=progressRepository();const players=await repository.leaderboard(10);let me=null;
  if(user){const player=await repository.ensure(user.id,user.displayName);me={...publicPlayer(player,await repository.rankOf(player)),defeated:player.defeated,collection:player.collection,attempts:player.attempts};}
  return Response.json({players,me});
 }catch(error){return Response.json({error:error instanceof Error?error.message:"순위표를 불러오지 못했습니다."},{status:500});}
}
export async function POST(request:Request){
 try{const user=await getCurrentUser();if(!user)return Response.json({error:"로그인이 필요합니다."},{status:401});const input=parseProgressWrite(await request.json());if(!input)return Response.json({error:"올바르지 않은 진행 기록입니다."},{status:400});const player=await progressRepository().saveVerified(user.id,user.displayName,input);return Response.json({ok:true,progress:{currentGold:player.currentGold,totalGold:player.totalGold,defeated:player.defeated,collection:player.collection,attempts:player.attempts}});
 }catch(error){const message=error instanceof Error?error.message:"진행 기록을 저장하지 못했습니다.";return Response.json({error:message},{status:message.includes("허용")||message.includes("규칙")||message.includes("되돌릴")?409:500});}
}

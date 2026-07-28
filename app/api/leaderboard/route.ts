import { and, asc, count, desc, eq, gt, or } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { playerProgress } from "../../../db/schema";
import { encounters } from "../../encounters";

export const dynamic = "force-dynamic";

const validBossKeys=new Set(["1-1","1-2","1-3","2-1","2-2","2-3"]);
const validEncounterIds=new Set(encounters.map(item=>item.id));

function parseDefeated(value:unknown){
  if(!value||typeof value!=="object"||Array.isArray(value))return null;
  const clean:Record<string,boolean>={};
  for(const [key,defeated] of Object.entries(value)){
    if(!validBossKeys.has(key)||defeated!==true)return null;
    clean[key]=true;
  }
  return clean;
}

function parseCollection(value:unknown){
  if(!value||typeof value!=="object"||Array.isArray(value))return null;
  const clean:Record<string,boolean>={};
  for(const [key,collected] of Object.entries(value)){
    if(!validEncounterIds.has(key)||collected!==true)return null;
    clean[key]=true;
  }
  return clean;
}

function publicPlayer(row:typeof playerProgress.$inferSelect,rank:number){
  return {
    rank,
    displayName:row.displayName,
    currentGold:row.currentGold,
    totalGold:row.totalGold,
    bossesDefeated:row.bossesDefeated,
    lesson1Bosses:row.lesson1Bosses,
    lesson2Bosses:row.lesson2Bosses,
  };
}

export async function GET(){
  try{
    const user=await getChatGPTUser();
    const db=getDb();
    const top=await db.select().from(playerProgress)
      .orderBy(desc(playerProgress.bossesDefeated),desc(playerProgress.totalGold),desc(playerProgress.currentGold),asc(playerProgress.updatedAt))
      .limit(10);
    let me:null|ReturnType<typeof publicPlayer>&{defeated:Record<string,boolean>;collection:Record<string,boolean>}=null;
    if(user){
      const [row]=await db.select().from(playerProgress).where(eq(playerProgress.email,user.email)).limit(1);
      if(row){
        const [{betterCount}]=await db.select({betterCount:count()}).from(playerProgress).where(or(
          gt(playerProgress.bossesDefeated,row.bossesDefeated),
          and(eq(playerProgress.bossesDefeated,row.bossesDefeated),gt(playerProgress.totalGold,row.totalGold)),
          and(eq(playerProgress.bossesDefeated,row.bossesDefeated),eq(playerProgress.totalGold,row.totalGold),gt(playerProgress.currentGold,row.currentGold)),
        ));
        const better=Number(betterCount??0);
        me={...publicPlayer(row,better+1),defeated:JSON.parse(row.defeatedJson||"{}"),collection:JSON.parse(row.collectionJson||"{}")};
      }
    }
    return Response.json({players:top.map((row,index)=>publicPlayer(row,index+1)),me});
  }catch(error){
    return Response.json({error:error instanceof Error?error.message:"순위표를 불러오지 못했습니다."},{status:500});
  }
}

export async function POST(request:Request){
  try{
    const user=await getChatGPTUser();
    if(!user)return Response.json({error:"로그인이 필요합니다."},{status:401});
    const payload=await request.json() as {currentGold?:unknown;totalGold?:unknown;defeated?:unknown;collection?:unknown};
    const currentGold=Number(payload.currentGold);
    const totalGold=Number(payload.totalGold);
    const defeated=parseDefeated(payload.defeated);
    const collection=parseCollection(payload.collection);
    if(!Number.isInteger(currentGold)||currentGold<0||!Number.isInteger(totalGold)||totalGold<currentGold||!defeated||!collection){
      return Response.json({error:"올바르지 않은 진행 기록입니다."},{status:400});
    }
    const lesson1Bosses=[1,2,3].filter(level=>defeated[`1-${level}`]).length;
    const lesson2Bosses=[1,2,3].filter(level=>defeated[`2-${level}`]).length;
    const bossesDefeated=lesson1Bosses+lesson2Bosses;
    const db=getDb();
    const [existing]=await db.select().from(playerProgress).where(eq(playerProgress.email,user.email)).limit(1);
    if(existing&&(totalGold<existing.totalGold||bossesDefeated<existing.bossesDefeated||Object.keys(collection).length<Object.keys(JSON.parse(existing.collectionJson||"{}")).length)){
      return Response.json({error:"서버보다 오래된 진행 기록입니다."},{status:409});
    }
    const values={
      email:user.email,
      displayName:user.fullName?.trim()||user.email.split("@")[0],
      currentGold,
      totalGold,
      bossesDefeated,
      lesson1Bosses,
      lesson2Bosses,
      defeatedJson:JSON.stringify(defeated),
      collectionJson:JSON.stringify(collection),
      updatedAt:Date.now(),
    };
    await db.insert(playerProgress).values(values).onConflictDoUpdate({target:playerProgress.email,set:values});
    return Response.json({ok:true});
  }catch(error){
    return Response.json({error:error instanceof Error?error.message:"진행 기록을 저장하지 못했습니다."},{status:500});
  }
}

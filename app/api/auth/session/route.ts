import { cookies } from "next/headers";
import { adminAuth } from "../../../../lib/firebase-admin";

const expiresIn=5*24*60*60*1000;
export async function POST(request:Request){
  try{const {idToken}=await request.json() as {idToken?:unknown};if(typeof idToken!=="string")return Response.json({error:"ID 토큰이 필요합니다."},{status:400});
    await adminAuth().verifyIdToken(idToken,true);const session=await adminAuth().createSessionCookie(idToken,{expiresIn});
    (await cookies()).set("history_session",session,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:expiresIn/1000});return Response.json({ok:true},{headers:{"cache-control":"no-store"}});
  }catch{return Response.json({error:"Firebase 로그인 세션을 만들지 못했습니다. 잠시 후 다시 시도하거나 관리자에게 서버 설정을 확인해 달라고 요청해 주세요."},{status:401,headers:{"cache-control":"no-store"}});}
}
export async function DELETE(){(await cookies()).set("history_session","",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});return Response.json({ok:true},{headers:{"cache-control":"no-store"}});}

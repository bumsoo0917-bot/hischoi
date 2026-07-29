import { cookies } from "next/headers";
import { adminAuth } from "../../../../lib/firebase-admin";

const expiresIn=5*24*60*60*1000;
export async function POST(request:Request){
  try{const {idToken}=await request.json() as {idToken?:unknown};if(typeof idToken!=="string")return Response.json({error:"ID 토큰이 필요합니다."},{status:400});
    await adminAuth().verifyIdToken(idToken,true);const session=await adminAuth().createSessionCookie(idToken,{expiresIn});
    (await cookies()).set("history_session",session,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:expiresIn/1000});return Response.json({ok:true});
  }catch{return Response.json({error:"Firebase 로그인을 확인할 수 없습니다."},{status:401});}
}
export async function DELETE(){(await cookies()).set("history_session","",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});return Response.json({ok:true});}

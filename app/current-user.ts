import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { adminAuth } from "../lib/firebase-admin";
import { getChatGPTUser } from "./chatgpt-auth";

export type CurrentUser={id:string;displayName:string;email:string;provider:"firebase"|"chatgpt"};
export async function getCurrentUser():Promise<CurrentUser|null>{
  const session=(await cookies()).get("history_session")?.value;
  if(session){
    try{const decoded=await adminAuth().verifySessionCookie(session,true);return {id:`firebase:${decoded.uid}`,displayName:decoded.name?.trim()||decoded.email?.split("@")[0]||"한국사 도전자",email:decoded.email??"",provider:"firebase"};}catch{/* Expired/invalid cookies fall through to the existing workspace identity. */}
  }
  // Vercel request headers are public input; only Firebase session cookies identify users there.
  if(process.env.VERCEL==="1")return null;
  const legacy=await getChatGPTUser();
  if(!legacy)return null;
  const id=createHash("sha256").update(`chatgpt:${legacy.email.toLowerCase()}`).digest("hex");
  return {id:`chatgpt:${id}`,displayName:legacy.fullName?.trim()||legacy.email.split("@")[0],email:legacy.email,provider:"chatgpt"};
}

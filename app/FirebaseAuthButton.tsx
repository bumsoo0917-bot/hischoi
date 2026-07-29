"use client";
import { useState } from "react";
import { clearSession, firebaseClientConfigured, signInAndCreateSession } from "./firebase-client";
export default function FirebaseAuthButton({authenticated,firebaseUser=false,fallbackHref}:{authenticated:boolean;firebaseUser?:boolean;fallbackHref:string}){
 const [busy,setBusy]=useState(false);
 if(authenticated&&!firebaseUser)return <a href={fallbackHref}>로그아웃</a>;
 if(!firebaseClientConfigured)return <a href={fallbackHref}>{authenticated?"로그아웃":"ChatGPT로 로그인"}</a>;
 return <button className="auth-button" disabled={busy} onClick={async()=>{setBusy(true);try{if(firebaseUser)await clearSession();else await signInAndCreateSession()}finally{setBusy(false)}}}>{busy?"처리 중…":firebaseUser?"로그아웃":"Google로 로그인"}</button>;
}

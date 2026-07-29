"use client";
import { useState } from "react";
import {
  authErrorMessage,
  clearSession,
  firebaseClientConfigured,
  signInAsGuest,
  signInWithGoogle,
} from "./firebase-client";

type Action="google"|"anonymous"|"logout"|null;

export default function FirebaseAuthButton({
  authenticated,
  anonymousUser=false,
  firebaseUser=false,
  fallbackHref,
}:{authenticated:boolean;anonymousUser?:boolean;firebaseUser?:boolean;fallbackHref:string}){
  const [busy,setBusy]=useState<Action>(null);
  const [error,setError]=useState("");

  async function run(action:Exclude<Action,null>,task:()=>Promise<void>){
    setBusy(action);
    setError("");
    try{await task()}catch(reason){setError(authErrorMessage(reason));setBusy(null)}
  }

  if(authenticated&&!firebaseUser)return <a href={fallbackHref}>로그아웃</a>;
  if(!firebaseClientConfigured)return <a href={fallbackHref}>{authenticated?"로그아웃":"ChatGPT로 로그인"}</a>;
  if(firebaseUser)return <button className="auth-button" disabled={busy!==null} onClick={()=>run("logout",clearSession)}>
    {busy==="logout"?"처리 중…":anonymousUser?"익명 로그아웃":"로그아웃"}
  </button>;

  return <div className="auth-actions">
    <button className="auth-button auth-google" disabled={busy!==null} onClick={()=>run("google",signInWithGoogle)}>
      {busy==="google"?"연결 중…":<><span aria-hidden="true">G</span>Google로 로그인</>}
    </button>
    <button className="auth-button auth-anonymous" disabled={busy!==null} onClick={()=>run("anonymous",signInAsGuest)}>
      {busy==="anonymous"?"준비 중…":"익명으로 시작"}
    </button>
    {error&&<p className="auth-error" role="alert">{error}</p>}
  </div>;
}

"use client";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithPopup,
  signOut,
  type UserCredential,
} from "firebase/auth";

// Firebase Web app identifiers are public by design. Vercel values override these defaults when present.
const config={
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY||"AIzaSyBPP3SSqROq_oIv2G-8GA8E22RMd7_cOSI",
  authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN||"hischoi.firebaseapp.com",
  projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID||"hischoi",
  appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID||"1:141461201243:web:dc128031219b0fd334ba7e",
};
export const firebaseClientConfigured=Object.values(config).every(Boolean);
const auth=()=>getAuth(getApps().length?getApp():initializeApp(config));

async function createSession(result:UserCredential){
  const idToken=await result.user.getIdToken();
  const response=await fetch("/api/auth/session",{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({idToken}),
  });
  if(!response.ok){
    const body=await response.json().catch(()=>null) as {error?:string}|null;
    throw new Error(body?.error||"로그인 세션을 만들지 못했습니다.");
  }
  location.reload();
}

export async function signInWithGoogle(){
  const provider=new GoogleAuthProvider();
  provider.setCustomParameters({prompt:"select_account"});
  await createSession(await signInWithPopup(auth(),provider));
}

export async function signInAsGuest(){
  await createSession(await firebaseSignInAnonymously(auth()));
}

export function authErrorMessage(error:unknown){
  const code=typeof error==="object"&&error&&"code" in error?String(error.code):"";
  if(code.includes("popup-closed-by-user")||code.includes("cancelled-popup-request"))return "Google 로그인이 취소되었습니다.";
  if(code.includes("popup-blocked"))return "브라우저에서 로그인 팝업을 허용해 주세요.";
  if(code.includes("operation-not-allowed"))return "Firebase 콘솔에서 이 로그인 방식을 먼저 활성화해 주세요.";
  if(code.includes("network-request-failed"))return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";
  return error instanceof Error?error.message:"로그인 중 오류가 발생했습니다.";
}

export async function clearSession(){
  await Promise.allSettled([
    fetch("/api/auth/session",{method:"DELETE"}),
    firebaseClientConfigured?signOut(auth()):Promise.resolve(),
  ]);
  location.reload();
}

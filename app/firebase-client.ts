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
export const firebaseConfigurationError=validateFirebaseConfig(config);
export const firebaseClientConfigured=!firebaseConfigurationError;

export function validateFirebaseConfig(value:Record<string,string>){
  if(Object.values(value).some(item=>!item.trim()))return "Firebase 공개 Web 설정이 누락되었습니다. 관리자에게 환경변수 설정을 요청해 주세요.";
  if(!value.authDomain.includes("."))return "Firebase 인증 도메인 설정이 올바르지 않습니다. 관리자에게 확인해 주세요.";
  return "";
}

const auth=()=>{
  if(firebaseConfigurationError)throw new Error(firebaseConfigurationError);
  return getAuth(getApps().length?getApp():initializeApp(config));
};

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
  if(code.includes("unauthorized-domain"))return "현재 사이트 주소가 Firebase 승인 도메인에 없습니다. 관리자에게 Authorized domains 설정을 요청해 주세요.";
  if(code.includes("invalid-api-key")||code.includes("app-not-authorized"))return "Firebase 공개 Web 설정을 확인할 수 없습니다. 관리자에게 문의해 주세요.";
  if(code.includes("operation-not-allowed"))return "Firebase 콘솔에서 이 로그인 방식을 먼저 활성화해 주세요.";
  if(code.includes("admin-restricted-operation"))return "현재 프로젝트에서 익명 로그인이 허용되지 않습니다. 관리자에게 익명 로그인을 활성화해 달라고 요청해 주세요.";
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

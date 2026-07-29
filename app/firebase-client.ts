"use client";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const config={apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID};
export const firebaseClientConfigured=Object.values(config).every(Boolean);
const auth=()=>getAuth(getApps().length?getApp():initializeApp(config));
export async function signInAndCreateSession(){const result=await signInWithPopup(auth(),new GoogleAuthProvider());const idToken=await result.user.getIdToken();const response=await fetch("/api/auth/session",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({idToken})});if(!response.ok)throw new Error("세션을 만들지 못했습니다.");location.reload();}
export async function clearSession(){await fetch("/api/auth/session",{method:"DELETE"});location.reload();}

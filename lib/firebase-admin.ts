import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function adminApp(){
  if(getApps().length)return getApps()[0];
  const projectId=process.env.FIREBASE_PROJECT_ID;
  const clientEmail=process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey=process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n");
  if(!projectId)throw new Error("FIREBASE_PROJECT_ID가 설정되지 않았습니다.");
  const credential=clientEmail&&privateKey?cert({projectId,clientEmail,privateKey}):applicationDefault();
  return initializeApp({projectId,credential});
}
export const adminAuth=()=>getAuth(adminApp());
export const adminFirestore=()=>getFirestore(adminApp());

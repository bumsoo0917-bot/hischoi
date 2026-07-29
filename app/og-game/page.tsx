import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { chatGPTSignInPath } from "../chatgpt-auth";
import { getCurrentUser } from "../current-user";
import FirebaseAuthButton from "../FirebaseAuthButton";

export const dynamic="force-dynamic";

export default async function GameLoginPage(){
  if(await getCurrentUser())redirect("/");

  return <main className="game-login">
    <Image className="game-login-art" src="/og-game.png" alt="" fill priority sizes="100vw"/>
    <div className="game-login-shade"/>
    <section className="game-login-card" aria-labelledby="login-title">
      <span className="game-login-seal" aria-hidden="true">史</span>
      <p className="eyebrow">한국사 수련장 입장</p>
      <h1 id="login-title">어떤 이름으로<br/>도전할까요?</h1>
      <p className="game-login-copy">계정에 기록을 안전하게 저장하거나, 익명으로 바로 연습을 시작할 수 있습니다.</p>
      <FirebaseAuthButton authenticated={false} fallbackHref={chatGPTSignInPath("/og-game")}/>
      <div className="login-notes">
        <span><b>Google 로그인</b> 다른 기기에서도 진행 상황을 이어갑니다.</span>
        <span><b>익명 시작</b> 별도 가입 없이 이 브라우저에서 시작합니다.</span>
      </div>
      <Link className="login-skip" href="/">로그인 없이 먼저 둘러보기 →</Link>
    </section>
  </main>;
}

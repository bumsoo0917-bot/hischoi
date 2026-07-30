import Image from "next/image";
import FirebaseAuthButton from "./FirebaseAuthButton";

export default function LoginScreen(){
  return <main className="game-login" data-testid="login-gate">
    <Image className="game-login-art" src="/og-game.png" alt="" fill priority sizes="100vw"/>
    <div className="game-login-shade"/>
    <section className="game-login-card" aria-labelledby="login-title">
      <span className="game-login-seal" aria-hidden="true">史</span>
      <p className="eyebrow">한국사 수련장 입장</p>
      <h1 id="login-title">어떤 이름으로<br/>도전할까요?</h1>
      <p className="game-login-copy">Google 계정으로 기록을 이어가거나, 별도 가입 없이 익명으로 바로 시작할 수 있습니다.</p>
      <FirebaseAuthButton authenticated={false} fallbackHref="/"/>
      <div className="login-notes">
        <span><b>Google 로그인</b> 다른 기기에서도 진행 상황을 이어갑니다.</span>
        <span><b>익명 시작</b> 이 브라우저의 익명 계정으로 기록을 저장합니다.</span>
      </div>
    </section>
  </main>;
}

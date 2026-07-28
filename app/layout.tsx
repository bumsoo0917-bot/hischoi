import type { Metadata } from "next";
import "./globals.css";

export const metadata:Metadata={
  title:"한국사 수련장 | 30강 달인 프로젝트",
  description:"최태성 기본별개념3 강의를 따라 단계별 무작위 퀴즈를 풀고 한국사 달인에 도전하세요.",
  icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},
  openGraph:{title:"한국사 수련장",description:"10문제 중 9문제, 네 단계를 넘어 달인으로",images:[{url:"/og.png",width:1672,height:941}]},
  twitter:{card:"summary_large_image",title:"한국사 수련장",description:"10문제 중 9문제, 네 단계를 넘어 달인으로",images:["/og.png"]},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}

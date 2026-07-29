import type { Metadata } from "next";
import "./globals.css";

const siteUrl=process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:"http://localhost:3000";
export const metadata:Metadata={metadataBase:new URL(siteUrl),
  title:"한국사 수련장 | 30강 보스 원정",
  description:"5문제 연습으로 골드를 모으고 세 단계의 한국사 보스를 쓰러뜨려 강의별 달인에 도전하세요.",
  icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},
  openGraph:{title:"한국사 수련장",description:"연습으로 골드를 모아, 세 보스를 넘어 달인으로",images:[{url:"/og-game.png",width:1664,height:934}]},
  twitter:{card:"summary_large_image",title:"한국사 수련장",description:"연습으로 골드를 모아, 세 보스를 넘어 달인으로",images:["/og-game.png"]},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}

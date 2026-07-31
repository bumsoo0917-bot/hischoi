"use client";

import Link from "next/link";

export type NavigationItem={
  label:string;
  shortLabel?:string;
  href?:string;
  onClick?:()=>void;
  active?:boolean;
};

export default function AppNavigation({
  items,
  gold,
  userName,
  onBrandClick,
}:{
  items:NavigationItem[];
  gold?:number;
  userName?:string;
  onBrandClick?:()=>void;
}){
  const renderItem=(item:NavigationItem,mobile=false)=>{
    const className=`app-nav-item${item.active?" active":""}`;
    const content=mobile?(item.shortLabel??item.label):item.label;
    return item.href
      ?<Link key={`${mobile?"mobile":"desktop"}-${item.label}`} className={className} href={item.href} aria-current={item.active?"page":undefined}>{content}</Link>
      :<button key={`${mobile?"mobile":"desktop"}-${item.label}`} className={className} onClick={item.onClick} aria-current={item.active?"page":undefined}>{content}</button>;
  };

  return <>
    <header className="app-nav">
      {onBrandClick
        ?<button className="app-brand" onClick={onBrandClick}><span>史</span><b>한국사 수련장</b></button>
        :<Link className="app-brand" href="/"><span>史</span><b>한국사 수련장</b></Link>}
      <div className="desktop-menu" role="navigation" aria-label="주요 메뉴">{items.map(item=>renderItem(item))}</div>
      <div className="nav-account">
        {typeof gold==="number"&&<b className="nav-gold">{gold} G</b>}
        {userName&&<small>{userName}</small>}
      </div>
    </header>
    <div className="mobile-tabbar" role="navigation" aria-label="모바일 주요 메뉴">{items.slice(0,4).map(item=>renderItem(item,true))}</div>
  </>;
}

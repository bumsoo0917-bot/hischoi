export type EncounterRole="boss"|"practice";
export type EncounterType="유물"|"유적"|"역사 자료";

export type Encounter={
  id:string;
  lessonId:number;
  role:EncounterRole;
  level?:1|2|3;
  name:string;
  type:EncounterType;
  image:string;
  page:string;
  summary:string;
  examTip:string;
  noteUrl:string;
  sourceUrl:string;
};

const overviewUrl="https://contents.history.go.kr/front/ta/print.do?levelId=ta_h41_0030_0010&whereStr=";
const prehistoryUrl="https://contents.history.go.kr/front/ta/print.do?levelId=ta_m71_0020_0010_0040&whereStr=";
const metalUrl="https://contents.history.go.kr/eh_kk/teach/notebook/data/03_d14.htm";

export const encounters:Encounter[]=[
  {
    id:"l1-scroll",lessonId:1,role:"boss",level:1,name:"시대 연표 두루마리",type:"역사 자료",
    image:"/encounters/l1-boss-scroll.webp",page:"PDF 2쪽",
    summary:"선사부터 현대까지의 큰 흐름과 사건의 선후 관계를 보여 주는 자료입니다.",
    examTip:"기원전·기원후와 고대·고려·조선·근현대의 순서를 먼저 잡으세요.",
    noteUrl:"/notes/pdf-2.pdf",sourceUrl:overviewUrl,
  },
  {
    id:"l1-seal",lessonId:1,role:"boss",level:2,name:"왕의 옥새",type:"유물",
    image:"/encounters/l1-boss-seal.webp",page:"PDF 2쪽",
    summary:"왕과 통치 제도를 중심으로 정치사의 흐름을 상징합니다.",
    examTip:"왕의 업적은 당시 제도·대외 관계와 함께 연결해 보세요.",
    noteUrl:"/notes/pdf-2.pdf",sourceUrl:overviewUrl,
  },
  {
    id:"l1-stele",lessonId:1,role:"boss",level:3,name:"금석문 비석",type:"역사 자료",
    image:"/encounters/l1-boss-stele.webp",page:"PDF 2쪽",
    summary:"돌이나 금속에 새긴 글은 당시 사람이 남긴 직접적인 역사 자료입니다.",
    examTip:"자료의 제작 시기와 목적을 확인한 뒤 다른 기록과 함께 해석하세요.",
    noteUrl:"/notes/pdf-2.pdf",sourceUrl:overviewUrl,
  },
  {
    id:"l1-map",lessonId:1,role:"practice",name:"옛 지도",type:"역사 자료",
    image:"/encounters/l1-practice-map.webp",page:"PDF 2쪽",
    summary:"영토와 교류 범위를 통해 시대의 공간적 흐름을 읽는 자료입니다.",
    examTip:"사건의 순서뿐 아니라 발생한 위치도 함께 기억하세요.",
    noteUrl:"/notes/pdf-2.pdf",sourceUrl:overviewUrl,
  },
  {
    id:"l1-ledger",lessonId:1,role:"practice",name:"세금 장부와 엽전",type:"역사 자료",
    image:"/encounters/l1-practice-ledger.webp",page:"PDF 2쪽",
    summary:"토지·세금·교역 등 경제사의 핵심 주제를 상징합니다.",
    examTip:"경제 제도는 국가 재정과 백성의 생활에 미친 영향을 함께 보세요.",
    noteUrl:"/notes/pdf-2.pdf",sourceUrl:overviewUrl,
  },
  {
    id:"l2-handaxe",lessonId:2,role:"boss",level:1,name:"주먹도끼",type:"유물",
    image:"/encounters/l2-boss-handaxe.webp",page:"PDF 3쪽",
    summary:"여러 용도로 사용한 구석기 시대의 대표적인 뗀석기입니다.",
    examTip:"구석기는 이동 생활·사냥과 채집·뗀석기를 함께 묶어 기억하세요.",
    noteUrl:"/notes/pdf-3.pdf",sourceUrl:prehistoryUrl,
  },
  {
    id:"l2-pottery",lessonId:2,role:"boss",level:2,name:"빗살무늬 토기",type:"유물",
    image:"/encounters/l2-boss-pottery.webp",page:"PDF 3쪽",
    summary:"식량 저장과 조리에 사용한 신석기 시대의 대표 토기입니다.",
    examTip:"신석기는 농경과 목축·정착 생활·간석기와 연결하세요.",
    noteUrl:"/notes/pdf-3.pdf",sourceUrl:prehistoryUrl,
  },
  {
    id:"l2-dolmen",lessonId:2,role:"boss",level:3,name:"고인돌",type:"유적",
    image:"/encounters/l2-boss-dolmen.webp",page:"PDF 3쪽",
    summary:"청동기 시대 지배자의 권력과 계급 분화를 보여 주는 무덤입니다.",
    examTip:"고인돌·비파형 동검은 청동기 문화와 지배층의 등장을 보여 줍니다.",
    noteUrl:"/notes/pdf-3.pdf",sourceUrl:metalUrl,
  },
  {
    id:"l2-pithouse",lessonId:2,role:"practice",name:"움집",type:"유적",
    image:"/encounters/l2-practice-pithouse.webp",page:"PDF 3쪽",
    summary:"신석기 시대 정착 생활과 마을 형성을 보여 주는 주거지입니다.",
    examTip:"바닥을 파고 만든 집, 중앙 화덕, 강가·바닷가 입지를 확인하세요.",
    noteUrl:"/notes/pdf-3.pdf",sourceUrl:prehistoryUrl,
  },
  {
    id:"l2-dagger",lessonId:2,role:"practice",name:"비파형 동검",type:"유물",
    image:"/encounters/l2-practice-dagger.webp",page:"PDF 3쪽",
    summary:"고조선의 문화 범위와 청동기 시대 권력을 보여 주는 대표 유물입니다.",
    examTip:"비파형 동검의 분포는 고조선의 문화 범위를 파악하는 단서입니다.",
    noteUrl:"/notes/pdf-3.pdf",sourceUrl:metalUrl,
  },
];

export const encounterById=(id:string)=>encounters.find(item=>item.id===id);
export const bossEncounter=(lessonId:number,level:1|2|3)=>encounters.find(item=>item.lessonId===lessonId&&item.role==="boss"&&item.level===level);
export const practiceEncounters=(lessonId:number)=>encounters.filter(item=>item.lessonId===lessonId&&item.role==="practice");

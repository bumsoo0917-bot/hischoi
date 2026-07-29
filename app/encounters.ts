export type EncounterRole="boss"|"practice";
export type EncounterType="인물"|"유물"|"유적"|"역사 자료";

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

const lessonEncounterData:Record<number,{page:number;url:string;items:Array<[string,EncounterRole,EncounterType,string]>}>={
  3:{page:6,url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m51_0040_0020",items:[["광개토 대왕","boss","인물","l3-boss-gwanggaeto.webp"],["근초고왕","boss","인물","l3-boss-geunchogo.webp"],["진흥왕","boss","인물","l3-boss-jinheung.webp"],["장수왕","practice","인물","l3-practice-jangsu.webp"],["성왕","practice","인물","l3-practice-seong.webp"]]},
  4:{page:10,url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m51_0040_0040",items:[["문무왕","boss","인물","l4-boss-munmu.webp"],["신문왕","boss","인물","l4-boss-sinmun.webp"],["대조영","boss","인물","l4-boss-daejoyeong.webp"],["장보고","practice","인물","l4-practice-jangbogo.webp"],["발해 무왕","practice","인물","l4-practice-mu.webp"]]},
  5:{page:12,url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m51_0050",items:[["신라 촌락 문서","boss","역사 자료","l5-boss-village-document.webp"],["신라 금관","boss","유물","l5-boss-gold-crown.webp"],["발해 상경성","boss","유적","l5-boss-sanggyeong.webp"],["동시전 저울","practice","유물","l5-practice-market-scale.webp"],["장보고 무역선","practice","유물","l5-practice-trade-ship.webp"]]},
  6:{page:14,url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m51_0060",items:[["금동 미륵보살 반가사유상","boss","유물","l6-boss-pensive-bodhisattva.webp"],["다보탑","boss","유적","l6-boss-dabotap.webp"],["석굴암 본존불","boss","유물","l6-boss-seokguram.webp"],["미륵사지 석탑","practice","유적","l6-practice-mireuksa.webp"],["발해 영광탑","practice","유적","l6-practice-yeonggwang.webp"]]},
  7:{page:16,url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m51_0060",items:[["첨성대","boss","유적","l7-boss-cheomseongdae.webp"],["무용총 수렵도","boss","역사 자료","l7-boss-hunting.webp"],["백제 금동 대향로","boss","유물","l7-boss-incense.webp"],["천마도","practice","역사 자료","l7-practice-cheonma.webp"],["가야금","practice","유물","l7-practice-gayageum.webp"]]},
  8:{page:18,url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m52_0030",items:[["태조 왕건","boss","인물","l8-boss-wanggeon.webp"],["광종","boss","인물","l8-boss-gwangjong.webp"],["성종","boss","인물","l8-boss-seongjong.webp"],["훈요 10조","practice","역사 자료","l8-practice-hunyo.webp"],["개경 궁궐","practice","유적","l8-practice-palace.webp"]]},
  9:{page:22,url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m52_0040",items:[["서희","boss","인물","l9-boss-seohui.webp"],["강감찬","boss","인물","l9-boss-gang.webp"],["공민왕","boss","인물","l9-boss-gongmin.webp"],["팔만대장경","practice","유물","l9-practice-tripitaka.webp"],["강화산성","practice","유적","l9-practice-fortress.webp"]]},
  10:{page:24,url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m52_0050",items:[["벽란도","boss","유적","l10-boss-byeokrando.webp"],["은병 활구","boss","유물","l10-boss-silver.webp"],["전시과 문서","boss","역사 자료","l10-boss-jeonsigwa.webp"],["고려청자 운송선","practice","유물","l10-practice-ship.webp"],["의창 곡식 창고","practice","유적","l10-practice-granary.webp"]]},
};

const extendedEncounters:Encounter[]=Object.entries(lessonEncounterData).flatMap(([lesson,data])=>data.items.map(([name,role,type,file],index)=>({
  id:`l${lesson}-${role}-${index+1}`,lessonId:Number(lesson),role,level:role==="boss"?(index+1) as 1|2|3:undefined,name,type,
  image:`/encounters/${file}`,page:`PDF ${data.page}쪽`,noteUrl:`/notes/pdf-${data.page}.pdf`,sourceUrl:data.url,
  summary:`${Number(lesson)}강의 핵심 ${type}인 ${name}입니다. 강의 필기의 시대적 맥락과 함께 살펴보세요.`,
  examTip:`${name}의 특징과 관련 사건·제도를 같은 시대의 유사 개념과 구별하세요.`,
})));

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
  ...extendedEncounters,
];

export const encounterById=(id:string)=>encounters.find(item=>item.id===id);
export const bossEncounter=(lessonId:number,level:1|2|3)=>encounters.find(item=>item.lessonId===lessonId&&item.role==="boss"&&item.level===level);
export const practiceEncounters=(lessonId:number)=>encounters.filter(item=>item.lessonId===lessonId&&item.role==="practice");

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

type LaterEncounterData={
  lessonId:number; name:string; role:EncounterRole; type:EncounterType; file:string; page:number;
  summary:string; examTip:string; sourceUrl:string;
};
const laterEncounterData:LaterEncounterData[]=[
  {lessonId:11,name:"의천",role:"boss",type:"인물",file:"l11-boss-uicheon.webp",page:26,summary:"교종을 중심으로 선종을 통합하고 해동 천태종을 창시한 고려의 승려입니다.",examTip:"교관겸수·해동 천태종은 의천, 정혜쌍수·돈오점수는 지눌과 연결하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h71_0070_0020"},
  {lessonId:11,name:"지눌",role:"boss",type:"인물",file:"l11-boss-jinul.webp",page:26,summary:"수선사 결사를 이끌며 선종 중심의 불교 개혁을 추진한 고려의 승려입니다.",examTip:"정혜쌍수·돈오점수·수선사 결사를 한 묶음으로 기억하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h71_0070_0020"},
  {lessonId:11,name:"김부식",role:"boss",type:"인물",file:"l11-boss-kimbusik.webp",page:26,summary:"왕명에 따라 유교적 관점의 역사서 『삼국사기』를 편찬한 고려의 문신입니다.",examTip:"김부식-삼국사기, 일연-삼국유사, 이승휴-제왕운기를 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h71_0070_0020"},
  {lessonId:11,name:"안향",role:"practice",type:"인물",file:"l11-practice-anhyang.webp",page:26,summary:"원에서 성리학을 들여오고 고려 말 유학 교육 진흥에 힘쓴 학자입니다.",examTip:"고려 말 성리학 수용과 연결하고 불교 통합을 추진한 승려들과 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h71_0070_0020"},
  {lessonId:11,name:"일연",role:"practice",type:"인물",file:"l11-practice-iryeon.webp",page:26,summary:"단군 신화와 불교·민간 설화를 담은 『삼국유사』를 쓴 고려의 승려입니다.",examTip:"삼국유사는 개인 저술, 삼국사기는 왕명 편찬이라는 차이를 확인하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h71_0070_0020"},

  {lessonId:12,name:"팔만대장경",role:"boss",type:"유물",file:"l12-boss-tripitaka.webp",page:28,summary:"몽골 침입을 불교의 힘으로 극복하려 고종 때 새긴 대장경판입니다.",examTip:"거란 침입 때의 초조대장경과 몽골 침입 때의 팔만대장경을 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m51_0060_0050"},
  {lessonId:12,name:"상감 청자",role:"boss",type:"유물",file:"l12-boss-celadon.webp",page:28,summary:"표면을 파고 흰색·검은색 흙을 메워 무늬를 만든 고려의 대표 자기입니다.",examTip:"무늬 없이 유약색을 살린 순청자와 제작 기법을 비교하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m51_0060_0050"},
  {lessonId:12,name:"직지심체요절",role:"boss",type:"역사 자료",file:"l12-boss-jikji.webp",page:28,summary:"청주 흥덕사에서 금속 활자로 인쇄한 현존 세계 최고 금속 활자본입니다.",examTip:"현존본이 없는 상정고금예문보다 뒤지만 실제 인쇄본이 남아 있습니다.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m51_0060_0050"},
  {lessonId:12,name:"부석사 무량수전",role:"practice",type:"유적",file:"l12-practice-muryangsujeon.webp",page:28,summary:"배흘림기둥과 주심포 양식으로 알려진 고려 시대의 대표 목조 건축물입니다.",examTip:"공포를 기둥 위에 놓은 주심포 양식의 특징을 확인하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m51_0060_0050"},
  {lessonId:12,name:"화통도감 화포",role:"practice",type:"유물",file:"l12-practice-hwatong.webp",page:29,summary:"최무선의 건의로 설치된 화통도감에서 제작하여 왜구 격퇴에 활용한 화기입니다.",examTip:"고려 말 화약·화포 기술과 진포 대첩을 함께 기억하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m51_0060_0050"},

  {lessonId:13,name:"정도전",role:"boss",type:"인물",file:"l13-boss-jeongdojeon.webp",page:30,summary:"조선 건국에 참여하고 재상 중심의 통치 체제를 구상한 정치가입니다.",examTip:"조선경국전·재상 중심 정치·왕자의 난을 정도전과 연결하세요.",sourceUrl:"https://contents.history.go.kr/front/tg/view.do?ganada=&levelId=tg_003_0020&pageUnit=10&treeId=0200"},
  {lessonId:13,name:"태종",role:"boss",type:"인물",file:"l13-boss-taejong.webp",page:30,summary:"사병을 혁파하고 6조 직계제를 실시하여 왕권을 강화한 조선의 왕입니다.",examTip:"사병 혁파·호패법·6조 직계제를 태종의 왕권 강화책으로 묶으세요.",sourceUrl:"https://contents.history.go.kr/front/tg/view.do?ganada=&levelId=tg_003_0020&pageUnit=10&treeId=0200"},
  {lessonId:13,name:"세종",role:"boss",type:"인물",file:"l13-boss-sejong.webp",page:30,summary:"집현전을 중심으로 학문과 제도를 정비하고 훈민정음을 창제한 조선의 왕입니다.",examTip:"의정부 서사제·집현전·4군 6진·쓰시마섬 정벌을 함께 정리하세요.",sourceUrl:"https://contents.history.go.kr/front/tg/view.do?ganada=&levelId=tg_003_0020&pageUnit=10&treeId=0200"},
  {lessonId:13,name:"세조",role:"practice",type:"인물",file:"l13-practice-sejo.webp",page:30,summary:"6조 직계제를 다시 실시하고 경국대전 편찬을 시작한 조선의 왕입니다.",examTip:"세조 때 편찬을 시작한 경국대전은 성종 때 완성되었습니다.",sourceUrl:"https://contents.history.go.kr/front/tg/view.do?ganada=&levelId=tg_003_0020&pageUnit=10&treeId=0200"},
  {lessonId:13,name:"성종",role:"practice",type:"인물",file:"l13-practice-seongjong.webp",page:30,summary:"경국대전을 완성·반포하여 조선의 통치 체제를 정비한 왕입니다.",examTip:"홍문관 설치와 경국대전 완성을 성종과 연결하세요.",sourceUrl:"https://contents.history.go.kr/front/tg/view.do?ganada=&levelId=tg_003_0020&pageUnit=10&treeId=0200"},

  {lessonId:14,name:"광해군",role:"boss",type:"인물",file:"l14-boss-gwanghae.webp",page:41,summary:"명과 후금 사이에서 중립 외교를 추진한 조선의 왕입니다.",examTip:"중립 외교는 광해군, 친명배금 정책은 인조반정 이후와 연결하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_h52_0030_0020&whereStr="},
  {lessonId:14,name:"영조",role:"boss",type:"인물",file:"l14-boss-yeongjo.webp",page:40,summary:"탕평비를 세우고 이조 전랑의 권한을 약화하며 탕평 정치를 추진한 왕입니다.",examTip:"영조의 탕평비·균역법, 정조의 규장각·장용영을 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_h52_0030_0020&whereStr="},
  {lessonId:14,name:"정조",role:"boss",type:"인물",file:"l14-boss-jeongjo.webp",page:40,summary:"규장각·초계문신제·장용영을 통해 왕권을 강화하고 개혁 정치를 추진한 왕입니다.",examTip:"규장각·초계문신제·장용영·수원 화성을 한 묶음으로 기억하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_h52_0030_0020&whereStr="},
  {lessonId:14,name:"인조",role:"practice",type:"인물",file:"l14-practice-injo.webp",page:41,summary:"인조반정으로 즉위하고 병자호란 때 남한산성에서 항전한 조선의 왕입니다.",examTip:"인조반정 뒤 친명배금 정책이 강화되었고 정묘·병자호란이 이어졌습니다.",sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_h52_0030_0020&whereStr="},
  {lessonId:14,name:"효종",role:"practice",type:"인물",file:"l14-practice-hyojong.webp",page:41,summary:"병자호란의 치욕을 씻기 위해 북벌을 추진한 조선의 왕입니다.",examTip:"효종의 북벌론과 청의 문물을 수용하자는 북학론을 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_h52_0030_0020&whereStr="},

  {lessonId:15,name:"과전법 문서",role:"boss",type:"역사 자료",file:"l15-boss-gwajeon.webp",page:36,summary:"관리에게 경기 지방 토지의 수조권을 지급한 조선 초기 토지 제도를 상징합니다.",examTip:"소유권이 아니라 수조권을 지급했고 뒤에 직전법·관수 관급제로 바뀝니다.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h71_0050"},
  {lessonId:15,name:"대동법 대동미",role:"boss",type:"유물",file:"l15-boss-daedong.webp",page:42,summary:"공납을 토지 결수에 따라 쌀·동전·베 등으로 거둔 대동법을 상징합니다.",examTip:"대동법 시행으로 공인이 성장하고 상품 화폐 경제가 발달했습니다.",sourceUrl:"https://contents.history.go.kr/front/tg/view.do?levelId=tg_003_1700&treeId=0100"},
  {lessonId:15,name:"상평통보",role:"boss",type:"유물",file:"l15-boss-sangpyeong.webp",page:42,summary:"조선 후기에 전국적으로 널리 유통되어 일상 거래에 쓰인 동전입니다.",examTip:"장시·사상·공인의 성장과 함께 상품 화폐 경제 발달의 증거로 확인하세요.",sourceUrl:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m52_0030_0020"},
  {lessonId:15,name:"모내기 도구",role:"practice",type:"유물",file:"l15-practice-rice.webp",page:42,summary:"모판에서 기른 모를 논에 옮겨 심는 조선 후기 모내기법을 상징합니다.",examTip:"모내기법 확산은 노동력 절감·생산량 증가·광작의 배경이 되었습니다.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h71_0050"},
  {lessonId:15,name:"장시 상인의 저울",role:"practice",type:"유물",file:"l15-practice-market.webp",page:42,summary:"조선 후기 장시와 사상의 성장을 보여 주는 상업 도구입니다.",examTip:"시전 상인의 금난전권과 정조의 신해통공을 함께 비교하세요.",sourceUrl:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m52_0030_0020"},
];
const laterEncounters:Encounter[]=laterEncounterData.map((item,index)=>({
  id:`l${item.lessonId}-${item.role}-${index+1}`,
  lessonId:item.lessonId,
  role:item.role,
  level:item.role==="boss"?(laterEncounterData.slice(0,index+1).filter(candidate=>candidate.lessonId===item.lessonId&&candidate.role==="boss").length as 1|2|3):undefined,
  name:item.name,
  type:item.type,
  image:`/encounters/${item.file}`,
  page:`PDF ${item.page}쪽`,
  noteUrl:`/notes/pdf-${item.page}.pdf`,
  sourceUrl:item.sourceUrl,
  summary:item.summary,
  examTip:item.examTip,
}));

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
  ...laterEncounters,
];

export const encounterById=(id:string)=>encounters.find(item=>item.id===id);
export const bossEncounter=(lessonId:number,level:1|2|3)=>encounters.find(item=>item.lessonId===lessonId&&item.role==="boss"&&item.level===level);
export const practiceEncounters=(lessonId:number)=>encounters.filter(item=>item.lessonId===lessonId&&item.role==="practice");

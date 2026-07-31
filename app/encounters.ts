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

const detailedEncounterContent:Record<string,{summary:string;examTip:string}>={
  "광개토 대왕":{summary:"광개토 대왕은 영락이라는 독자 연호를 사용하고 백제를 공격했으며, 신라에 침입한 왜를 물리쳐 고구려의 영토를 크게 넓힌 왕입니다.",examTip:"영락 연호·백제 공격·신라 구원·만주 지역 확장을 한 인물과 연결하세요."},
  "근초고왕":{summary:"근초고왕은 마한의 여러 소국을 복속하고 평양성을 공격해 고국원왕을 전사시키며 백제의 전성기를 이끈 왕입니다.",examTip:"마한 복속·고구려 평양성 공격·중국 및 일본과의 교류를 함께 기억하세요."},
  "진흥왕":{summary:"진흥왕은 한강 유역을 차지하고 대가야를 정복했으며, 새로 확보한 지역을 순행한 사실을 순수비에 남긴 신라의 왕입니다.",examTip:"한강 유역 확보·대가야 정복·화랑도 정비·순수비를 한 묶음으로 기억하세요."},
  "장수왕":{summary:"장수왕은 국내성에서 평양으로 도읍을 옮기고 남진 정책을 추진하여 백제의 한성을 함락한 고구려의 왕입니다.",examTip:"평양 천도·남진 정책·백제 한성 함락을 연결하세요."},
  "성왕":{summary:"성왕은 웅진에서 사비로 도읍을 옮기고 국호를 남부여로 고쳤으며, 신라와 함께 한강 유역을 되찾으려 한 백제의 왕입니다.",examTip:"사비 천도·남부여·한강 유역 수복 시도·관산성 전투를 연결하세요."},
  "문무왕":{summary:"문무왕은 백제와 고구려 멸망 뒤 당의 지배 야욕에 맞서 나당 전쟁을 벌이고 676년 삼국 통일을 완성한 신라의 왕입니다.",examTip:"백제·고구려 멸망 이후의 나당 전쟁과 매소성·기벌포 전투를 연결하세요."},
  "신문왕":{summary:"신문왕은 김흠돌의 난을 진압하고 관료전을 지급한 뒤 녹읍을 폐지했으며, 9주 5소경 체제를 정비한 통일 신라의 왕입니다.",examTip:"김흠돌의 난·관료전 지급·녹읍 폐지·9주 5소경을 한 묶음으로 기억하세요."},
  "대조영":{summary:"대조영은 고구려 유민과 말갈인을 이끌고 동모산에서 나라를 세워 발해의 기틀을 마련한 인물입니다.",examTip:"고구려 유민·말갈인·동모산·발해 건국을 연결하세요."},
  "장보고":{summary:"장보고는 완도에 청해진을 설치하고 신라·당·일본을 잇는 해상 무역을 장악한 인물입니다.",examTip:"완도 청해진·해적 소탕·국제 해상 무역을 연결하세요."},
  "발해 무왕":{summary:"발해 무왕은 인안이라는 연호를 사용하고 장문휴에게 당의 산둥반도를 공격하게 하는 등 당과 대립한 왕입니다.",examTip:"인안 연호·장문휴의 산둥반도 공격을 문왕의 친당 정책과 구별하세요."},
  "신라 촌락 문서":{summary:"신라 촌락 문서는 서원경 부근 네 촌락의 인구·토지·가축·나무 등을 기록하고 3년마다 다시 작성한 통일 신라의 행정 자료입니다.",examTip:"촌락의 노동력과 조세 징수를 파악하기 위한 문서라는 점을 확인하세요."},
  "신라 금관":{summary:"신라 금관은 돌무지덧널무덤에서 주로 출토되며, 나뭇가지와 사슴뿔 모양 장식으로 왕의 권위와 뛰어난 금속 공예를 보여 주는 유물입니다.",examTip:"신라의 돌무지덧널무덤과 함께 기억하고 백제 금동 대향로와 구별하세요."},
  "발해 상경성":{summary:"발해 상경성은 당의 장안성을 본떠 바둑판 모양 도로와 주작대로를 갖춘 발해의 대표 수도 유적입니다.",examTip:"당 문화의 영향을 받은 발해의 수도 구조를 확인하세요."},
  "동시전 저울":{summary:"동시전 저울은 지증왕 때 수도에 설치한 시장인 동시를 감독하고 물품 거래를 관리하던 모습을 상징하는 도구입니다.",examTip:"지증왕의 동시 설치와 동시전의 시장 감독 기능을 구별해 기억하세요."},
  "장보고 무역선":{summary:"장보고 무역선은 청해진을 근거지로 신라·당·일본 사이의 해상 교역을 주도한 통일 신라의 국제 무역을 상징합니다.",examTip:"완도 청해진과 동아시아 해상 교역망을 연결하세요."},
  "금동 미륵보살 반가사유상":{summary:"금동 미륵보살 반가사유상은 한쪽 다리를 다른 무릎 위에 올리고 손가락을 뺨에 댄 채 생각에 잠긴 삼국 시대의 불교 조각입니다.",examTip:"반가사유 자세와 삼국 시대의 수준 높은 금동 불상이라는 점을 확인하세요."},
  "다보탑":{summary:"다보탑은 불국사에 세워진 통일 신라의 석탑으로, 복잡하고 화려한 구조가 돋보이는 독창적인 문화유산입니다.",examTip:"같은 불국사의 단정한 삼층 석탑인 석가탑과 형태를 구별하세요."},
  "석굴암 본존불":{summary:"석굴암 본존불은 화강암을 짜 맞춘 인공 석굴의 중심에 앉아 있는 통일 신라 불교 조각의 대표 문화유산입니다.",examTip:"삼국 시대 불상과 구별하고 통일 신라·인공 석굴·불국사와 연결하세요."},
  "미륵사지 석탑":{summary:"미륵사지 석탑은 백제 무왕 때 세운 것으로, 목탑의 기둥과 지붕 구조를 돌로 표현한 백제의 대표 석탑입니다.",examTip:"백제 무왕·익산 미륵사·목탑 양식의 석탑화를 연결하세요."},
  "발해 영광탑":{summary:"발해 영광탑은 벽돌로 쌓은 여러 층의 탑으로, 발해 문화에 나타난 중국 문화의 영향을 보여 주는 유적입니다.",examTip:"돌로 만든 신라 석탑과 재료·형태를 구별하세요."},
  "첨성대":{summary:"첨성대는 선덕 여왕 때 경주에 세운 천문 관측 시설로, 신라의 과학 기술과 천문 관측 활동을 보여 주는 유적입니다.",examTip:"선덕 여왕·경주·천문 관측을 연결하세요."},
  "무용총 수렵도":{summary:"무용총 수렵도는 말을 달리며 활을 쏘아 사냥하는 장면을 역동적으로 그린 고구려 고분 벽화입니다.",examTip:"고구려인의 활달한 생활 모습과 고분 벽화를 연결하세요."},
  "백제 금동 대향로":{summary:"백제 금동 대향로는 부여 능산리 절터에서 출토되었으며, 불교와 도교적 요소가 어우러진 백제의 뛰어난 금속 공예품입니다.",examTip:"부여 능산리·백제 금속 공예·불교와 도교 요소를 연결하세요."},
  "천마도":{summary:"천마도는 경주 천마총에서 출토된 말다래에 하늘을 나는 말의 모습을 그린 신라의 회화 자료입니다.",examTip:"천마총·말다래·신라 회화를 연결하세요."},
  "가야금":{summary:"가야금은 가야의 가실왕이 만들게 하고 우륵이 신라에 전한 것으로 알려진 현악기입니다.",examTip:"가실왕·우륵·가야 문화가 신라에 전해진 과정을 연결하세요."},
  "태조 왕건":{summary:"태조 왕건은 후삼국을 통일하고 혼인과 성씨 하사로 호족을 포섭했으며, 북진 정책과 훈요 10조를 남긴 고려의 왕입니다.",examTip:"후삼국 통일·호족 포섭·북진 정책·훈요 10조를 연결하세요."},
  "광종":{summary:"광종은 노비안검법으로 호족의 세력을 약화하고 과거제를 실시했으며, 백관의 공복을 제정해 왕권을 강화한 고려의 왕입니다.",examTip:"노비안검법·과거제·공복 제정을 한 묶음으로 기억하세요."},
  "성종":{summary:"성종은 고려에서 최승로의 시무 28조를 받아들여 유교 정치 이념을 확립하고 12목에 지방관을 파견한 왕입니다.",examTip:"고려 성종의 12목 설치와 조선 성종의 경국대전 완성을 구별하세요."},
  "훈요 10조":{summary:"훈요 10조는 고려 태조가 후대 왕에게 남긴 정치 지침으로, 불교 숭상과 서경 중시 등의 내용을 담고 있습니다.",examTip:"태조의 유훈이라는 점과 불교·서경 관련 내용을 확인하세요."},
  "개경 궁궐":{summary:"개경 궁궐은 고려 태조가 철원에서 도읍을 옮긴 뒤 왕조의 정치 중심으로 삼은 수도의 궁궐 유적입니다.",examTip:"고려의 수도 개경과 서경 중시 정책을 구별하세요."},
  "서희":{summary:"서희는 거란의 1차 침입 때 소손녕과 담판하여 고려가 고구려를 계승했음을 내세우고 강동 6주를 확보한 외교가입니다.",examTip:"거란 1차 침입·소손녕과의 담판·강동 6주를 연결하세요."},
  "강감찬":{summary:"강감찬은 거란의 3차 침입 때 고려군을 지휘해 귀주에서 거란군을 크게 물리친 장군입니다.",examTip:"거란 3차 침입·귀주 대첩을 연결하고 서희의 외교 담판과 구별하세요."},
  "공민왕":{summary:"공민왕은 정동행성 이문소를 폐지하고 쌍성총관부를 수복했으며, 전민변정도감을 설치해 원의 간섭과 권문세족을 견제한 왕입니다.",examTip:"반원 자주 정책·쌍성총관부 수복·전민변정도감을 연결하세요."},
  "팔만대장경":{summary:"팔만대장경은 몽골의 침입을 부처의 힘으로 물리치기를 바라며 고려 고종 때 새긴 대장경판으로, 현재 해인사에 보관되어 있습니다.",examTip:"거란 침입 때 만든 초조대장경과 몽골 침입 때 만든 팔만대장경을 구별하세요."},
  "강화산성":{summary:"강화산성은 몽골 침입 때 고려 정부가 강화도로 도읍을 옮겨 장기간 항전한 사실을 보여 주는 방어 유적입니다.",examTip:"강화도 천도·몽골 항쟁·삼별초의 항쟁으로 이어지는 흐름을 확인하세요."},
  "벽란도":{summary:"벽란도는 고려의 수도 개경 가까이에 있던 국제 무역항으로, 송 상인과 아라비아 상인 등이 드나들었습니다.",examTip:"개경 인근 국제 무역항·송과 아라비아 상인의 왕래를 연결하세요."},
  "은병 활구":{summary:"은병 활구는 고려 숙종 때 은 한 근으로 우리나라 지형을 본떠 만든 고액 화폐입니다.",examTip:"숙종·은으로 만든 고액 화폐를 삼한통보·해동통보와 구별하세요."},
  "전시과 문서":{summary:"전시과 문서는 고려의 관리에게 관직과 등급에 따라 전지와 시지의 수조권을 지급한 토지 제도를 보여 주는 자료입니다.",examTip:"토지 소유권이 아니라 조세를 거둘 권리인 수조권을 지급했다는 점을 확인하세요."},
  "고려청자 운송선":{summary:"고려청자 운송선은 강진·부안 등에서 만든 청자를 바닷길로 개경과 소비지에 운반한 고려의 해상 유통을 보여 줍니다.",examTip:"청자 생산지인 강진·부안과 조운·해상 운송을 연결하세요."},
  "의창 곡식 창고":{summary:"의창 곡식 창고는 고려가 평상시에 곡식을 저장했다가 흉년이 들면 백성에게 나누어 주어 구휼하던 사회 제도를 상징합니다.",examTip:"빈민 구제 기관인 의창과 물가 조절 기관인 상평창을 구별하세요."},
};

const extendedEncounters:Encounter[]=Object.entries(lessonEncounterData).flatMap(([lesson,data])=>data.items.map(([name,role,type,file],index)=>{
  const content=detailedEncounterContent[name];
  if(!content)throw new Error(`${lesson}강 ${name}의 상세 단서가 없습니다.`);
  return {
  id:`l${lesson}-${role}-${index+1}`,lessonId:Number(lesson),role,level:role==="boss"?(index+1) as 1|2|3:undefined,name,type,
  image:`/encounters/${file}`,page:`PDF ${data.page}쪽`,noteUrl:`/notes/pdf-${data.page}.pdf`,sourceUrl:data.url,
  summary:content.summary,
  examTip:content.examTip,
  };
}));

type LaterEncounterData={
  lessonId:number; name:string; role:EncounterRole; type:EncounterType; file:string; page:number;
  summary:string; examTip:string; sourceUrl:string;
};
const official:Record<number,{url:string}>={
  21:{url:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_m62_0050_0030&whereStr="},
  22:{url:"https://contents.history.go.kr/eh_kk/teach/tong/III/23.htm"},
  23:{url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m52_0040_0060"},
  24:{url:"https://contents.history.go.kr/mobile/eh/view.do?code=ganada&levelId=eh_r0334_0010"},
  25:{url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m62_0070_0020"},
  26:{url:"https://contents.history.go.kr/data/pdf/eh/eh_r0336_0010.pdf"},
  27:{url:"https://contents.history.go.kr/mobile/mid/ta_h71_0040_0050_0030_0040"},
  28:{url:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_m62_0080_0010&whereStr="},
  29:{url:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_m62_0080_0020&whereStr="},
  30:{url:"https://contents.history.go.kr/mobile/eh/view.do?code=ganada&levelId=eh_r0404_0010"},
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

  {lessonId:16,name:"공명첩",role:"boss",type:"역사 자료",file:"l16-boss-gongmyeong.webp",page:44,summary:"이름을 비워 둔 관직 임명장을 판매해 국가 재정을 보충하고 신분 상승에 활용한 문서입니다.",examTip:"실제 직무를 맡기는 임명장이라기보다 조선 후기 신분 변동을 보여 주는 명예직 증서입니다.",sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_m62_0040_0010&whereStr="},
  {lessonId:16,name:"정감록",role:"boss",type:"역사 자료",file:"l16-boss-jeonggamrok.webp",page:44,summary:"조선 왕조의 쇠퇴와 새 세상의 도래를 예언해 민중에게 널리 퍼진 예언서입니다.",examTip:"현실 제도를 고치는 실학의 개혁론과 새 왕조를 기대한 예언 사상을 구별하세요.",sourceUrl:"https://contents.history.go.kr/eh_kk/teach/tong/v/44.html"},
  {lessonId:16,name:"동경대전",role:"boss",type:"역사 자료",file:"l16-boss-donggyeong.webp",page:44,summary:"최제우의 가르침을 한문으로 기록한 동학의 핵심 경전입니다.",examTip:"한문 경전인 동경대전과 한글 가사인 용담유사를 함께 구별해 기억하세요.",sourceUrl:"https://contents.history.go.kr/eh_kk/teach/tong/v/44.html"},
  {lessonId:16,name:"조선 후기 호적대장",role:"practice",type:"역사 자료",file:"l16-practice-census.webp",page:44,summary:"양반 인구 증가와 상민·노비 인구 감소 등 신분제 동요를 살필 수 있는 기록입니다.",examTip:"법제상의 양천제와 실제 사회에서 나타난 신분 이동을 나누어 보세요.",sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_m62_0040_0010&whereStr="},
  {lessonId:16,name:"공노비 해방 문서",role:"practice",type:"역사 자료",file:"l16-practice-emancipation.webp",page:44,summary:"1801년 순조 때 중앙 관서 공노비를 해방한 조치를 상징하는 문서입니다.",examTip:"중앙 관서 공노비가 대상이었으며 모든 사노비를 한꺼번에 없앤 조치는 아닙니다.",sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_m62_0040_0010&whereStr="},

  {lessonId:17,name:"훈민정음 해례본",role:"boss",type:"역사 자료",file:"l17-boss-yeolha.webp",page:39,summary:"훈민정음의 창제 원리와 글자 사용법을 풀이한 조선 전기 문화의 핵심 기록입니다.",examTip:"훈민정음 자체와 창제 원리를 해설한 해례본, 최초 한글 작품인 용비어천가를 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h31_0060_0020"},
  {lessonId:17,name:"혼일강리역대국도지도",role:"boss",type:"역사 자료",file:"l17-boss-daedong-map.webp",page:38,summary:"태종 때 제작되어 동아시아와 유럽·아프리카 일부까지 표현한 세계 지도입니다.",examTip:"조선 후기 김정호의 전국 지도인 대동여지도와 시기와 범위를 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h31_0060_0020"},
  {lessonId:17,name:"측우기",role:"boss",type:"유물",file:"l17-boss-balhaego.webp",page:39,summary:"세종 때 지역별 강우량을 표준화하여 측정하도록 제작한 우량계입니다.",examTip:"시간을 재는 앙부일구·자격루와 비의 양을 재는 측우기를 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h31_0060_0020"},
  {lessonId:17,name:"분청사기",role:"practice",type:"유물",file:"l17-practice-armillary.webp",page:39,summary:"청자 바탕에 백토를 입혀 자유롭고 소박한 무늬를 표현한 조선 전기의 자기입니다.",examTip:"순백색을 중시한 백자와 표면 장식 방식과 미감을 비교하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h31_0060_0020"},
  {lessonId:17,name:"몽유도원도",role:"practice",type:"역사 자료",file:"l17-practice-bukhagui.webp",page:39,summary:"안견이 안평 대군의 꿈 이야기를 바탕으로 그린 조선 전기 산수화입니다.",examTip:"안견의 몽유도원도와 강희안의 고사관수도, 조선 후기 진경산수화를 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h31_0060_0020"},

  {lessonId:18,name:"곤여만국전도",role:"boss",type:"역사 자료",file:"l18-boss-world-map.webp",page:46,summary:"마테오 리치가 제작해 조선 지식인의 세계관 확대에 영향을 준 서양식 세계 지도입니다.",examTip:"조선 중심의 전통 지도와 달리 세계의 여러 대륙과 바다를 넓게 보여 줍니다.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0040_0020"},
  {lessonId:18,name:"동의보감",role:"boss",type:"역사 자료",file:"l18-boss-donguibogam.webp",page:46,summary:"허준이 우리나라와 중국의 의학 지식을 종합해 편찬한 의학서입니다.",examTip:"허임의 침구경험방, 정약용의 마과회통, 이제마의 동의수세보원을 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0040_0020"},
  {lessonId:18,name:"인왕제색도",role:"boss",type:"역사 자료",file:"l18-boss-inwang.webp",page:46,summary:"정선이 비 온 뒤 인왕산의 모습을 그린 조선 후기 진경산수화의 대표작입니다.",examTip:"실제 산천을 그린 진경산수화와 사람들의 일상을 그린 풍속화를 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/tg/view.do?levelId=tg_003_2840&treeId=0100"},
  {lessonId:18,name:"판소리 북",role:"practice",type:"유물",file:"l18-practice-pansori.webp",page:46,summary:"소리꾼의 창과 사설에 고수가 장단을 더하는 판소리 공연을 상징하는 북입니다.",examTip:"한 명의 소리꾼과 고수가 이끄는 판소리와 여러 연희자의 탈춤을 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0040_0020"},
  {lessonId:18,name:"탈춤 가면",role:"practice",type:"유물",file:"l18-practice-mask.webp",page:46,summary:"춤과 재담으로 양반 사회의 모순을 풍자한 조선 후기 탈춤을 상징합니다.",examTip:"서민 문화의 해학과 양반 사회 비판이라는 특징을 확인하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0040_0020"},

  {lessonId:19,name:"흥선 대원군",role:"boss",type:"인물",file:"l19-boss-daewongun.webp",page:47,summary:"왕권 강화와 민생 안정책을 추진하고 서양과의 통상 수교를 거부한 인물입니다.",examTip:"내정 개혁과 병인양요·신미양요 뒤의 척화비를 함께 연결하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0050_0010"},
  {lessonId:19,name:"양헌수",role:"boss",type:"인물",file:"l19-boss-yangheonsu.webp",page:47,summary:"병인양요 때 정족산성에서 프랑스군을 물리친 조선의 장군입니다.",examTip:"병인양요-양헌수-정족산성, 신미양요-어재연-광성보를 짝지으세요.",sourceUrl:"https://contents.history.go.kr/data/pdf/eh/eh_n0624_0010.pdf"},
  {lessonId:19,name:"어재연",role:"boss",type:"인물",file:"l19-boss-eojaeyeon.webp",page:47,summary:"신미양요 때 광성보에서 미군에 맞서 결사 항전한 조선의 장군입니다.",examTip:"광성보와 수자기는 어재연의 신미양요 항전과 연결됩니다.",sourceUrl:"https://contents.history.go.kr/data/pdf/eh/eh_n0624_0010.pdf"},
  {lessonId:19,name:"고종",role:"practice",type:"인물",file:"l19-practice-gojong.webp",page:47,summary:"어린 나이에 즉위해 초기에는 아버지 흥선 대원군이 정치를 주도한 조선의 왕입니다.",examTip:"흥선 대원군의 집권기와 고종의 친정 이후 개항 정책을 시간순으로 구별하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0050_0010"},
  {lessonId:19,name:"최익현",role:"practice",type:"인물",file:"l19-practice-choeikhyeon.webp",page:47,summary:"흥선 대원군의 정책을 비판하는 상소를 올려 고종 친정의 계기를 만든 유학자입니다.",examTip:"뒤에는 개항 반대와 위정척사 운동을 이끈 인물로도 활동했습니다.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m31_0100_0010"},

  {lessonId:20,name:"강화도 조약문",role:"boss",type:"역사 자료",file:"l20-boss-treaty.webp",page:48,summary:"1876년 일본에 영사 재판권과 해안 측량권을 허용한 최초의 근대적 불평등 조약 문서입니다.",examTip:"조선 자주국 조항과 부산·원산·인천 개항, 불평등 조항을 함께 확인하세요.",sourceUrl:"https://contents.history.go.kr/front/hm/view.do?levelId=hm_115_0010"},
  {lessonId:20,name:"운요호",role:"boss",type:"유물",file:"l20-boss-unyo.webp",page:48,summary:"1875년 강화도와 영종도를 공격해 일본이 개항을 강요하는 구실을 만든 군함입니다.",examTip:"운요호 사건 다음 해 강화도 조약이 체결되었습니다.",sourceUrl:"https://contents.history.go.kr/front/hm/view.do?levelId=hm_115_0010"},
  {lessonId:20,name:"우정총국",role:"boss",type:"유적",file:"l20-boss-post-office.webp",page:49,summary:"갑신정변 세력이 개국 축하연을 이용해 정변을 시작한 근대 우편 기관입니다.",examTip:"1884년 갑신정변과 김옥균·박영효·홍영식 등 급진 개화파를 연결하세요.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0050_0020"},
  {lessonId:20,name:"별기군 병사",role:"practice",type:"인물",file:"l20-practice-byeolgigun.webp",page:48,summary:"일본인 교관에게 신식 무기와 군사 훈련을 받은 조선의 신식 군대 병사입니다.",examTip:"별기군과 구식 군인의 차별 대우는 임오군란의 중요한 배경입니다.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0050_0020"},
  {lessonId:20,name:"영선사 기술자",role:"practice",type:"인물",file:"l20-practice-yeongseonsa.webp",page:48,summary:"청의 톈진에서 근대 무기 제조 기술을 배우고 기기창 설치에 기여한 사절단 인물입니다.",examTip:"청에는 영선사, 일본에는 조사 시찰단을 파견했습니다.",sourceUrl:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0050_0020"},

  {lessonId:21,name:"전봉준",role:"boss",type:"인물",file:"l21-boss-jeonbongjun.webp",page:50,summary:"1894년 동학 농민군을 이끌고 보국안민·제폭구민을 내세운 지도자입니다.",examTip:"고부 봉기·백산 봉기·황토현 전투·우금치 전투의 흐름과 연결하세요.",sourceUrl:official[21].url},
  {lessonId:21,name:"집강소",role:"boss",type:"유적",file:"l21-boss-jipgangso.webp",page:50,summary:"전주 화약 뒤 농민군이 전라도 각지에서 폐정 개혁을 실행한 자치 기구입니다.",examTip:"중앙 개혁 기구 군국기무처와 설치 주체를 구별하세요.",sourceUrl:official[21].url},
  {lessonId:21,name:"독립문",role:"boss",type:"유적",file:"l21-boss-independence-gate.webp",page:51,summary:"독립 협회가 자주독립 의식을 높이기 위해 영은문 자리에 세운 문입니다.",examTip:"독립신문·독립문·만민공동회를 독립 협회와 묶어 기억하세요.",sourceUrl:official[21].url},
  {lessonId:21,name:"군국기무처 의안",role:"practice",type:"역사 자료",file:"l21-practice-gunguk.webp",page:50,summary:"갑오개혁의 정치·경제·사회 개혁안을 심의한 군국기무처의 문서를 상징합니다.",examTip:"동학 농민군의 폐정 개혁안과 갑오개혁의 제도 개혁을 구별하세요.",sourceUrl:official[21].url},
  {lessonId:21,name:"광무 황제 고종",role:"practice",type:"인물",file:"l21-practice-gojong-emperor.webp",page:51,summary:"대한 제국을 선포하고 구본신참 원칙의 광무개혁을 추진한 황제입니다.",examTip:"원수부·양전 사업·지계 발급·상공업 진흥을 광무개혁과 연결하세요.",sourceUrl:official[21].url},

  {lessonId:22,name:"안중근",role:"boss",type:"인물",file:"l22-boss-anjunggeun.webp",page:52,summary:"1909년 하얼빈역에서 이토 히로부미를 처단한 독립운동가입니다.",examTip:"동양 평화론과 단지 동맹, 하얼빈 의거를 함께 기억하세요.",sourceUrl:official[22].url},
  {lessonId:22,name:"13도 창의군",role:"boss",type:"인물",file:"l22-boss-righteous-army.webp",page:52,summary:"이인영을 총대장으로 삼아 서울 진공 작전을 추진한 의병 연합 부대입니다.",examTip:"정미의병과 해산 군인의 합류를 연결하세요.",sourceUrl:official[22].url},
  {lessonId:22,name:"을사늑약 문서",role:"boss",type:"역사 자료",file:"l22-boss-eulsa-treaty.webp",page:52,summary:"1905년 대한 제국의 외교권을 빼앗고 통감부를 설치한 강제 조약 문서입니다.",examTip:"을사늑약-외교권, 한일 신협약-내정권, 기유각서-사법권을 구별하세요.",sourceUrl:official[22].url},
  {lessonId:22,name:"신민회",role:"practice",type:"역사 자료",file:"l22-practice-sinminhoe.webp",page:52,summary:"공화정 수립과 독립군 기지 건설을 추진한 비밀 결사를 상징합니다.",examTip:"안창호·양기탁, 오산학교·대성학교, 자기회사·태극서관을 묶으세요.",sourceUrl:official[22].url},
  {lessonId:22,name:"헤이그 특사 이준",role:"practice",type:"인물",file:"l22-practice-leejun.webp",page:52,summary:"을사늑약의 부당함을 알리려고 헤이그 만국 평화 회의에 파견된 특사입니다.",examTip:"이상설·이위종과 함께 파견되었고 고종 강제 퇴위의 구실이 되었습니다.",sourceUrl:official[22].url},

  {lessonId:23,name:"독립신문",role:"boss",type:"역사 자료",file:"l23-boss-independent.webp",page:55,summary:"서재필이 창간한 최초의 민간 신문으로 한글판과 영문판을 발행했습니다.",examTip:"정부 발행 한성순보와 민간 발행 독립신문을 구별하세요.",sourceUrl:official[23].url},
  {lessonId:23,name:"경인선 증기기관차",role:"boss",type:"유물",file:"l23-boss-railway.webp",page:55,summary:"1899년 노량진과 제물포를 잇는 우리나라 최초의 철도를 상징합니다.",examTip:"경인선-1899, 경부선-1905, 경의선-1906을 구별하세요.",sourceUrl:official[23].url},
  {lessonId:23,name:"대한매일신보",role:"boss",type:"역사 자료",file:"l23-boss-daehan-daily.webp",page:55,summary:"양기탁과 베델이 발행해 국채 보상 운동과 항일 언론 활동을 지원한 신문입니다.",examTip:"황성신문의 시일야방성대곡과 발행 인물을 구별하세요.",sourceUrl:official[23].url},
  {lessonId:23,name:"원산학사",role:"practice",type:"유적",file:"l23-practice-wonsan-school.webp",page:55,summary:"1883년 원산 주민이 세운 우리나라 최초의 근대식 사립 학교입니다.",examTip:"민간 설립 원산학사와 정부의 동문학·육영공원을 구별하세요.",sourceUrl:official[23].url},
  {lessonId:23,name:"주시경",role:"practice",type:"인물",file:"l23-practice-jusigyeong.webp",page:56,summary:"국문 연구소와 조선어 연구에 참여해 한글의 체계화에 힘쓴 학자입니다.",examTip:"국문 연구소·국어 문법·말모이와 연결하세요.",sourceUrl:official[23].url},

  {lessonId:24,name:"조선 총독부 청사",role:"boss",type:"유적",file:"l24-boss-government-general.webp",page:57,summary:"입법·행정·사법·군사권을 장악한 일제 식민 통치의 중심 기관을 상징합니다.",examTip:"총독은 일본 천황에게 직속되었고 육해군 대장 출신이 임명되었습니다.",sourceUrl:official[24].url},
  {lessonId:24,name:"헌병 경찰",role:"boss",type:"인물",file:"l24-boss-military-police.webp",page:57,summary:"1910년대 무단 통치 아래 일반 경찰 업무까지 맡은 헌병 경찰입니다.",examTip:"헌병 경찰제·태형령·즉결 처분권을 무단 통치와 연결하세요.",sourceUrl:official[24].url},
  {lessonId:24,name:"황국 신민 서사",role:"boss",type:"역사 자료",file:"l24-boss-imperial-oath.webp",page:57,summary:"한국인에게 일본 천황의 신민임을 외우도록 강요한 민족 말살 정책의 자료입니다.",examTip:"신사 참배·창씨개명·우리말 금지와 함께 정리하세요.",sourceUrl:official[24].url},
  {lessonId:24,name:"토지 조사부",role:"practice",type:"역사 자료",file:"l24-practice-land-ledger.webp",page:57,summary:"신고주의로 토지 소유권을 조사해 식민지 지주제를 강화한 사업의 문서입니다.",examTip:"토지 조사 사업과 산미 증식 계획의 시기와 목적을 구별하세요.",sourceUrl:official[24].url},
  {lessonId:24,name:"산미 증식 쌀가마",role:"practice",type:"유물",file:"l24-practice-rice-sacks.webp",page:57,summary:"한국의 쌀을 증산해 일본으로 반출한 산미 증식 계획을 상징합니다.",examTip:"증산량보다 반출량이 더 크게 늘어 한국인의 식량 사정이 악화되었습니다.",sourceUrl:official[24].url},

  {lessonId:25,name:"3·1 독립선언서",role:"boss",type:"역사 자료",file:"l25-boss-declaration.webp",page:58,summary:"1919년 민족 대표가 독립을 선언하고 전국적 만세 운동의 시작을 알린 문서입니다.",examTip:"2·8 독립 선언과 3·1 독립 선언의 장소와 주체를 구별하세요.",sourceUrl:official[25].url},
  {lessonId:25,name:"대한민국 임시 정부 청사",role:"boss",type:"유적",file:"l25-boss-provisional-gov.webp",page:59,summary:"1919년 상하이에 수립되어 민주 공화제를 채택한 임시 정부를 상징합니다.",examTip:"연통제·교통국·독립 공채·구미위원부를 함께 기억하세요.",sourceUrl:official[25].url},
  {lessonId:25,name:"안창호",role:"boss",type:"인물",file:"l25-boss-ahnchangho.webp",page:58,summary:"신민회와 흥사단을 이끌고 실력 양성과 독립 운동 조직에 힘쓴 인물입니다.",examTip:"대성학교·자기회사·신민회·흥사단과 연결하세요.",sourceUrl:official[25].url},
  {lessonId:25,name:"신흥 무관 학교 생도",role:"practice",type:"인물",file:"l25-practice-military-school.webp",page:58,summary:"서간도에서 독립군 간부 교육을 받은 신흥 무관 학교 생도입니다.",examTip:"경학사·삼원보·신민회 계열의 독립군 기지 건설과 연결하세요.",sourceUrl:official[25].url},
  {lessonId:25,name:"유관순",role:"practice",type:"인물",file:"l25-practice-yugwansun.webp",page:58,summary:"아우내 장터 만세 시위를 이끌고 옥중에서도 독립 의지를 굽히지 않은 인물입니다.",examTip:"3·1 운동의 전국적·대중적 확산을 보여 주는 대표 인물입니다.",sourceUrl:official[25].url},

  {lessonId:26,name:"신간회",role:"boss",type:"역사 자료",file:"l26-boss-singanhoe.webp",page:60,summary:"비타협적 민족주의와 사회주의 세력이 만든 민족 유일당 성격의 합법 단체입니다.",examTip:"정우회 선언·광주 학생 항일 운동 지원·전국 지회를 연결하세요.",sourceUrl:official[26].url},
  {lessonId:26,name:"김원봉",role:"boss",type:"인물",file:"l26-boss-kimwonbong.webp",page:60,summary:"의열단을 조직하고 조선 의용대를 창설한 무장 독립 운동가입니다.",examTip:"김원봉-의열단·조선 의용대, 김구-한인 애국단·한국 광복군을 구별하세요.",sourceUrl:official[26].url},
  {lessonId:26,name:"광주 학생 항일 운동",role:"boss",type:"역사 자료",file:"l26-boss-gwangju-students.webp",page:60,summary:"1929년 나주역 한일 학생 충돌에서 시작해 전국으로 확산된 학생 운동입니다.",examTip:"신간회의 진상 조사단 파견과 민중 대회 계획을 연결하세요.",sourceUrl:official[26].url},
  {lessonId:26,name:"방정환",role:"practice",type:"인물",file:"l26-practice-bangjeonghwan.webp",page:60,summary:"어린이날을 제정하고 어린이 인권을 높이는 소년 운동을 이끈 인물입니다.",examTip:"천도교 소년회와 잡지 『어린이』를 함께 기억하세요.",sourceUrl:official[26].url},
  {lessonId:26,name:"조선어 연구회 회보",role:"practice",type:"역사 자료",file:"l26-practice-korean-language.webp",page:61,summary:"가갸날 제정과 한글 맞춤법 연구를 추진한 민족 문화 운동을 상징합니다.",examTip:"조선어 연구회가 조선어 학회로 발전한 흐름을 확인하세요.",sourceUrl:official[26].url},

  {lessonId:27,name:"윤봉길",role:"boss",type:"인물",file:"l27-boss-yunbonggil.webp",page:62,summary:"상하이 훙커우 공원 의거로 중국 국민당 정부의 임시 정부 지원을 이끌어 낸 인물입니다.",examTip:"한인 애국단·1932년·훙커우 공원을 묶으세요.",sourceUrl:official[27].url},
  {lessonId:27,name:"한국 광복군",role:"boss",type:"인물",file:"l27-boss-liberation-army.webp",page:62,summary:"1940년 충칭에서 임시 정부가 창설한 정규 군대입니다.",examTip:"지청천 총사령관·국내 진공 작전·미국 OSS 협력을 연결하세요.",sourceUrl:official[27].url},
  {lessonId:27,name:"조선 의용대",role:"boss",type:"인물",file:"l27-boss-volunteer-corps.webp",page:62,summary:"1938년 김원봉이 중국 관내에서 창설한 최초의 한인 군사 조직입니다.",examTip:"한국 광복군보다 먼저 창설되었고 일부가 광복군에 합류했습니다.",sourceUrl:official[27].url},
  {lessonId:27,name:"이봉창",role:"practice",type:"인물",file:"l27-practice-leebongchang.webp",page:62,summary:"1932년 도쿄에서 일본 국왕의 행렬에 폭탄을 던진 한인 애국단원입니다.",examTip:"이봉창-도쿄, 윤봉길-상하이 훙커우 공원을 구별하세요.",sourceUrl:official[27].url},
  {lessonId:27,name:"조선어 학회 사전 원고",role:"practice",type:"역사 자료",file:"l27-practice-dictionary.webp",page:62,summary:"우리말 큰사전 편찬을 추진하다 일제의 조선어 학회 사건으로 탄압받은 원고입니다.",examTip:"1942년 조선어 학회 사건과 민족 문화 수호 운동을 연결하세요.",sourceUrl:official[27].url},

  {lessonId:28,name:"대한민국 정부 수립 태극기",role:"boss",type:"역사 자료",file:"l28-boss-government.webp",page:65,summary:"1948년 8월 15일 대한민국 정부 수립을 상징하는 태극기입니다.",examTip:"5·10 총선거-제헌 국회-제헌 헌법-정부 수립의 순서를 잡으세요.",sourceUrl:official[28].url},
  {lessonId:28,name:"6·25 전쟁 철모",role:"boss",type:"유물",file:"l28-boss-war-helmet.webp",page:65,summary:"북한군의 남침으로 시작된 6·25 전쟁과 유엔군 참전을 상징하는 철모입니다.",examTip:"낙동강 방어선·인천 상륙 작전·중국군 개입·정전 협정의 순서를 확인하세요.",sourceUrl:official[28].url},
  {lessonId:28,name:"정전 협정문",role:"boss",type:"역사 자료",file:"l28-boss-armistice.webp",page:65,summary:"1953년 전투 중지와 군사분계선·비무장 지대 설치를 규정한 문서입니다.",examTip:"평화 조약이 아니라 정전 협정이라는 점을 놓치지 마세요.",sourceUrl:official[28].url},
  {lessonId:28,name:"김구",role:"practice",type:"인물",file:"l28-practice-kimgu.webp",page:64,summary:"남한 단독 정부 수립을 반대하고 김규식과 함께 남북 협상을 추진한 인물입니다.",examTip:"대한민국 임시 정부·한인 애국단·남북 협상과 연결하세요.",sourceUrl:official[28].url},
  {lessonId:28,name:"여운형",role:"practice",type:"인물",file:"l28-practice-yeounhyeong.webp",page:64,summary:"조선 건국 동맹과 건국 준비 위원회를 이끌고 좌우 합작 운동을 추진한 인물입니다.",examTip:"김규식과 좌우 합작 위원회를 이끈 점을 기억하세요.",sourceUrl:official[28].url},

  {lessonId:29,name:"4·19 혁명 학생",role:"boss",type:"인물",file:"l29-boss-april-revolution.webp",page:66,summary:"3·15 부정 선거와 독재에 맞서 민주주의를 되찾은 학생과 시민을 상징합니다.",examTip:"김주열의 희생과 이승만 하야, 장면 내각 출범을 연결하세요.",sourceUrl:official[29].url},
  {lessonId:29,name:"5·18 민주화 운동 시민",role:"boss",type:"인물",file:"l29-boss-gwangju-democracy.webp",page:68,summary:"1980년 광주에서 계엄 확대와 신군부에 맞서 민주화를 요구한 시민을 상징합니다.",examTip:"12·12 사태-서울의 봄-계엄 확대-5·18의 흐름을 잡으세요.",sourceUrl:official[29].url},
  {lessonId:29,name:"6월 민주 항쟁 시민",role:"boss",type:"인물",file:"l29-boss-june-struggle.webp",page:68,summary:"1987년 대통령 직선제와 민주화를 요구한 전국적 시민 항쟁을 상징합니다.",examTip:"박종철 고문 치사·이한열 희생·6·29 선언·9차 개헌을 연결하세요.",sourceUrl:official[29].url},
  {lessonId:29,name:"장면",role:"practice",type:"인물",file:"l29-practice-jangmyeon.webp",page:66,summary:"4·19 혁명 뒤 제2공화국의 내각 책임제 정부를 이끈 국무총리입니다.",examTip:"제3차 개헌·양원제·내각 책임제와 연결하세요.",sourceUrl:official[29].url},
  {lessonId:29,name:"박종철",role:"practice",type:"인물",file:"l29-practice-parkjongcheol.webp",page:68,summary:"경찰 고문으로 숨져 1987년 6월 민주 항쟁의 도화선이 된 대학생입니다.",examTip:"고문 치사 사건 은폐 폭로와 6월 항쟁의 인과 관계를 확인하세요.",sourceUrl:official[29].url},

  {lessonId:30,name:"새마을기",role:"boss",type:"유물",file:"l30-boss-saemaeul.webp",page:69,summary:"근면·자조·협동을 내세운 1970년대 새마을 운동을 상징하는 깃발입니다.",examTip:"농촌 생활 환경 개선과 소득 증대 정책을 함께 기억하세요.",sourceUrl:official[30].url},
  {lessonId:30,name:"포항제철 용광로",role:"boss",type:"유적",file:"l30-boss-steelworks.webp",page:69,summary:"1970년대 철강·조선·기계 중심 중화학 공업화를 상징합니다.",examTip:"1960년대 경공업 수출과 1970년대 중화학 공업을 구별하세요.",sourceUrl:official[30].url},
  {lessonId:30,name:"6·15 공동 선언 악수",role:"boss",type:"역사 자료",file:"l30-boss-summit.webp",page:70,summary:"2000년 첫 남북 정상 회담과 6·15 남북 공동 선언을 상징합니다.",examTip:"이산가족 상봉·교류 협력·연합제와 낮은 단계 연방제의 공통성을 연결하세요.",sourceUrl:official[30].url},
  {lessonId:30,name:"금 모으기 운동 금반지",role:"practice",type:"유물",file:"l30-practice-gold.webp",page:70,summary:"1997년 외환 위기 극복을 돕기 위해 시민이 자발적으로 내놓은 금을 상징합니다.",examTip:"1907년 국채 보상 운동과 시대와 대상 부채를 구별하세요.",sourceUrl:official[30].url},
  {lessonId:30,name:"남북 철도 연결",role:"practice",type:"유물",file:"l30-practice-rail-link.webp",page:70,summary:"남북 교류 확대 과정에서 추진된 경의선·동해선 철도 연결을 상징합니다.",examTip:"햇볕 정책·개성 공단·금강산 관광과 함께 남북 교류 사례로 정리하세요.",sourceUrl:official[30].url},
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

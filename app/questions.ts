export type Level=1|2|3|4;
export type Question={id:string;lessonId:number;level:Level;concept:string;page:string;noteUrl:string;prompt:string;choices:string[];answer:string;explanation:string;source:string;sourceUrl:string};
export type Lesson={id:number;title:string;shortTitle:string;videoUrl?:string;status:"ready"|"coming"};
type Fact={id:string;term:string;clue:string;scenario:string;advanced:string;page:string;ref:keyof typeof sources};

const sources={
  overview:{name:"국사편찬위원회 우리역사넷 - 우리 역사의 시작",url:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_h41_0030_0010&whereStr="},
  ancient:{name:"국사편찬위원회 우리역사넷 - 고대 사회의 발전",url:"https://contents.history.go.kr/front/ta/view.do?levelId=ta_h61_0040"},
  modern:{name:"국사편찬위원회 우리역사넷 - 개항과 국권 피탈",url:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_h62_0030&whereStr="},
  prehistory:{name:"국사편찬위원회 우리역사넷 - 선사 시대의 생활",url:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_m71_0020_0010_0040&whereStr="},
  metal:{name:"국사편찬위원회 우리역사넷 - 청동기·철기 비교",url:"https://contents.history.go.kr/eh_kk/teach/notebook/data/03_d14.htm"},
  states:{name:"국사편찬위원회 우리역사넷 - 초기 여러 나라",url:"https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m51_0030_0030"},
  terms:{name:"국사편찬위원회 우리역사넷 - 교과서 용어 해설",url:"https://contents.history.go.kr/mobile/tg/list.do?subjectCode=tg_age_10&tabId=01"},
  trade:{name:"국사편찬위원회 우리역사넷 - 고대의 금속 화폐",url:"https://contents.history.go.kr/front/km/print.do?levelId=km_008_0030_0010_0020&whereStr="},
};
const f=(row:[string,string,string,string,string,string,keyof typeof sources]):Fact=>({id:row[0],term:row[1],clue:row[2],scenario:row[3],advanced:row[4],page:row[5],ref:row[6]});

const history:Fact[]=[
  ["bcad","기원전과 기원후","기원전(B.C.)과 기원후(A.D.)는 역사 연표에서 사건의 시점을 나타내는 기준이다.","연표에서 B.C. 2333은 기원전의 사건, 1910은 기원후의 사건으로 표시되었다.","기원전은 기준점에 가까워질수록 숫자가 작아지고, 기원후는 시간이 흐를수록 숫자가 커진다.","PDF 2쪽","overview"],
  ["periodization","시대 구분","긴 역사를 특징과 변화에 따라 여러 시기로 나누어 이해하는 방법이다.","한 줄의 연표를 선사·고대·고려·조선·근현대로 나누어 표시했다.","시대 구분은 역사의 흐름을 파악하기 위한 틀이며 경계와 명칭은 관점에 따라 달라질 수 있다.","PDF 2쪽","overview"],
  ["prehistoric","선사 시대","문자로 된 기록보다 유물과 유적을 중심으로 생활 모습을 연구하는 시대이다.","도구와 집터를 살펴 당시 사람들의 생활을 추론했다.","구석기·신석기·청동기·철기 문화의 전개는 물질 자료를 통해 파악한다.","PDF 2쪽","overview"],
  ["ancient","고대","고조선과 여러 나라, 삼국과 남북국의 발전을 포괄하는 시대이다.","고조선 뒤에 고구려·백제·신라가 성장하고 통일 신라와 발해가 병존했다.","중앙 집권 국가와 고대 문화가 발전한 시기로 고려 시대보다 앞선다.","PDF 2쪽","ancient"],
  ["goryeo","고려 시대","고대 다음, 조선 이전에 놓이는 왕조의 시대이다.","연표에서 고대와 조선 사이에 약 500년에 가까운 구간이 표시되었다.","918년 건국되어 1392년 조선 건국 전까지 이어진 왕조의 시기이다.","PDF 2쪽","overview"],
  ["joseon","조선 시대","고려 다음에 이어지며 개항기 이전까지 전개된 왕조의 시대이다.","연표에서 고려 뒤 약 500년에 가까운 구간으로 나타났다.","1392년 건국되어 19세기 후반 개항을 맞기까지 이어진 전근대 왕조이다.","PDF 2쪽","overview"],
  ["opening","개항기","1876년 강화도 조약을 계기로 조선이 항구를 열고 근대적 변화가 진행된 시기이다.","연표에서 1876년을 전후해 근현대사의 새로운 구간이 시작되었다.","강화도 조약은 강압적으로 체결된 불평등 조약이며 부산·원산·제물포 개항으로 이어졌다.","PDF 2쪽","modern"],
  ["occupation","일제 강점기","1910년 국권 피탈부터 1945년 광복까지 일제의 식민 지배를 받은 시기이다.","연표에서 1910과 1945 사이가 별도 구간으로 표시되었다.","민족 운동과 독립운동이 국내외에서 전개된 식민 통치의 시기이다.","PDF 2쪽","modern"],
  ["contemporary","현대","1945년 광복 이후 오늘날까지 이어지는 시기이다.","연표에서 1945년 이후가 현재로 연결되었다.","광복 뒤 분단·정부 수립·전쟁·민주주의와 경제 발전 등이 전개되었다.","PDF 2쪽","modern"],
  ["premodern","전근대","필기에서 고대·고려·조선을 묶어 표시한 큰 시대 구분이다.","개항기 이전의 왕조 중심 역사를 하나의 큰 범위로 묶었다.","왕조 교체를 중심으로 고대에서 조선까지의 흐름을 파악하는 구분이다.","PDF 2쪽","overview"],
  ["modern-era","근현대","개항기·일제 강점기·현대를 이어서 살피는 큰 시대 구분이다.","1876·1910·1945를 주요 경계로 흐름을 정리했다.","개항 이후 현재까지 정치·경제·사회 구조가 크게 변화한 시기를 포괄한다.","PDF 2쪽","modern"],
  ["sequence1","전근대의 순서","고대 다음에 고려가, 고려 다음에 조선이 이어진다.","연표의 빈칸에 고대→고려→조선을 차례로 넣었다.","왕조와 시대의 선후 관계를 세우는 것은 변화의 원인과 결과를 이해하는 출발점이다.","PDF 2쪽","overview"],
  ["sequence2","근현대의 순서","개항기 다음 일제 강점기, 그다음 현대가 이어진다.","1876→1910→1945의 경계 연도를 시간순으로 배열했다.","개항·국권 피탈·광복은 각각 근현대사의 큰 전환점이다.","PDF 2쪽","modern"],
  ["three-kingdoms","삼국","고구려·백제·신라가 경쟁하며 발전한 고대 국가들이다.","고대의 흐름에서 세 나라가 중앙 집권 국가로 성장했다.","삼국은 주변 소국을 통합하고 국왕 중심의 체제를 발전시켰다.","PDF 2쪽","ancient"],
  ["north-south","남북국","통일 신라와 발해가 남과 북에서 함께 발전한 시기이다.","삼국 시대 뒤 남쪽의 신라와 북쪽의 발해가 병존했다.","발해의 성립으로 삼국 뒤 남북국의 형세가 전개되었다.","PDF 2쪽","ancient"],
  ["politics","정치 분야","왕·제도·외교처럼 국가 운영과 권력 관계를 다루는 역사 분야이다.","왕의 활동, 통치 제도, 주변 나라와의 관계를 한 묶음으로 정리했다.","정치는 통치 조직과 권력, 국내외 관계가 어떻게 운영되었는지를 살핀다.","PDF 2쪽","overview"],
  ["king","왕","전근대 정치사를 이해할 때 정책과 업적을 중심으로 살피는 통치자이다.","한 통치자가 어떤 제도를 만들고 어떤 외교 정책을 폈는지 조사했다.","왕의 개인 업적뿐 아니라 당시 제도와 사회 조건 속에서 정책을 이해해야 한다.","PDF 2쪽","overview"],
  ["institution","제도","국가와 사회를 일정하게 운영하기 위해 마련한 조직과 규칙이다.","중앙과 지방의 통치 조직, 관리 선발 방식을 살펴보았다.","제도의 변화는 왕권·지배층·백성 사이의 관계 변화를 보여 준다.","PDF 2쪽","overview"],
  ["diplomacy","외교","다른 나라와 맺은 교류·동맹·전쟁 등의 관계이다.","사신 교환과 조약, 외침에 대한 대응을 정치사의 일부로 분류했다.","외교는 국제 정세와 국내 정치에 서로 영향을 주고받는다.","PDF 2쪽","overview"],
  ["economy","경제 분야","세금·토지·교역처럼 생산과 분배, 재정 활동을 다루는 분야이다.","토지 제도와 세금 수취, 시장과 대외 교역을 한 묶음으로 정리했다.","경제 제도는 국가 재정과 백성의 생활에 직접 영향을 미친다.","PDF 2쪽","overview"],
  ["tax-land","세금과 토지","전근대 경제사를 이해하는 핵심 주제로 국가 재정과 농민 생활에 연결된다.","누가 토지를 소유하고 어떤 방식으로 세금을 냈는지 조사했다.","토지 제도와 수취 제도의 변화는 지배 관계와 농민 부담을 함께 보여 준다.","PDF 2쪽","overview"],
  ["trade","교역","지역이나 나라 사이에서 물품과 문화를 주고받는 경제 활동이다.","유물의 출토지를 비교해 먼 지역과 물건을 교환했음을 확인했다.","교역품과 이동 경로는 경제권과 문화 교류의 범위를 알려 준다.","PDF 2쪽","overview"],
  ["society","사회 분야","신분제와 사람들의 생활 모습, 집단 관계를 다루는 역사 분야이다.","법과 신분, 가족과 풍속, 일상생활을 한 묶음으로 정리했다.","사회사는 제도 아래에서 여러 계층이 실제로 어떻게 살았는지 보여 준다.","PDF 2쪽","overview"],
  ["artifact","유물","과거 사람이 만들거나 사용해 남긴 이동 가능한 물건이다.","토기·도구·무기 같은 물건을 통해 기술과 생활을 추론했다.","유물은 출토된 유적과 층위, 다른 자료와 함께 해석해야 의미가 분명해진다.","PDF 2쪽","overview"],
  ["site-flow","유적과 역사의 흐름","집터·무덤·성곽 같은 장소의 흔적과 유물을 시대 흐름 속에서 함께 해석한다.","유물과 유적을 정치·경제·사회·문화의 변화와 연결했다.","자료를 시대와 분야별로 연결하면 단편 암기가 아니라 역사적 흐름을 이해할 수 있다.","PDF 2쪽","overview"],
].map(row=>f(row as Parameters<typeof f>[0]));

const prehistory:Fact[]=[
  ["p-food","구석기 시대의 경제","사냥·채집·고기잡이로 자연에서 먹을거리를 얻었다.","식량 생산 없이 들짐승과 물고기, 열매에 의존했다.","자연환경과 먹을거리 변화에 따라 이동 생활을 하는 원인이 되었다.","PDF 3쪽","prehistory"],
  ["p-home","구석기 시대의 주거","동굴·바위 그늘·강가 막집 등을 임시 거처로 이용했다.","연천 전곡리와 공주 석장리 같은 유적에서 생활 흔적이 발견되었다.","영구 마을보다 이동에 알맞은 임시 거처가 중심이었다.","PDF 3쪽","prehistory"],
  ["p-tools","뗀석기","돌을 깨뜨리거나 떼어 날을 만든 구석기 시대의 도구이다.","주먹도끼와 슴베찌르개처럼 깨진 면을 이용한 도구가 나왔다.","초기에는 여러 용도의 큰 도구를, 후기에는 작고 정교한 도구를 만들었다.","PDF 3쪽","prehistory"],
  ["p-society","구석기 시대의 사회","무리를 이루고 공동으로 사냥하며 대체로 평등하게 생활했다.","큰 사냥감을 함께 잡아 구성원끼리 나누었다.","생산물 축적이 적어 뚜렷한 계급 분화가 나타나지 않은 공동체였다.","PDF 3쪽","prehistory"],
  ["p-belief","구석기 시대의 예술과 장례","동굴 벽화와 매장 흔적을 통해 주술과 사후 세계에 대한 생각을 추정한다.","죽은 이를 일정한 방식으로 묻고 사냥 동물을 그림으로 남겼다.","유물과 매장 상태는 당시의 정신세계와 공동체 의식을 보여 주는 자료이다.","PDF 3쪽","prehistory"],
  ["n-farming","신석기 혁명","농경과 목축을 시작해 식량을 직접 생산하게 된 변화이다.","조·피 등을 재배하고 가축을 기르기 시작했다.","생산 경제의 시작은 정착 생활과 인구 증가의 토대가 되었다.","PDF 3쪽","prehistory"],
  ["n-home","신석기 시대의 정착","강가와 바닷가에 움집을 짓고 마을을 이루었다.","서울 암사동과 부산 동삼동 같은 물가 유적에서 집터가 확인됐다.","원형 움집의 중앙 화덕과 저장 시설은 정착 생활을 보여 준다.","PDF 3쪽","prehistory"],
  ["n-pottery","신석기 시대의 토기","이른 시기의 덧무늬 토기와 대표적인 빗살무늬 토기를 사용했다.","식량을 저장하고 조리하기 위한 토기가 물가 유적에서 출토됐다.","토기의 제작과 사용은 정착·저장 생활의 발달과 관련된다.","PDF 3쪽","prehistory"],
  ["n-tools","간석기","돌을 갈아 날과 표면을 매끄럽게 만든 신석기 시대의 도구이다.","돌낫·돌괭이와 갈판·갈돌을 농경과 곡물 가공에 사용했다.","농경과 정착 생활에 필요한 용도별 도구가 발달했다.","PDF 3쪽","prehistory"],
  ["n-belief","신석기 시대의 신앙","애니미즘·토테미즘·샤머니즘처럼 자연과 영혼을 숭배했다.","태양과 자연물의 영혼, 집단을 지키는 동식물, 무당의 힘을 믿었다.","풍요와 안전을 기원한 믿음은 농경 공동체의 자연관을 보여 준다.","PDF 3쪽","prehistory"],
  ["bronze-class","청동기 시대의 계급","생산력 증가와 사유 재산으로 지배자와 피지배자가 나뉘었다.","큰 무덤과 청동 무기를 가진 군장이 등장했다.","잉여 생산물의 축적과 전쟁은 계급과 정치 권력의 성장을 촉진했다.","PDF 3~4쪽","metal"],
  ["bronze-home","청동기 시대의 주거","낮은 구릉에 직사각형 움집을 짓고 큰 취락을 이루었다.","배산임수 지역에 집과 창고, 공동 작업장이 모였다.","농경 발달과 인구 증가는 정착 마을의 규모를 키웠다.","PDF 3쪽","metal"],
  ["bronze-farm","청동기 시대의 농경","밭농사를 중심으로 일부 지역에서 벼농사를 지었다.","반달 돌칼로 곡식의 이삭을 거두고 민무늬 토기를 사용했다.","청동기는 주로 무기·의식용이었고 농사에는 다양한 간석기를 썼다.","PDF 3쪽","metal"],
  ["bronze-symbol","비파형 동검과 고인돌","고조선의 문화 범위와 지배층의 권력을 보여 주는 대표 자료이다.","거대한 무덤과 청동검이 넓은 지역에서 함께 확인됐다.","고인돌 축조에는 많은 노동력이 필요해 군장의 지배력을 보여 준다.","PDF 3~4쪽","metal"],
  ["dangun","단군 건국 이야기","고조선 건국과 당시 농경·계급·제정일치 사회의 모습을 반영한다.","환웅이 바람·비·구름을 다스리고 단군왕검이 나라를 세웠다.","단군은 제사장, 왕검은 정치 지배자의 성격을 보여 주며 홍익인간 이념이 나타난다.","PDF 4쪽","overview"],
  ["laws","범금 8조","고조선 사회의 생명·재산·노동력을 보호한 법률이다.","살인자는 사형, 상해는 곡식 배상, 절도자는 노비가 되었다.","사유 재산과 형벌, 노비가 존재한 계급 사회였음을 보여 준다.","PDF 4쪽","trade"],
  ["iron","철기 문화","철제 농기구와 무기로 생산력과 군사력이 크게 높아졌다.","단단한 보습과 낫으로 농사를 짓고 철제 무기로 전쟁했다.","철기 보급은 경제 기반 확대와 여러 정치 집단의 성장을 촉진했다.","PDF 4쪽","metal"],
  ["china-trade","중국과의 교류","명도전·반량전·오수전과 창원 다호리 붓으로 확인된다.","중국 화폐와 한자 사용의 흔적이 철기 시대 유적에서 발견됐다.","화폐와 붓은 원거리 교역과 문자 문화의 수용을 보여 준다.","PDF 4쪽","trade"],
  ["confederacy","연맹 왕국","왕이 존재하지만 여러 부족장이 자기 영역을 다스리며 권력을 나눈 국가 형태이다.","왕 아래 여러 가가 별도 지역을 다스리고 회의에 참여했다.","군장 국가보다 발전했지만 왕권이 부족장 세력을 완전히 누르지는 못했다.","PDF 4~5쪽","states"],
  ["buyeo","부여","왕 아래 마가·우가·저가·구가가 사출도를 다스리고 12월에 영고를 열었다.","가축 이름의 관리들이 영역을 다스리고 흉년에는 왕에게 책임을 물었다.","1책 12법과 순장·형사취수제 등이 있었던 연맹 왕국이다.","PDF 5쪽","states"],
  ["goguryeo","고구려","제가 회의에서 중요한 일을 정하고 10월에 동맹을 열었다.","산이 많고 땅이 척박해 정복 활동을 펼쳤으며 서옥제가 있었다.","왕과 5부 귀족이 권력을 나누고 제가 회의에 참여한 연맹 왕국이다.","PDF 5쪽","states"],
  ["okjeo","옥저","왕이 없고 읍군·삼로가 다스렸으며 민며느리제와 가족 공동 무덤이 있었다.","해산물이 풍부했지만 고구려에 소금과 어물 등을 바쳤다.","정치 발전이 늦고 고구려의 압력을 받은 군장 국가였다.","PDF 5쪽","terms"],
  ["dongye","동예","책화와 족외혼이 있었고 10월에 무천을 열었다.","다른 읍락을 침범하면 소·말·노비로 배상했다.","단궁·과하마·반어피가 특산물이고 읍군·삼로가 다스렸다.","PDF 5쪽","terms"],
  ["samhan","삼한","마한·진한·변한의 여러 소국이 연맹을 이루었다.","신지·읍차가 다스리고 5월과 10월에 계절제를 열었다.","벼농사와 두레가 발달했으며 변한의 철은 낙랑과 왜에 수출됐다.","PDF 5쪽","states"],
  ["sodo","천군과 소도","삼한에서 제사장이 신성 지역을 관리한 제정분리의 모습이다.","정치 지배자인 군장과 별도로 천군이 소도에서 제사를 주관했다.","소도에는 군장의 정치 권력이 미치기 어려워 종교 권력이 분리되어 있었다.","PDF 5쪽","terms"],
].map(row=>f(row as Parameters<typeof f>[0]));

const titles=["우리는 왜 역사를 공부하는가","선사 시대~여러 나라의 성장","고대(삼국)","고대(남북국 시대)","고대(경제·사회)","고대(문화1)","고대(문화2)","고려(정치)","고려(외교)","고려(경제·사회)","고려(문화1)","고려(문화2)","조선(전기 정치)","조선(후기 정치)","조선(경제)","조선(사회)","조선(전기 문화)","조선(후기 문화)","개항기(흥선 대원군)","개항기(개항~갑신정변)","개항기(동학 농민 운동~대한 제국)","개항기(국권 피탈과 저항)","개항기(문화)","일제 강점기(식민 통치)","일제 강점기(1910년대 저항)","일제 강점기(1920년대 저항)","일제 강점기(1930년대 이후 저항)","현대(광복~6·25 전쟁)","현대(민주주의의 발전)","현대(경제 발전과 통일 정책)"];
export const lessons:Lesson[]=titles.map((title,index)=>({id:index+1,title,shortTitle:title,status:"ready",videoUrl:index===0?"https://youtu.be/N_f97jxWZM8":index===1?"https://youtu.be/DBVMuINZtVo":undefined}));

function objectParticle(word:string){
  const code=word.charCodeAt(word.length-1);
  return code>=0xac00&&code<=0xd7a3&&(code-0xac00)%28!==0?"을":"를";
}
function noteUrl(page:string){
  const files:Record<string,string>={
    "PDF 2쪽":"/notes/pdf-2.pdf",
    "PDF 3쪽":"/notes/pdf-3.pdf",
    "PDF 4쪽":"/notes/pdf-4.pdf",
    "PDF 5쪽":"/notes/pdf-5.pdf",
    "PDF 3~4쪽":"/notes/pdf-3-4.pdf",
    "PDF 4~5쪽":"/notes/pdf-4-5.pdf",
  };
  return files[page];
}

// 같은 시대에 존재했거나 상위·하위 관계인 개념을 한 문제의 선택지로
// 함께 제시하면 둘 이상이 정답처럼 보일 수 있다. 아래 묶음 안의 개념은
// 서로 오답 선택지로 사용하지 않는다.
const ambiguityGroups=[
  ["periodization","premodern","modern-era","sequence1","sequence2"],
  ["prehistoric","artifact","site-flow"],
  ["ancient","three-kingdoms","north-south"],
  ["politics","king","institution","diplomacy"],
  ["economy","tax-land","trade"],
  ["n-farming","n-home","n-pottery","n-tools"],
  ["bronze-class","bronze-home","bronze-farm","bronze-symbol"],
  ["dangun","laws","bronze-symbol"],
  ["iron","china-trade","confederacy","buyeo","goguryeo","okjeo","dongye","samhan","sodo"],
  ["confederacy","buyeo","goguryeo","samhan"],
  ["samhan","sodo"],
];

const clarification:Record<string,string>={
  iron:"연맹 왕국은 철기 문화를 바탕으로 성장한 정치 형태이지만, 이 문장의 직접 단서는 철제 농기구와 철제 무기이다.",
  confederacy:"철기 문화는 여러 정치 집단 성장의 배경이고, 연맹 왕국은 왕과 부족장이 권력을 나누는 국가 형태이다.",
  politics:"왕·제도·외교는 정치 분야를 구성하는 세부 항목이다. 문제는 이 항목들을 함께 묶는 상위 분야를 묻는다.",
  economy:"세금·토지·교역은 경제 분야를 구성하는 세부 항목이다. 문제는 이 항목들을 함께 묶는 상위 분야를 묻는다.",
};

function safeWrongFacts(facts:Fact[],fact:Fact,index:number){
  const blocked=new Set([fact.id]);
  ambiguityGroups.filter(group=>group.includes(fact.id)).forEach(group=>group.forEach(id=>blocked.add(id)));
  const ordered=Array.from({length:facts.length-1},(_,offset)=>{
    const distance=Math.floor(offset/2)+1;
    const direction=offset%2===0?1:-1;
    return facts[(index+direction*distance+facts.length)%facts.length];
  });
  const safe=ordered.filter(candidate=>!blocked.has(candidate.id));
  return [...safe,...ordered.filter(candidate=>!safe.includes(candidate))].slice(0,3);
}

function build(lessonId:number,facts:Fact[]):Question[]{
  return facts.flatMap((fact,index)=>{
    const wrong=safeWrongFacts(facts,fact,index);
    const ref=sources[fact.ref];
    const common={lessonId,concept:fact.term,page:fact.page,noteUrl:noteUrl(fact.page),explanation:`${fact.clue} ${fact.advanced}${clarification[fact.id]?` ${clarification[fact.id]}`:""}`,source:`최태성 별별한국사 강의 필기 ${fact.page}`,sourceUrl:ref.url};
    return [
      {...common,id:`v4-${lessonId}-1-${fact.id}`,level:1 as const,prompt:`${fact.clue}\n\n위 문장이 직접 설명하는 핵심 개념은 무엇인가?`,choices:[fact.term,...wrong.map(x=>x.term)],answer:fact.term},
      {...common,id:`v4-${lessonId}-2-${fact.id}`,level:2 as const,prompt:`다음 중 ‘${fact.term}’ 자체에 대한 설명으로 강의 필기 내용과 일치하는 것은?`,choices:[fact.clue,...wrong.map(x=>x.clue)],answer:fact.clue},
      {...common,id:`v4-${lessonId}-3-${fact.id}`,level:3 as const,prompt:`[자료]\n${fact.scenario}\n\n위 자료의 핵심 단서가 직접 가리키는 개념은 무엇인가?`,choices:[fact.term,...wrong.map(x=>x.term)],answer:fact.term},
      {...common,id:`v4-${lessonId}-4-${fact.id}`,level:4 as const,prompt:`다음 중 ‘${fact.term}’${objectParticle(fact.term)} 직접 분석한 내용으로 가장 적절한 것은?`,choices:[fact.advanced,...wrong.map(x=>x.advanced)],answer:fact.advanced},
    ];
  });
}
import { extendedQuestions } from "./questions-3-10";
import { laterQuestions } from "./questions-11-15";
import { newestQuestions } from "./questions-16-20";
import { finalQuestions } from "./questions-21-30";
export const questionBank=[...build(1,history),...build(2,prehistory),...extendedQuestions,...laterQuestions,...newestQuestions,...finalQuestions];
export function validateQuestionBank(questions:Question[]=questionBank){
  const ids=new Set<string>();
  for(const question of questions){
    if(ids.has(question.id))throw new Error(`중복 문제 ID: ${question.id}`);
    ids.add(question.id);
    if(question.choices.length!==4||new Set(question.choices).size!==4)throw new Error(`보기는 서로 다른 4개여야 합니다: ${question.id}`);
    if(question.choices.filter(choice=>choice===question.answer).length!==1)throw new Error(`정답은 정확히 하나여야 합니다: ${question.id}`);
    if(!question.explanation||!question.noteUrl||!question.sourceUrl.startsWith("https://"))throw new Error(`출처 또는 해설 누락: ${question.id}`);
    const page=Number(question.page.match(/\d+/)?.[0]);
    const allowed:Record<number,number[]>={3:[6,7,8,9],4:[10,11],5:[12,13],6:[14,15],7:[16,17],8:[18,19,20,21],9:[22,23],10:[24,25],11:[26],12:[27,28,29],13:[30,31,32,33,34,35],14:[40,41],15:[36,37,42,43],16:[37,44],17:[38,39],18:[45,46],19:[47],20:[48,49],21:[50,51],22:[52],23:[53,54,55,56],24:[57],25:[58,59],26:[60,61],27:[62,63],28:[64,65],29:[66,67,68],30:[69,70]};
    if(allowed[question.lessonId]&&(!allowed[question.lessonId].includes(page)||question.noteUrl!==`/notes/pdf-${page}.pdf`))throw new Error(`PDF 페이지 범위 오류: ${question.id}`);
  }
  for(let lesson=3;lesson<=30;lesson++)if(questions.filter(question=>question.lessonId===lesson).length!==100)throw new Error(`${lesson}강은 정확히 100문항이어야 합니다.`);
  return true;
}
validateQuestionBank();
export const levelNames:Record<Level,string>={1:"새싹",2:"탐구자",3:"고수",4:"달인"};
export const levelDescriptions:Record<Level,string>={1:"핵심 용어와 개념",2:"개념과 설명 연결",3:"자료와 상황 적용",4:"비교·분석·함정 판단"};

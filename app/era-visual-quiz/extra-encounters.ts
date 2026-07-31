import { type Encounter } from "../encounters";

const prehistorySource="https://contents.history.go.kr/front/ta/print.do?levelId=ta_m71_0020_0010_0040&whereStr=";
const ancientCultureSource="https://contents.history.go.kr/front/ta/view.do?levelId=ta_m51_0060_0050";
const goryeoCultureSource="https://contents.history.go.kr/front/ta/view.do?levelId=ta_m51_0060_0050";
const joseonScienceSource="https://contents.history.go.kr/front/ta/view.do?levelId=ta_h31_0060_0020";
const openingSource="https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0050_0010";
const koreanEmpireSource="https://contents.history.go.kr/front/ta/print.do?levelId=ta_m62_0050_0030&whereStr=";
const modernCultureSource="https://contents.history.go.kr/data/pdf/eh/eh_r0336_0010.pdf";
const independenceSource="https://contents.history.go.kr/mobile/mid/ta_h71_0040_0050_0030_0040";
const governmentSource="https://contents.history.go.kr/front/ta/print.do?levelId=ta_m62_0080_0010&whereStr=";
const developmentSource="https://contents.history.go.kr/mobile/eh/view.do?code=ganada&levelId=eh_r0404_0010";

type ExtraEncounter=Omit<Encounter,"role"|"image"|"page"|"noteUrl"> & {
  file:string;
  pdfPage:number;
};

const extraEncounterData:ExtraEncounter[]=[
  {
    id:"visual-prehistory-spindle-whorl",lessonId:2,name:"가락바퀴",type:"유물",
    file:"spindle-whorl.webp",pdfPage:3,
    summary:"가락바퀴는 신석기 시대에 실을 뽑아 옷감이나 그물을 만드는 데 쓰인 도구입니다.",
    examTip:"신석기 시대의 원시적 수공업과 연결하고, 곡식을 가는 갈돌·갈판과 용도를 구별하세요.",
    sourceUrl:prehistorySource,
  },
  {
    id:"visual-prehistory-grinding-stones",lessonId:2,name:"갈돌과 갈판",type:"유물",
    file:"grinding-stones.webp",pdfPage:3,
    summary:"갈돌과 갈판은 신석기 시대에 채집하거나 재배한 곡식을 갈아 먹는 데 사용한 도구입니다.",
    examTip:"농경의 시작을 보여 주는 생활 도구이며 청동기 시대의 반달 돌칼과 쓰임이 다릅니다.",
    sourceUrl:prehistorySource,
  },
  {
    id:"visual-prehistory-semilunar-knife",lessonId:2,name:"반달 돌칼",type:"유물",
    file:"semilunar-stone-knife.webp",pdfPage:3,
    summary:"반달 돌칼은 청동기 시대에 곡식의 이삭을 따는 데 사용한 간석기입니다.",
    examTip:"청동기 시대의 벼농사와 연결하고, 신석기의 갈돌·갈판과 용도를 구별하세요.",
    sourceUrl:prehistorySource,
  },
  {
    id:"visual-prehistory-plain-pottery",lessonId:2,name:"민무늬 토기",type:"유물",
    file:"plain-pottery.webp",pdfPage:3,
    summary:"민무늬 토기는 표면에 뚜렷한 무늬가 없는 청동기 시대의 대표 토기입니다.",
    examTip:"신석기의 빗살무늬 토기와 시대와 겉모양을 비교하세요.",
    sourceUrl:prehistorySource,
  },
  {
    id:"visual-prehistory-slender-dagger",lessonId:2,name:"세형 동검",type:"유물",
    file:"slender-bronze-dagger.webp",pdfPage:3,
    summary:"세형 동검은 한반도에서 독자적으로 발전한 초기 철기 시대의 청동 무기입니다.",
    examTip:"청동기의 비파형 동검보다 칼날이 가늘며 한국식 동검이라고도 불립니다.",
    sourceUrl:prehistorySource,
  },
  {
    id:"visual-ancient-chungju-stele",lessonId:3,name:"충주 고구려비",type:"유물",
    file:"chungju-goguryeo-stele.webp",pdfPage:6,
    summary:"충주 고구려비는 고구려가 남한강 유역까지 진출했음을 보여 주는 국내 유일의 고구려 비석입니다.",
    examTip:"장수왕의 남진 정책과 연결하고 신라 진흥왕 순수비와 구별하세요.",
    sourceUrl:"https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=1113302050000&pageNo=1_1_2_0&pageNo__=5_2_1_0",
  },
  {
    id:"visual-ancient-jeongnimsa-pagoda",lessonId:6,name:"정림사지 오층석탑",type:"유적",
    file:"jeongnimsa-five-story-pagoda.webp",pdfPage:15,
    summary:"정림사지 오층석탑은 목탑의 구조를 돌로 표현한 백제 후기의 대표 석탑입니다.",
    examTip:"익산 미륵사지 석탑과 함께 백제 석탑으로 묶고 신라의 석가탑·다보탑과 구별하세요.",
    sourceUrl:"https://www.heritage.go.kr/heri/cul/culSelectDetail.do?assetnamel=&ccbaAsno=00090000&ccbaCpno=1113400090000&ccbaCtcd=34&ccbaKdcd=11&ccbaLcto=36&culPageNo=1&header=region&pageNo=1_1_3_0&returnUrl=%2Fheri%2Fcul%2FculSelectRegionList.do&s_ctcd=34&s_kdcd=",
  },
  {
    id:"visual-ancient-seongdeok-bell",lessonId:7,name:"성덕대왕신종",type:"유물",
    file:"seongdeok-bell.webp",pdfPage:16,
    summary:"성덕대왕신종은 통일 신라의 뛰어난 금속 공예 기술을 보여 주는 대형 범종입니다.",
    examTip:"에밀레종이라는 별칭과 비천상·용뉴의 특징을 함께 기억하세요.",
    sourceUrl:ancientCultureSource,
  },
  {
    id:"visual-goryeo-woljeongsa-pagoda",lessonId:12,name:"월정사 팔각 구층석탑",type:"유적",
    file:"woljeongsa-nine-story-pagoda.webp",pdfPage:27,
    summary:"월정사 팔각 구층석탑은 여러 층의 팔각 지붕돌과 길쭉한 비례가 특징인 고려 전기 석탑입니다.",
    examTip:"신라 석탑과 달리 고려에서는 지역성과 다각·다층 구조가 나타났습니다.",
    sourceUrl:"https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=1113200480000",
  },
  {
    id:"visual-goryeo-gyeongcheonsa-pagoda",lessonId:12,name:"경천사지 십층석탑",type:"유적",
    file:"gyeongcheonsa-ten-story-pagoda.webp",pdfPage:27,
    summary:"경천사지 십층석탑은 원의 영향을 받아 대리석으로 만든 고려 후기의 화려한 다층 석탑입니다.",
    examTip:"조선 시대 원각사지 십층석탑에 영향을 주었으며 재료와 층수를 함께 기억하세요.",
    sourceUrl:goryeoCultureSource,
  },
  {
    id:"visual-goryeo-bongjeongsa-hall",lessonId:12,name:"봉정사 극락전",type:"유적",
    file:"bongjeongsa-geungnakjeon.webp",pdfPage:28,
    summary:"봉정사 극락전은 주심포 양식을 사용한 고려 시대의 대표 목조 건축물입니다.",
    examTip:"부석사 무량수전·수덕사 대웅전과 함께 고려의 주심포 건축으로 정리하세요.",
    sourceUrl:goryeoCultureSource,
  },
  {
    id:"visual-joseon-angbuilgu",lessonId:17,name:"앙부일구",type:"유물",
    file:"angbuilgu.webp",pdfPage:39,
    summary:"앙부일구는 오목한 솥 모양의 해시계로 백성이 시간을 쉽게 알 수 있도록 제작되었습니다.",
    examTip:"비의 양을 재는 측우기, 자동 물시계인 자격루와 측정 대상을 구별하세요.",
    sourceUrl:joseonScienceSource,
  },
  {
    id:"visual-joseon-singijeon",lessonId:17,name:"신기전",type:"유물",
    file:"singijeon.webp",pdfPage:39,
    summary:"신기전은 화약의 힘으로 여러 발을 쏘아 보낸 조선 전기의 로켓형 화살입니다.",
    examTip:"화차에 여러 발을 장착해 사용했으며 고려 말 화통도감의 화포와 구별하세요.",
    sourceUrl:joseonScienceSource,
  },
  {
    id:"visual-joseon-suwon-hwaseong",lessonId:14,name:"수원 화성",type:"유적",
    file:"suwon-hwaseong.webp",pdfPage:40,
    summary:"수원 화성은 정조가 정치적·군사적 목적에서 건설하고 거중기 등 새로운 기술을 활용한 성곽입니다.",
    examTip:"정조·장용영·규장각과 연결하고 병자호란의 남한산성과 구별하세요.",
    sourceUrl:"https://contents.history.go.kr/front/ta/print.do?levelId=ta_h52_0030_0020&whereStr=",
  },
  {
    id:"visual-opening-anti-foreign-stele",lessonId:19,name:"척화비",type:"유물",
    file:"anti-foreign-stele.webp",pdfPage:47,
    summary:"척화비는 흥선 대원군이 서양과의 통상 수교 거부 의지를 알리기 위해 전국에 세운 비석입니다.",
    examTip:"병인양요·신미양요 뒤에 세워졌고 강화도 조약 체결 무렵 철거되었습니다.",
    sourceUrl:openingSource,
  },
  {
    id:"visual-opening-hwangudan",lessonId:21,name:"환구단",type:"유적",
    file:"hwangudan.webp",pdfPage:51,
    summary:"환구단은 고종이 대한 제국 황제로 즉위하며 하늘에 제사를 올리기 위해 마련한 제단입니다.",
    examTip:"대한 제국 선포·광무개혁·황제권 강화와 연결하세요.",
    sourceUrl:koreanEmpireSource,
  },
  {
    id:"visual-opening-hanseong-tram",lessonId:23,name:"한성 전차",type:"유물",
    file:"hanseong-tram.webp",pdfPage:55,
    summary:"한성 전차는 대한 제국 시기 서울에 도입되어 서대문과 청량리 등을 오간 근대 교통수단입니다.",
    examTip:"경인선 철도와 시기를 비교하고 광무개혁기의 근대 시설 확충과 연결하세요.",
    sourceUrl:koreanEmpireSource,
  },
  {
    id:"visual-occupation-korean-products",lessonId:26,name:"물산 장려 운동 국산품",type:"유물",
    file:"korean-products-goods.webp",pdfPage:60,
    summary:"물산 장려 운동 국산품은 1920년대 조선 사람이 만든 물건을 사용해 민족 경제를 키우려 한 운동을 상징합니다.",
    examTip:"평양에서 시작되었으며 사회주의 세력은 계급 문제를 외면한다고 비판했습니다.",
    sourceUrl:modernCultureSource,
  },
  {
    id:"visual-occupation-arirang-film",lessonId:26,name:"영화 아리랑 필름",type:"유물",
    file:"arirang-film-reel.webp",pdfPage:61,
    summary:"영화 아리랑 필름은 나운규가 제작한 무성 영화와 일제강점기 민족 문화 수호를 상징합니다.",
    examTip:"1926년 나운규의 작품으로 식민지 현실에 대한 저항 의식을 담았습니다.",
    sourceUrl:modernCultureSource,
  },
  {
    id:"visual-occupation-sohn-medal",lessonId:27,name:"손기정 베를린 올림픽 금메달",type:"유물",
    file:"sohn-keechung-medal.webp",pdfPage:62,
    summary:"손기정 베를린 올림픽 금메달은 1936년 마라톤 우승과 일장기 말소 사건을 함께 떠올리게 하는 유물입니다.",
    examTip:"동아일보는 시상식 사진에서 일장기를 지워 정간 처분을 받았습니다.",
    sourceUrl:independenceSource,
  },
  {
    id:"visual-modern-constitution",lessonId:28,name:"제헌 헌법",type:"유물",
    file:"constitution-1948.webp",pdfPage:65,
    summary:"제헌 헌법은 5·10 총선거로 구성된 제헌 국회가 1948년에 제정한 대한민국 최초의 헌법입니다.",
    examTip:"5·10 총선거-제헌 국회-제헌 헌법-정부 수립의 순서를 잡으세요.",
    sourceUrl:governmentSource,
  },
  {
    id:"visual-modern-gyeongbu-monument",lessonId:30,name:"경부고속도로 준공기념탑",type:"유적",
    file:"gyeongbu-monument.webp",pdfPage:69,
    summary:"경부고속도로 준공기념탑은 1970년 서울과 부산을 잇는 고속국도의 완공을 기념한 시설입니다.",
    examTip:"박정희 정부의 경제 개발 5개년 계획과 사회 기반 시설 확충에 연결하세요.",
    sourceUrl:developmentSource,
  },
  {
    id:"visual-modern-south-north-agreement",lessonId:30,name:"남북 기본 합의서",type:"유물",
    file:"south-north-agreement.webp",pdfPage:70,
    summary:"남북 기본 합의서는 1991년 남북이 화해·불가침·교류와 협력의 원칙에 합의한 문서입니다.",
    examTip:"노태우 정부 때 채택되었고 남북 관계를 잠정적 특수 관계로 규정했습니다.",
    sourceUrl:developmentSource,
  },
];

export const visualQuizExtras:Encounter[]=extraEncounterData.map(item=>({
  id:item.id,
  lessonId:item.lessonId,
  role:"practice",
  name:item.name,
  type:item.type,
  image:`/era-visual-quiz/${item.file}`,
  page:`PDF ${item.pdfPage}쪽`,
  noteUrl:`/notes/pdf-${item.pdfPage}.pdf`,
  summary:item.summary,
  examTip:item.examTip,
  sourceUrl:item.sourceUrl,
}));

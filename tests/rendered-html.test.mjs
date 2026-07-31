import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root=new URL("../",import.meta.url);
const read=path=>readFile(new URL(path,root),"utf8");

test("lessons 3-30 expose exactly 100 structurally unique questions each",async()=>{
  const [early,later,newest,final]=await Promise.all([read("app/questions-3-10.ts"),read("app/questions-11-15.ts"),read("app/questions-16-20.ts"),read("app/questions-21-30.ts")]);
  for(let lesson=3;lesson<=10;lesson++){
    const block=early.match(new RegExp(` ${lesson}:\\{pages:\\[[^\\]]+\\],facts:\\[([\\s\\S]*?)\\n \\]\\},`));
    assert.ok(block,`${lesson}강 데이터가 있어야 합니다.`);
    const facts=[...block[1].matchAll(/^  \["([^"]+)","([^"]+)"\],$/gm)];
    assert.equal(facts.length,20,`${lesson}강은 20개 사실 × 5개 유형이어야 합니다.`);
    assert.equal(new Set(facts.map(match=>match[1])).size,20,`${lesson}강 개념은 중복되면 안 됩니다.`);
  }
  for(let lesson=11;lesson<=15;lesson++){
    const block=later.match(new RegExp(`  ${lesson}:\\[([\\s\\S]*?)\\n  \\],`));
    assert.ok(block,`${lesson}강 데이터가 있어야 합니다.`);
    const facts=[...block[1].matchAll(/^    \["([^"]+)","([^"]+)","([^"]+)",(\d+)\],$/gm)];
    assert.equal(facts.length,20,`${lesson}강은 20개 사실 × 5개 유형이어야 합니다.`);
    assert.equal(new Set(facts.map(match=>match[1])).size,20,`${lesson}강 개념은 중복되면 안 됩니다.`);
  }
  for(let lesson=16;lesson<=20;lesson++){
    const block=newest.match(new RegExp(`  ${lesson}:\\[([\\s\\S]*?)\\n  \\],`));
    assert.ok(block,`${lesson}강 데이터가 있어야 합니다.`);
    const facts=[...block[1].matchAll(/^    \["([^"]+)","([^"]+)","([^"]+)",(\d+)\],$/gm)];
    assert.equal(facts.length,20,`${lesson}강은 20개 사실 × 5개 유형이어야 합니다.`);
    assert.equal(new Set(facts.map(match=>match[1])).size,20,`${lesson}강 개념은 중복되면 안 됩니다.`);
  }
  for(let lesson=21;lesson<=30;lesson++){
    const block=final.match(new RegExp(`  ${lesson}:\\[([\\s\\S]*?)\\n  \\],`));
    assert.ok(block,`${lesson} lesson data is required`);
    const facts=[...block[1].matchAll(/^    \["([^"]+)","([^"]+)","([^"]+)",(\d+)\],$/gm)];
    assert.equal(facts.length,20,`${lesson} must have 20 facts`);
    assert.equal(new Set(facts.map(match=>match[1])).size,20,`${lesson} concepts must be unique`);
  }
  assert.match(early,/flatMap\(\(\[term,clue\],index\)=>/);
  assert.match(later,/flatMap\(\(\[term,clue,distinction,page\],index\)=>/);
  assert.match(later,/id:`l\$\{lessonId\}-q\$\{index\+1\}-[a-e]`/);
  assert.match(newest,/flatMap\(\(\[term,clue,distinction,page\],index\)=>/);
  assert.match(newest,/id:`l\$\{lessonId\}-q\$\{index\+1\}-[a-e]`/);
  assert.match(final,/flatMap\(\(\[term,clue,distinction,page\],index\)=>/);
  assert.match(final,/id:`l\$\{lessonId\}-q\$\{index\+1\}-[a-e]`/);
});

test("question validator enforces unique IDs, four choices, one answer and exact sources",async()=>{
  const source=await read("app/questions.ts");
  assert.match(source,/new Set\(question\.choices\)\.size!==4/);
  assert.match(source,/filter\(choice=>choice===question\.answer\)\.length!==1/);
  assert.match(source,/questions\.filter\(question=>question\.lessonId===lesson\)\.length!==100/);
  assert.match(source,/question\.noteUrl!==`\/notes\/pdf-\$\{page\}\.pdf`/);
  assert.match(source,/"modern-era","contemporary"/);
  assert.match(source,/상위·하위 또는 중복 정답 가능성이 있는 보기/);
  assert.match(source,/validateQuestionBank\(\);/);
});

test("all lesson encounters and their local assets are connected",async()=>{
  const source=await read("app/encounters.ts");
  for(let lesson=3;lesson<=10;lesson++){
    const line=source.split("\n").find(value=>value.startsWith(`  ${lesson}:{page:`));
    assert.ok(line,`${lesson}강 조우 데이터가 있어야 합니다.`);
    const files=[...line.matchAll(/"(l\d+-(?:boss|practice)-[^" ]+\.(?:webp|svg))"/g)].map(match=>match[1]);
    assert.equal(files.length,5,`${lesson}강에는 보스 3개와 연습 상대 2개가 있어야 합니다.`);
    await Promise.all(files.map(file=>access(new URL(`public/encounters/${file}`,root))));
  }
  for(let lesson=11;lesson<=30;lesson++){
    const files=[...source.matchAll(new RegExp(`lessonId:${lesson},[^\\n]+file:"(l${lesson}-(?:boss|practice)-[^"]+\\.webp)"`,"g"))].map(match=>match[1]);
    assert.equal(files.length,5,`${lesson}강에는 보스 3개와 연습 상대 2개가 있어야 합니다.`);
    await Promise.all(files.map(file=>access(new URL(`public/encounters/${file}`,root))));
  }
});

test("game and account ranking use Firestore-backed thirty-lesson persistence",async()=>{
  const [game,api,store]=await Promise.all([read("app/GameQuizApp.tsx"),read("app/api/leaderboard/route.ts"),read("lib/progress/firestore.ts")]);
  assert.match(game,/Array\.from\(\{length:30\}/);
  assert.match(game,/progressWrite\(progress\)/);
  assert.match(game,/bossHp=Math\.max\(0,100-correctCount\*10\)/);
  assert.match(game,/await saveProgress\(progress\)/);
  assert.match(game,/className="title-picker"/);
  assert.match(api,/progressRepository\(\)/);
  assert.match(store,/class FirestoreProgressRepository/);
  assert.doesNotMatch(store,/orderBy\("updatedAt"/);
});

test("gamification unifies the 150 lesson entries and 23 visual-only entries",async()=>{
  const [collection,rewards,visual]=await Promise.all([read("app/collection-data.ts"),read("lib/gamification.ts"),read("app/era-visual-quiz/EraVisualQuiz.tsx")]);
  assert.match(collection,/COLLECTION_TOTAL=collectionEncounters\.length/);
  assert.match(collection,/VISUAL_COLLECTION_TOTAL=visualOnlyCollectionEncounters\.length/);
  assert.match(rewards,/lessonMasterXp:200/);
  assert.match(rewards,/visualGoldPerCorrect:5/);
  assert.match(rewards,/visualPerfectXp:50/);
  assert.match(visual,/visualDiscoveryXp/);
  assert.match(visual,/visualPerfectEras/);
});

test("completed lessons have a prominent mastery state",async()=>{
  const [game,styles]=await Promise.all([read("app/GameQuizApp.tsx"),read("app/ui-refresh.css")]);
  assert.match(game,/달인 완료 · 보스 3\/3/);
  assert.match(game,/lesson-status \$\{done===3\?"is-complete"/);
  assert.match(game,/달인 완료, 보스 3명 모두 처치/);
  assert.match(styles,/\.lessons button\.complete\{border:2px solid var\(--green\)/);
  assert.match(styles,/\.lesson-status\.is-complete/);
  assert.match(styles,/\.lesson-card-icon/);
});

test("lesson 11-30 source-note PDFs open as individual pages",async()=>{
  const pages=Array.from({length:45},(_,index)=>index+26);
  await Promise.all(pages.map(page=>access(new URL(`public/notes/pdf-${page}.pdf`,root))));
});

test("signed-out root offers Google and anonymous sessions while signed-in users see the game",async()=>{
  const [client,button,session,loginScreen,home,game]=await Promise.all([
    read("app/firebase-client.ts"),
    read("app/FirebaseAuthButton.tsx"),
    read("app/api/auth/session/route.ts"),
    read("app/LoginScreen.tsx"),
    read("app/page.tsx"),
    read("app/GameQuizApp.tsx"),
  ]);
  assert.match(client,/signInWithPopup\(auth\(\),provider\)/);
  assert.match(client,/firebaseSignInAnonymously\(auth\(\)/);
  assert.match(client,/process\.env\.NEXT_PUBLIC_FIREBASE_API_KEY\|\|/);
  assert.match(loginScreen,/FirebaseAuthButton authenticated=\{false\}/);
  assert.match(button,/data-testid="google-login"/);
  assert.match(button,/Google로 로그인/);
  assert.match(button,/data-testid="anonymous-login"/);
  assert.match(button,/익명으로 시작/);
  assert.match(home,/if\(!user\)return <LoginScreen\/>/);
  assert.match(home,/return <GameQuizApp/);
  assert.match(session,/createSessionCookie\(idToken/);
  assert.match(game,/FirebaseAuthButton authenticated firebaseUser=\{firebaseUser\} anonymousUser=\{anonymousUser\}/);
});

test("/og-game redirects to the single root login entry point",async()=>{
  const loginPage=await read("app/og-game/page.tsx");
  assert.match(loginPage,/redirect\("\/"\)/);
  assert.doesNotMatch(loginPage,/FirebaseAuthButton|game-login-card/);
});

test("Firebase setup and provider failures remain visible and actionable",async()=>{
  const [client,button]=await Promise.all([read("app/firebase-client.ts"),read("app/FirebaseAuthButton.tsx")]);
  assert.match(client,/validateFirebaseConfig/);
  assert.match(client,/NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\|\|"hischoi\.firebasestorage\.app"/);
  assert.match(client,/NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\|\|"141461201243"/);
  assert.match(client,/unauthorized-domain/);
  assert.match(client,/operation-not-allowed/);
  assert.match(client,/popup-blocked/);
  assert.match(client,/admin-restricted-operation/);
  assert.match(button,/firebaseConfigurationError&&<p className="auth-error" role="alert">/);
  assert.match(button,/disabled=\{busy!==null\|\|!firebaseClientConfigured\}/);
});

test("production metadata falls back to the current Vercel address",async()=>{
  const layout=await read("app/layout.tsx");
  assert.match(layout,/process\.env\.NEXT_PUBLIC_SITE_URL/);
  assert.match(layout,/https:\/\/hischoi\.vercel\.app/);
});

test("era visual quiz adds note-based art and mixes one cross-era distractor",async()=>{
  const [quiz,extras,game,component,page]=await Promise.all([read("app/era-visual-quiz/quiz-data.ts"),read("app/era-visual-quiz/extra-encounters.ts"),read("app/GameQuizApp.tsx"),read("app/era-visual-quiz/EraVisualQuiz.tsx"),read("app/era-visual-quiz/page.tsx")]);
  assert.equal([...quiz.matchAll(/\{id:"(?:prehistory|ancient|goryeo|joseon|opening|occupation|modern)"/g)].length,7);
  assert.equal([...extras.matchAll(/id:"visual-(?:prehistory|ancient|goryeo|joseon|opening|occupation|modern)-/g)].length,23);
  assert.match(extras,/image:`\/era-visual-quiz\/\$\{item\.file\}`/);
  assert.match(extras,/noteUrl:`\/notes\/pdf-\$\{item\.pdfPage\}\.pdf`/);
  assert.match(quiz,/item\.type!=="역사 자료"/);
  assert.match(quiz,/\.slice\(0,2\)/);
  assert.match(quiz,/const outsideEra=/);
  assert.match(quiz,/adjacentLessons\.has\(item\.lessonId\)/);
  assert.match(quiz,/slice\(0,3\)/);
  assert.match(quiz,/choices:shuffle\(\[answer\.name,\.\.\.distractors\.map/);
  assert.match(quiz,/split\(item\.name\)\.join\("이 대상"\)/);
  assert.match(component,/그림 속 \{current\.encounter\.type\}의 이름은 무엇일까요/);
  assert.match(component,/시대별 그림 퀴즈/);
  assert.match(game,/href="\/era-visual-quiz"/);
  assert.match(page,/if\(!user\)redirect\("\/"\)/);
});

test("lesson 3-10 visual clues describe concrete deeds and features",async()=>{
  const [encounters,quiz]=await Promise.all([read("app/encounters.ts"),read("app/era-visual-quiz/quiz-data.ts")]);
  const block=encounters.match(/const detailedEncounterContent:[\s\S]*?=\{([\s\S]*?)\n\};\n\nconst extendedEncounters/);
  assert.ok(block,"3~10강 상세 단서 목록이 있어야 합니다.");
  const entries=[...block[1].matchAll(/^  "([^"]+)":\{summary:"([^"]+)",examTip:"([^"]+)"\},$/gm)];
  assert.equal(entries.length,40,"3~10강의 인물·유물·유적 40개에 고유 단서가 있어야 합니다.");
  const people=["광개토 대왕","근초고왕","진흥왕","장수왕","성왕","문무왕","신문왕","대조영","장보고","발해 무왕","태조 왕건","광종","성종","서희","강감찬","공민왕"];
  const summaries=new Map(entries.map(([,name,summary])=>[name,summary]));
  for(const name of people){
    assert.ok(summaries.has(name),`${name}의 업적 단서가 있어야 합니다.`);
    assert.doesNotMatch(summaries.get(name),/강의 핵심|시대적 맥락/,`${name}에 공통 설명을 사용하면 안 됩니다.`);
  }
  assert.doesNotMatch(encounters,/강의 핵심 \$\{type\}/);
  assert.match(encounters,/if\(!content\)throw new Error/);
  assert.match(quiz,/\^이 대상\(\?:은\|는\|이\|가\)/);
});

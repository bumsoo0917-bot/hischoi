import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root=new URL("../",import.meta.url);
const read=path=>readFile(new URL(path,root),"utf8");

test("lessons 3-10 expose exactly 100 structurally unique questions each",async()=>{
  const source=await read("app/questions-3-10.ts");
  for(let lesson=3;lesson<=10;lesson++){
    const block=source.match(new RegExp(` ${lesson}:\\{pages:\\[[^\\]]+\\],facts:\\[([\\s\\S]*?)\\n \\]\\},`));
    assert.ok(block,`${lesson}강 데이터가 있어야 합니다.`);
    const facts=[...block[1].matchAll(/^  \["([^"]+)","([^"]+)"\],$/gm)];
    assert.equal(facts.length,20,`${lesson}강은 20개 사실 × 5개 유형이어야 합니다.`);
    assert.equal(new Set(facts.map(match=>match[1])).size,20,`${lesson}강 개념은 중복되면 안 됩니다.`);
  }
  assert.match(source,/flatMap\(\(\[term,clue\],index\)=>/);
  assert.match(source,/id:`l\$\{lessonId\}-q\$\{index\+1\}-[a-e]`/);
});

test("question validator enforces unique IDs, four choices, one answer and exact sources",async()=>{
  const source=await read("app/questions.ts");
  assert.match(source,/new Set\(question\.choices\)\.size!==4/);
  assert.match(source,/filter\(choice=>choice===question\.answer\)\.length!==1/);
  assert.match(source,/questions\.filter\(question=>question\.lessonId===lesson\)\.length!==100/);
  assert.match(source,/question\.noteUrl!==`\/notes\/pdf-\$\{page\}\.pdf`/);
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
});

test("game and account ranking use Firestore-backed ten-lesson persistence",async()=>{
  const [game,api,store]=await Promise.all([read("app/GameQuizApp.tsx"),read("app/api/leaderboard/route.ts"),read("lib/progress/firestore.ts")]);
  assert.match(game,/Array\.from\(\{length:10\}/);
  assert.match(game,/attempts:progress\.attempts/);
  assert.match(api,/progressRepository\(\)/);
  assert.match(store,/class FirestoreProgressRepository/);
});

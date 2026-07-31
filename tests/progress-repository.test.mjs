import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {createRequire} from "node:module";

const nativeRequire=createRequire(import.meta.url);
async function loadModule(path,imports={}){
  const source=await readFile(new URL(`../${path}`,import.meta.url),"utf8");
  const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const sandboxModule={exports:{}};
  const localRequire=id=>id in imports?imports[id]:nativeRequire(id);
  vm.runInNewContext(`(function(require,module,exports,structuredClone){${js}\n})(localRequire,sandboxModule,sandboxModule.exports,structuredClone)`,{sandboxModule,structuredClone,localRequire});
  return sandboxModule.exports;
}

async function modules(){
  const types=await loadModule("lib/progress/types.ts");
  const gamification=await loadModule("lib/gamification.ts");
  const collectionData={
    collectionEncounters:[{id:"l1-map",role:"practice",lessonId:1},{id:"visual-prehistory-test",role:"practice",lessonId:1}],
    COLLECTION_TOTAL:2,
    VISUAL_COLLECTION_TOTAL:1,
    visualOnlyEncounterIds:new Set(["visual-prehistory-test"]),
  };
  const validation=await loadModule("lib/progress/validation.ts",{"../../app/collection-data":collectionData,"../gamification":gamification,"./types":types});
  const memory=await loadModule("lib/progress/memory.ts",{"./validation":validation,"./types":types,"../gamification":gamification});
  return {validation,memory,gamification};
}

test("memory repository persists verified rewards and a boss entry fee",async()=>{
  const {memory:{MemoryProgressRepository},gamification}=await modules();
  const repository=new MemoryProgressRepository();
  await repository.ensure("u1","도전자");
  const practice=await repository.saveVerified("u1","도전자",{
    currentGold:50,totalGold:50,xp:25,rewardVersion:gamification.REWARD_VERSION,visualCorrect:0,
    selectedTitle:gamification.BASE_TITLE,defeated:{},collection:{"l1-map":true},attempts:{"practice-1-1":1},perfectBosses:{},visualPerfectEras:{},
  });
  assert.equal(practice.currentGold,50);
  assert.equal(practice.xp,25);
  const paid=await repository.saveVerified("u1","도전자",{
    currentGold:20,totalGold:50,xp:25,rewardVersion:gamification.REWARD_VERSION,visualCorrect:0,
    selectedTitle:gamification.BASE_TITLE,defeated:{},collection:practice.collection,attempts:practice.attempts,perfectBosses:{},visualPerfectEras:{},
  });
  assert.equal(paid.currentGold,20);
});

test("server transition validation rejects fabricated rewards",async()=>{
  const {validation,gamification}=await modules();
  const input={currentGold:0,totalGold:0,xp:0,rewardVersion:gamification.REWARD_VERSION,visualCorrect:0,selectedTitle:gamification.BASE_TITLE,defeated:{},collection:{},attempts:{},perfectBosses:{},visualPerfectEras:{}};
  const before={userId:"u",displayName:"u",...input,...validation.derived(input),updatedAt:0};
  assert.throws(()=>validation.verifyTransition(before,{...input,currentGold:5000,totalGold:5000}));
});

test("visual quiz rewards include discovery XP and remain server-verifiable",async()=>{
  const {validation,gamification}=await modules();
  const input={currentGold:0,totalGold:0,xp:0,rewardVersion:gamification.REWARD_VERSION,visualCorrect:0,selectedTitle:gamification.BASE_TITLE,defeated:{},collection:{},attempts:{},perfectBosses:{},visualPerfectEras:{}};
  const before={userId:"u",displayName:"u",...input,...validation.derived(input),updatedAt:0};
  const after={...input,currentGold:5,totalGold:5,xp:16,visualCorrect:1,collection:{"visual-prehistory-test":true},attempts:{"visual-prehistory":1}};
  assert.doesNotThrow(()=>validation.verifyTransition(before,after));
});

import { encounters, type Encounter } from "./encounters";
import { visualQuizExtras } from "./era-visual-quiz/extra-encounters";

export const lessonCollectionEncounters=encounters;
export const visualOnlyCollectionEncounters=visualQuizExtras;
export const collectionEncounters:Encounter[]=[...new Map(
  [...lessonCollectionEncounters,...visualOnlyCollectionEncounters].map(item=>[item.id,item]),
).values()];

export const LESSON_COLLECTION_TOTAL=lessonCollectionEncounters.length;
export const VISUAL_COLLECTION_TOTAL=visualOnlyCollectionEncounters.length;
export const COLLECTION_TOTAL=collectionEncounters.length;
export const visualOnlyEncounterIds=new Set(visualOnlyCollectionEncounters.map(item=>item.id));

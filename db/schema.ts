import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const playerProgress = sqliteTable("player_progress", {
  email: text("email").primaryKey(),
  displayName: text("display_name").notNull(),
  currentGold: integer("current_gold").notNull().default(0),
  totalGold: integer("total_gold").notNull().default(0),
  bossesDefeated: integer("bosses_defeated").notNull().default(0),
  lesson1Bosses: integer("lesson_1_bosses").notNull().default(0),
  lesson2Bosses: integer("lesson_2_bosses").notNull().default(0),
  defeatedJson: text("defeated_json").notNull().default("{}"),
  collectionJson: text("collection_json").notNull().default("{}"),
  updatedAt: integer("updated_at").notNull(),
});

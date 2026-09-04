import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const passkeyChallenges = sqliteTable("passkey_challenges", {
	id: text("id").primaryKey(),
	userId: text("user_id"),
	challenge: text("challenge").notNull(),
	expiresAt: integer("expires_at").notNull(),
	createdAt: integer("created_at").notNull(),
});

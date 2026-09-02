import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
	id: text("id").primaryKey(),

	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),

	tokenHash: text("token_hash").notNull().unique(),

	expiresAt: integer("expires_at").notNull(),

	createdAt: integer("created_at").notNull(),
});

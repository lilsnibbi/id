import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const passkeys = sqliteTable("passkeys", {
	id: text("id").primaryKey(),

	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),

	credentialId: text("credential_id").notNull().unique(),

	publicKey: text("public_key").notNull(),

	counter: integer("counter").notNull().default(0),

	transports: text("transports"),

	name: text("name"),

	createdAt: integer("created_at").notNull(),

	lastUsedAt: integer("last_used_at"),
});

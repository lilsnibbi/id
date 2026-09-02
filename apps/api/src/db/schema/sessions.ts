import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),

	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),

	tokenHash: text("token_hash").notNull().unique(),

	ipAddress: text("ip_address"),

	country: text("country"),

	city: text("city"),

	region: text("region"),

	userAgent: text("user_agent"),

	browser: text("browser"),

	os: text("os"),

	expiresAt: integer("expires_at").notNull(),

	createdAt: integer("created_at").notNull(),

	lastUsedAt: integer("last_used_at"),
});

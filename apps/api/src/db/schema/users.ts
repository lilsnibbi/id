import { sql } from "drizzle-orm";
import {
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
	"users",
	{
		id: text("id").primaryKey(),

		email: text("email").notNull().unique(),

		passwordHash: text("password_hash").notNull(),

		displayName: text("display_name"),

		emailVerifiedAt: integer("email_verified_at"),

		isAdmin: integer("is_admin", {
			mode: "boolean",
		})
			.notNull()
			.default(false),

		disabledAt: integer("disabled_at"),

		createdAt: integer("created_at").notNull(),

		updatedAt: integer("updated_at").notNull(),

		profileImageKey: text("profile_image_key"),
	},
	(table) => [
		uniqueIndex("users_single_admin_idx")
			.on(table.isAdmin)
			.where(sql`${table.isAdmin} = 1`),
	],
);

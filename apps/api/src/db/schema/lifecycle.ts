import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

import { users } from "./users";

export const lifecycleActions = sqliteTable(
	"lifecycle_actions",
	{
		id: text("id").primaryKey(),

		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
			}),

		action: text("action").notNull(),

		executeAt: integer("execute_at").notNull(),

		status: text("status").notNull().default("pending"),

		createdAt: integer("created_at").notNull(),
		updatedAt: integer("updated_at").notNull(),

		executedAt: integer("executed_at"),
		cancelledAt: integer("cancelled_at"),

		error: text("error"),
	},
	(table) => [
		index("lifecycle_actions_pending_idx").on(table.status, table.executeAt),
		index("lifecycle_actions_user_idx").on(table.userId),
	],
);

import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { createDb } from "./../../db";
import { lifecycleActions, users } from "./../../db/schema";
import { requireAdmin } from "./../../middleware/auth";

/**
 * Controls the actions allowed by the lifecycle endpoint, guard it with your life soldier
 */
const LIFECYCLE_ACTIONS = ["enable", "disable"] as const;
type LifecycleAction = (typeof LIFECYCLE_ACTIONS)[number];

const lifecycleRoute = new Hono<{
	Bindings: Env;
}>();

lifecycleRoute.post("/users/:userId/lifecycle", requireAdmin, async (c) => {
	const userId = c.req.param("userId");

	if (!userId) {
		return c.json(
			{
				error: "user_not_found",
			},
			404,
		);
	}

	const body = await c.req.json<{
		action: string;
		executeAt: number;
	}>();

	if (!LIFECYCLE_ACTIONS.includes(body.action as LifecycleAction)) {
		return c.json(
			{
				error: "invalid_action",
			},
			400,
		);
	}

	if (
		typeof body.executeAt !== "number" ||
		!Number.isFinite(body.executeAt) ||
		body.executeAt <= Date.now() + 60000
	)
		return c.json(
			{
				error: "invalid_execute_at",
			},
			400,
		);

	const db = createDb(c.env.DB);

	const user = await db
		.select({
			id: users.id,
		})
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (!user[0]) {
		return c.json(
			{
				error: "user_not_found",
			},
			404,
		);
	}

	const now = Date.now();
	const id = crypto.randomUUID();

	await db.insert(lifecycleActions).values({
		id,
		userId,
		action: body.action,
		executeAt: body.executeAt,
		status: "pending",
		createdAt: now,
		updatedAt: now,
	});

	return c.json(
		{
			id,
			userId,
			action: body.action,
			executeAt: body.executeAt,
			status: "pending",
			createdAt: now,
			updatedAt: now,
		},
		201,
	);
});

export default lifecycleRoute;

export const LIFECYCLE_ACTIONS = ["enable", "disable"] as const;

export type LifecycleAction = (typeof LIFECYCLE_ACTIONS)[number];

export const LIFECYCLE_STATUSES = [
	"pending",
	"processing",
	"completed",
	"cancelled",
	"failed",
] as const;

export type LifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];

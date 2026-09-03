import type { MiddlewareHandler } from "hono";

/**
 * Creates middleware that applies a Cloudflare Worker rate limit.
 *
 * The key determines which requests share the same rate-limit bucket.
 *
 * @param getKey Returns the rate-limit key for the request.
 * @returns Hono middleware that rejects requests exceeding the configured limit.
 */
export function rateLimit(
	getKey: (c: Parameters<MiddlewareHandler>[0]) => string,
): MiddlewareHandler {
	return async (c, next) => {
		const result = await c.env.AUTH_RATE_LIMITER.limit({
			key: getKey(c),
		});

		if (!result.success) {
			return c.json(
				{
					error: "rate_limit_exceeded",
				},
				429,
			);
		}

		await next();
	};
}

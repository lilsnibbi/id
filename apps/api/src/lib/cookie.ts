import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

const SESSION_COOKIE = "session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function setSessionCookie(
	c: Context,
	token: string,
	maxAge = SESSION_MAX_AGE,
) {
	setCookie(c, SESSION_COOKIE, token, {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		path: "/",
		maxAge,
	});
}

export function clearSessionCookie(c: Context) {
	deleteCookie(c, SESSION_COOKIE, {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		path: "/",
	});
}

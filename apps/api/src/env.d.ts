import type { ApiEnv } from "../../../alchemy/api";

declare global {
	type Env = ApiEnv;
}

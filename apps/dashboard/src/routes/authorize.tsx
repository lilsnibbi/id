import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getOAuthClientDetails, api } from "@/lib/api";

export interface AuthorizeSearch {
	client_id?: string;
	redirect_uri?: string;
	response_type?: string;
	scope?: string;
	state?: string;
	code_challenge?: string;
	code_challenge_method?: string;
	nonce?: string;
}

interface OAuthClientDetails {
	client_id: string;
	name: string;
}

export const Route = createFileRoute("/authorize")({
	validateSearch: (search: Record<string, unknown>): AuthorizeSearch => ({
		client_id:
			typeof search.client_id === "string" ? search.client_id : undefined,
		redirect_uri:
			typeof search.redirect_uri === "string"
				? search.redirect_uri
				: undefined,
		response_type:
			typeof search.response_type === "string"
				? search.response_type
				: undefined,
		scope: typeof search.scope === "string" ? search.scope : undefined,
		state: typeof search.state === "string" ? search.state : undefined,
		code_challenge:
			typeof search.code_challenge === "string"
				? search.code_challenge
				: undefined,
		code_challenge_method:
			typeof search.code_challenge_method === "string"
				? search.code_challenge_method
				: undefined,
		nonce: typeof search.nonce === "string" ? search.nonce : undefined,
	}),
	component: AuthorizePage,
});

function AuthorizePage() {
	const search = Route.useSearch();

	console.log("AUTHORIZE SEARCH:", window.location.search);
	console.log(
		"AUTHORIZE PARAMS:",
		Object.fromEntries(new URLSearchParams(window.location.search)),
	);

	const [loading, setLoading] = useState(false);
	const [loadingClient, setLoadingClient] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [client, setClient] = useState<OAuthClientDetails | null>(null);

	const scopes: string[] = search.scope?.split(" ").filter(Boolean) ?? [];

	const missing =
		!search.client_id ||
		!search.redirect_uri ||
		!search.response_type ||
		!search.scope;

	useEffect(() => {
		if (!search.client_id) {
			setLoadingClient(false);
			return;
		}

		void getOAuthClientDetails(search.client_id)
			.then(setClient)
			.catch((error) => {
				setError(
					error instanceof Error
						? error.message
						: "Unable to load application information.",
				);
			})
			.finally(() => {
				setLoadingClient(false);
			});
	}, [search.client_id]);

	function handleDeny() {
		if (!search.redirect_uri) {
			window.location.href = "/";
			return;
		}

		const url = new URL(search.redirect_uri);

		url.searchParams.set("error", "access_denied");

		if (search.state) {
			url.searchParams.set("state", search.state);
		}

		window.location.href = url.toString();
	}

	async function handleApprove() {
		if (missing) {
			setError("Invalid authorization request.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await api<{ redirect_uri: string }>(
				"/oauth/approve",
				{
					method: "POST",
					body: JSON.stringify({
						client_id: search.client_id,
						redirect_uri: search.redirect_uri,
						response_type: search.response_type,
						scope: search.scope,
						state: search.state,
						code_challenge: search.code_challenge,
						code_challenge_method: search.code_challenge_method,
						nonce: search.nonce,
					}),
				},
			);

			window.location.href = response.redirect_uri;
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Unable to authorize application.",
			);
			setLoading(false);
		}
	}

	if (missing) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
				<div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
					<h1 className="text-lg font-semibold text-white">
						Invalid authorization request
					</h1>

					<p className="mt-2 text-sm text-zinc-500">
						The authorization request is missing required
						parameters.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
			<div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
				<div className="text-center">
					<p className="text-sm font-medium text-zinc-500">Maze ID</p>

					<h1 className="mt-3 text-xl font-semibold text-white">
						{loadingClient
							? "Loading application..."
							: (client?.name ?? "Unknown application")}
					</h1>

					<p className="mt-2 text-sm text-zinc-400">
						wants to access your Maze ID account.
					</p>
				</div>

				<div className="mt-6">
					<p className="text-sm font-medium text-zinc-300">
						Requested permissions
					</p>

					<div className="mt-3 space-y-2">
						{scopes.map((scope) => (
							<div
								key={scope}
								className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400"
							>
								{scope}
							</div>
						))}
					</div>
				</div>

				{error && (
					<div className="mt-5 rounded-md border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-300">
						{error}
					</div>
				)}

				<div className="mt-6 grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={handleDeny}
						disabled={loading}
						className="rounded-md border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
					>
						Deny
					</button>

					<button
						type="button"
						onClick={() => void handleApprove()}
						disabled={loading || loadingClient || !client}
						className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
					>
						{loading ? "Authorizing..." : "Authorize"}
					</button>
				</div>
			</div>
		</div>
	);
}

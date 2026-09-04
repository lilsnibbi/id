import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { bootstrapAdmin } from "@/lib/api";

export const Route = createFileRoute("/_dashboard/bootstrap")({
	staticData: {
		navigation: {
			label: "Bootstrap",
			order: 30,
			hidden: true,
		},
	},
	component: BootstrapPage,
});

function BootstrapPage() {
	const [secret, setSecret] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setLoading(true);
		setMessage(null);

		try {
			await bootstrapAdmin(secret);
			setSecret("");
			setMessage("Admin bootstrap successful.");
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Bootstrap failed.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<h1 className="text-xl font-semibold text-white">Bootstrap</h1>

			<form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
				<input
					type="password"
					value={secret}
					onChange={(event) => setSecret(event.target.value)}
					placeholder="Bootstrap secret"
					required
					className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
				/>

				<button
					type="submit"
					disabled={loading}
					className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-50"
				>
					{loading ? "Sending..." : "Bootstrap"}
				</button>

				{message && <p className="text-sm text-zinc-400">{message}</p>}
			</form>
		</div>
	);
}

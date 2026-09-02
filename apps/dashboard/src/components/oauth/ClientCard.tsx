import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type { OAuthClient } from "@/lib/api";

interface ClientCardProps {
	client: OAuthClient;
	onEdit: () => void;
}

export default function ClientCard({ client, onEdit }: ClientCardProps) {
	return (
		<Card className="p-5">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<div className="flex items-center gap-3">
						<h2 className="font-medium text-white">{client.name}</h2>

						<span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400">
							{client.clientType}
						</span>
					</div>

					<p className="mt-2 break-all font-mono text-xs text-zinc-500">
						{client.id}
					</p>
				</div>

				<Button variant="secondary" onClick={onEdit}>
					Edit
				</Button>
			</div>

			<div className="mt-5 grid gap-5 sm:grid-cols-2">
				<div>
					<p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
						Redirect URIs
					</p>

					<div className="mt-2 space-y-1">
						{client.redirectUris.map((uri) => (
							<p key={uri} className="break-all text-sm text-zinc-400">
								{uri}
							</p>
						))}
					</div>
				</div>

				<div>
					<p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
						Scopes
					</p>

					<div className="mt-2 flex flex-wrap gap-2">
						{client.scopes.map((scope) => (
							<span
								key={scope}
								className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400"
							>
								{scope}
							</span>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
}

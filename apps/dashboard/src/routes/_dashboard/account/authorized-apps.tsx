import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/components/toast/ToastProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

import { getOAuthGrants, revokeOAuthGrant, type OAuthGrant } from "@/lib/api";

export const Route = createFileRoute("/_dashboard/account/authorized-apps")({
	staticData: {
		navigation: {
			label: "Authorized Apps",
			order: 30,
		},
	},
	component: AuthorizedAppsPage,
});

function AuthorizedAppsPage() {
	const toast = useToast();

	const [grants, setGrants] = useState<OAuthGrant[]>([]);
	const [loading, setLoading] = useState(true);
	const [revoking, setRevoking] = useState<string | null>(null);

	const loadGrants = useCallback(async () => {
		try {
			const response = await getOAuthGrants();
			setGrants(response.grants);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to load authorized apps.",
			);
		} finally {
			setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		void loadGrants();
	}, [loadGrants]);

	async function handleRevoke(clientId: string) {
		setRevoking(clientId);

		try {
			await revokeOAuthGrant(clientId);

			setGrants((current) =>
				current.filter((grant) => grant.clientId !== clientId),
			);

			toast.success("App access revoked.");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to revoke app access.",
			);
		} finally {
			setRevoking(null);
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center py-12">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<div>
			<div>
				<h1 className="text-xl font-semibold text-white">
					Authorized Apps
				</h1>

				<p className="mt-1 text-sm text-zinc-500">
					Manage applications that have access to your Maze ID
					account.
				</p>
			</div>

			{grants.length === 0 ? (
				<Card className="mt-6 p-6">
					<p className="text-sm text-zinc-500">
						You have not authorized any applications.
					</p>
				</Card>
			) : (
				<div className="mt-6 space-y-4">
					{grants.map((grant) => (
						<Card key={grant.clientId} className="p-5">
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<h2 className="font-medium text-white">
										{grant.clientName}
									</h2>

									<p className="mt-1 break-all font-mono text-xs text-zinc-600">
										{grant.clientId}
									</p>
								</div>

								<Button
									variant="secondary"
									disabled={revoking === grant.clientId}
									onClick={() =>
										void handleRevoke(grant.clientId)
									}
								>
									{revoking === grant.clientId
										? "Revoking..."
										: "Revoke"}
								</Button>
							</div>

							<div className="mt-5">
								<p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
									Permissions
								</p>

								<div className="mt-2 flex flex-wrap gap-2">
									{grant.scopes.map((scope) => (
										<span
											key={scope}
											className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400"
										>
											{scope}
										</span>
									))}
								</div>
							</div>

							<p className="mt-4 text-xs text-zinc-600">
								Authorized{" "}
								{new Date(grant.grantedAt).toLocaleDateString()}
							</p>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

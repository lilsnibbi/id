import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/components/toast/ToastProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { deletePasskey, getPasskeys, type Passkey } from "@/lib/api";

export const Route = createFileRoute("/_dashboard/account/passkeys")({
	staticData: {
		navigation: {
			label: "Passkeys",
			order: 20,
		},
	},
	component: PasskeysPage,
});

function PasskeysPage() {
	const toast = useToast();

	const [passkeys, setPasskeys] = useState<Passkey[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [passkeyToDelete, setPasskeyToDelete] = useState<Passkey | null>(
		null,
	);

	const loadPasskeys = useCallback(async () => {
		try {
			const response = await getPasskeys();
			setPasskeys(response.passkeys);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to load passkeys.",
			);
		} finally {
			setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		void loadPasskeys();
	}, [loadPasskeys]);

	async function handleDelete() {
		if (!passkeyToDelete) {
			return;
		}

		const id = passkeyToDelete.id;

		setDeleting(id);

		try {
			await deletePasskey(id);

			setPasskeys((current) =>
				current.filter((passkey) => passkey.id !== id),
			);

			setPasskeyToDelete(null);
			toast.success("Passkey removed.");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to remove passkey.",
			);
		} finally {
			setDeleting(null);
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
				<h1 className="text-xl font-semibold text-white">Passkeys</h1>

				<p className="mt-1 text-sm text-zinc-500">
					Manage the passkeys you use to sign in to your Maze ID
					account.
				</p>
			</div>

			{passkeys.length === 0 ? (
				<Card className="mt-6 p-6">
					<p className="text-sm text-zinc-500">
						You have not registered any passkeys.
					</p>
				</Card>
			) : (
				<div className="mt-6 space-y-4">
					{passkeys.map((passkey) => (
						<Card key={passkey.id} className="p-5">
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<h2 className="font-medium text-white">
										{passkey.name ?? "Unnamed passkey"}
									</h2>

									<p className="mt-1 break-all font-mono text-xs text-zinc-600">
										{passkey.id}
									</p>
								</div>

								<Button
									variant="secondary"
									disabled={deleting === passkey.id}
									onClick={() => setPasskeyToDelete(passkey)}
								>
									Remove
								</Button>
							</div>

							<div className="mt-5">
								<p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
									Created
								</p>

								<p className="mt-2 text-sm text-zinc-400">
									{new Date(
										passkey.createdAt,
									).toLocaleDateString()}
								</p>
							</div>

							<div className="mt-4">
								<p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
									Last used
								</p>

								<p className="mt-2 text-sm text-zinc-400">
									{passkey.lastUsedAt
										? new Date(
												passkey.lastUsedAt,
											).toLocaleDateString()
										: "Never"}
								</p>
							</div>
						</Card>
					))}
				</div>
			)}

			<Modal
				open={passkeyToDelete !== null}
				title="Remove passkey"
				description="Are you sure you want to remove this passkey? You will no longer be able to use it to sign in to your Maze ID account."
				onClose={() => {
					if (!deleting) {
						setPasskeyToDelete(null);
					}
				}}
			>
				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="ghost"
						disabled={deleting !== null}
						onClick={() => setPasskeyToDelete(null)}
					>
						Cancel
					</Button>

					<Button
						type="button"
						variant="secondary"
						disabled={deleting !== null}
						onClick={() => void handleDelete()}
					>
						{deleting !== null ? "Removing..." : "Remove passkey"}
					</Button>
				</div>
			</Modal>
		</div>
	);
}

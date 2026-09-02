import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useToast } from "@/components/toast/ToastProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { getOAuthClients, type OAuthClient } from "@/lib/api";

import ClientCard from "@/components/oauth/ClientCard";
import ClientModal from "@/components/oauth/ClientModal";

export const Route = createFileRoute("/_dashboard/admin/clients")({
	staticData: {
		navigation: {
			label: "Clients",
			order: 5,
		},
	},
	component: ClientsPage,
});

function ClientsPage() {
	const toast = useToast();
	const [clients, setClients] = useState<OAuthClient[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingClient, setEditingClient] = useState<OAuthClient | null>(null);

	const loadClients = useCallback(async () => {
		try {
			const response = await getOAuthClients();
			setClients(response.clients);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to load OAuth clients.",
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [toast]);

	useEffect(() => {
		void loadClients();
	}, [loadClients]);

	function openCreate() {
		setEditingClient(null);
		setModalOpen(true);
	}

	function openEdit(client: OAuthClient) {
		setEditingClient(client);
		setModalOpen(true);
	}

	function closeModal() {
		setModalOpen(false);
		setEditingClient(null);
	}

	async function handleSaved() {
		closeModal();
		await loadClients();
	}

	if (loading) {
		return (
			<div className="flex justify-center py-16">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-xl font-semibold text-white">OAuth clients</h1>
						<p className="mt-1 text-sm text-zinc-500">
							Manage applications that can authenticate users with Maze ID.
						</p>
					</div>

					<div className="flex shrink-0 gap-2">
						<Button
							variant="secondary"
							disabled={refreshing}
							onClick={() => {
								setRefreshing(true);
								void loadClients();
							}}
						>
							{refreshing ? "Refreshing..." : "Refresh"}
						</Button>

						<Button onClick={openCreate}>Create client</Button>
					</div>
				</div>

				{clients.length === 0 ? (
					<Card className="p-8 text-center">
						<h2 className="text-sm font-medium text-white">No OAuth clients</h2>
						<p className="mt-2 text-sm text-zinc-500">
							Create a client to connect an application to Maze ID.
						</p>
						<Button className="mt-5" onClick={openCreate}>
							Create client
						</Button>
					</Card>
				) : (
					<div className="space-y-3">
						{clients.map((client) => (
							<ClientCard
								key={client.id}
								client={client}
								onEdit={() => openEdit(client)}
							/>
						))}
					</div>
				)}
			</div>

			<ClientModal
				open={modalOpen}
				client={editingClient}
				onClose={closeModal}
				onSaved={handleSaved}
			/>
		</>
	);
}

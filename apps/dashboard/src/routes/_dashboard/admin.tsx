import { createFileRoute, Outlet } from "@tanstack/react-router";

import AdminGuard from "@/components/auth/AdminGuard";

export const Route = createFileRoute("/_dashboard/admin")({
	staticData: {
		navigation: {
			label: "Admin",
			order: 30,
		},
	},
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<AdminGuard>
			<Outlet />
		</AdminGuard>
	);
}

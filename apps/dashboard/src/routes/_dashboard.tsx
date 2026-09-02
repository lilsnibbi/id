import { createFileRoute } from "@tanstack/react-router";

import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/layouts/DashboardLayout";

export const Route = createFileRoute("/_dashboard")({
	component: ProtectedDashboard,
});

function ProtectedDashboard() {
	return (
		<AuthGuard>
			<DashboardLayout />
		</AuthGuard>
	);
}

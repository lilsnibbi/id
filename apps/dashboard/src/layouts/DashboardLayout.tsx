import { Outlet } from "@tanstack/react-router";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardLayout() {
	const { user } = useAuth();

	if (!user) {
		return null;
	}

	return (
		<div className="flex min-h-screen bg-zinc-950 text-white">
			<Sidebar isAdmin={user.isAdmin} />

			<div className="min-w-0 flex-1">
				<Header />

				<main>
					<div className="mx-auto max-w-6xl px-8 py-8">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}

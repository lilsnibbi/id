import { Outlet } from "@tanstack/react-router";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout() {
	return (
		<div className="flex min-h-screen bg-zinc-950 text-white">
			<Sidebar />

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

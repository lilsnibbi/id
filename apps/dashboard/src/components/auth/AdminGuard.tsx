import type { ReactNode } from "react";

import { useAuth } from "./AuthProvider";
import Spinner from "@/components/ui/Spinner";

interface AdminGuardProps {
	children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!user?.isAdmin) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
				<div className="text-center">
					<h1 className="text-xl font-semibold text-white">Access denied</h1>
					<p className="mt-2 text-sm text-zinc-500">
						You do not have permission to access this area.
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

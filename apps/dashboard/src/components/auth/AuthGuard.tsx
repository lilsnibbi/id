import type { ReactNode } from "react";
import { useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import Spinner from "@/components/ui/Spinner";

import { useAuth } from "./AuthProvider";

interface AuthGuardProps {
	children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !user) {
			navigate({
				to: "/login",
				replace: true,
			});
		}
	}, [loading, user, navigate]);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}

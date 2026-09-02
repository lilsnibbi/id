import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { type AuthUser, logout as apiLogout, getCurrentUser } from "@/lib/api";

export interface AuthContextValue {
	user: AuthUser | null;
	loading: boolean;
	refresh: () => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(async () => {
		try {
			const response = await getCurrentUser();
			setUser(response.user);
		} catch {
			setUser(null);
		}
	}, []);

	const logout = useCallback(async () => {
		try {
			await apiLogout();
		} finally {
			setUser(null);
		}
	}, []);

	useEffect(() => {
		refresh().finally(() => {
			setLoading(false);
		});
	}, [refresh]);

	const value = useMemo(
		() => ({
			user,
			loading,
			refresh,
			logout,
		}),
		[user, loading, refresh, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}

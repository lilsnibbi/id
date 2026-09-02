import { useAuth } from "@/components/auth/AuthProvider";

export default function Header() {
	const { user, logout } = useAuth();

	return (
		<header className="flex h-16 items-center justify-between border-b border-zinc-800 px-8">
			<div>
				<h1 className="text-sm font-medium text-zinc-400">Dashboard</h1>
			</div>

			<div className="flex items-center gap-4">
				<span className="text-sm text-zinc-300">{user?.email}</span>

				<button
					type="button"
					onClick={() => void logout()}
					className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
				>
					Log out
				</button>
			</div>
		</header>
	);
}

import { useAuth } from "@/components/auth/AuthProvider";
import Button from "@/components/ui/Button";

export default function Header() {
	const { user, logout } = useAuth();

	return (
		<header className="flex h-16 items-center justify-end px-6 sm:px-8">
			<div className="flex items-center gap-3">
				<span className="hidden text-sm text-zinc-500 sm:block">
					{user?.email}
				</span>

				<Button
					type="button"
					variant="danger"
					onClick={() => void logout()}
				>
					Log out
				</Button>
			</div>
		</header>
	);
}

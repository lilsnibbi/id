import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/account/")({
	component: AccountPage,
});

function AccountPage() {
	return (
		<div>
			<h1 className="text-2xl font-semibold">Account</h1>

			<p className="mt-2 text-sm text-zinc-400">
				Manage your account settings.
			</p>
		</div>
	);
}

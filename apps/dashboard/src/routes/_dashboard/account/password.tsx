import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/account/password")({
	staticData: {
		navigation: {
			label: "Password",
			order: 2,
		},
	},
	component: PasswordPage,
});

function PasswordPage() {
	return (
		<div>
			<h2 className="text-lg font-medium">Password</h2>
			<p className="mt-2 text-sm text-zinc-400">
				Change your account password.
			</p>
		</div>
	);
}

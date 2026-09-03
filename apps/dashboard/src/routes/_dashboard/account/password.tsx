import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";

import { useToast } from "@/components/toast/ToastProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { changePassword } from "@/lib/api";

export const Route = createFileRoute("/_dashboard/account/password")({
	staticData: {
		navigation: {
			label: "Password",
			order: 2,
		},
	},
	component: ChangePasswordPage,
});

function ChangePasswordPage() {
	const toast = useToast();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [saving, setSaving] = useState(false);

	const passwordsMatch = newPassword === confirmPassword;

	const isValid =
		currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch;

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!isValid) {
			return;
		}

		setSaving(true);

		try {
			await changePassword(currentPassword, newPassword);

			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");

			toast.success("Password changed successfully.");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to change your password.",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="max-w-3xl">
			<div className="mb-8">
				<h1 className="text-2xl font-semibold tracking-tight text-white">
					Password
				</h1>

				<p className="mt-1 text-sm text-zinc-500">
					Update the password you use to sign in to Maze ID.
				</p>
			</div>

			<Card className="overflow-hidden p-0">
				<form onSubmit={handleSubmit}>
					<div className="px-6 py-6">
						<div className="mb-6">
							<h2 className="text-sm font-medium text-white">
								Change password
							</h2>

							<p className="mt-1 text-sm text-zinc-500">
								Choose a new password for your account.
							</p>
						</div>

						<div className="space-y-5">
							<div>
								<label
									htmlFor="current-password"
									className="mb-2 block text-sm font-medium text-zinc-300"
								>
									Current password
								</label>

								<Input
									id="current-password"
									type="password"
									autoComplete="current-password"
									value={currentPassword}
									onChange={(event) =>
										setCurrentPassword(event.target.value)
									}
									disabled={saving}
								/>
							</div>

							<div>
								<label
									htmlFor="new-password"
									className="mb-2 block text-sm font-medium text-zinc-300"
								>
									New password
								</label>

								<Input
									id="new-password"
									type="password"
									autoComplete="new-password"
									value={newPassword}
									onChange={(event) =>
										setNewPassword(event.target.value)
									}
									disabled={saving}
								/>

								<p className="mt-2 text-xs text-zinc-600">
									Password must be at least 8 characters.
								</p>
							</div>

							<div>
								<label
									htmlFor="confirm-password"
									className="mb-2 block text-sm font-medium text-zinc-300"
								>
									Confirm new password
								</label>

								<Input
									id="confirm-password"
									type="password"
									autoComplete="new-password"
									value={confirmPassword}
									onChange={(event) =>
										setConfirmPassword(event.target.value)
									}
									disabled={saving}
								/>

								{confirmPassword && !passwordsMatch && (
									<p className="mt-2 text-xs text-red-400">
										Passwords do not match.
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950/40 px-6 py-4">
						<p className="text-xs text-zinc-600">
							You will be signed out of your other sessions.
						</p>

						<Button type="submit" disabled={!isValid || saving}>
							{saving ? "Changing..." : "Change password"}
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}

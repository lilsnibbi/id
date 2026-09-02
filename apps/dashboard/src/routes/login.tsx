import { startAuthentication } from "@simplewebauthn/browser";

import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";

import { useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/toast/ToastProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";

import { getPasskeyLoginOptions, login, verifyPasskeyLogin } from "@/lib/api";

interface LoginSearch {
	return_to?: string;
}

export const Route = createFileRoute("/login")({
	validateSearch: (search: Record<string, unknown>): LoginSearch => ({
		return_to:
			typeof search.return_to === "string" ? search.return_to : undefined,
	}),
	component: LoginPage,
});

function getSafeReturnTo(value: string | undefined) {
	if (!value?.startsWith("/") || value.startsWith("//")) {
		return null;
	}

	return value;
}

function LoginPage() {
	const { user, loading, refresh } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();
	const search = Route.useSearch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [passkeyEmail, setPasskeyEmail] = useState("");
	const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [passkeySubmitting, setPasskeySubmitting] = useState(false);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950">
				<Spinner size="lg" />
			</div>
		);
	}

	if (user) {
		return <Navigate to="/" />;
	}

	const busy = submitting || passkeySubmitting;

	async function handleLogin(
		event: Parameters<
			NonNullable<React.ComponentProps<"form">["onSubmit"]>
		>[0],
	) {
		event.preventDefault();
		setSubmitting(true);

		try {
			await login(email, password, rememberMe);
			await refresh();

			const returnTo = getSafeReturnTo(search.return_to);

			if (returnTo) {
				window.location.href = returnTo;
				return;
			}

			await navigate({ to: "/" });
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to sign in.",
			);
		} finally {
			setSubmitting(false);
		}
	}

	async function handlePasskeyLogin(
		event: Parameters<
			NonNullable<React.ComponentProps<"form">["onSubmit"]>
		>[0],
	) {
		event.preventDefault();
		setPasskeySubmitting(true);

		try {
			const options = await getPasskeyLoginOptions(passkeyEmail);

			const response = await startAuthentication({
				optionsJSON: options,
			});

			await verifyPasskeyLogin(passkeyEmail, response);
			await refresh();

			setPasskeyModalOpen(false);

			const returnTo = getSafeReturnTo(search.return_to);

			if (returnTo) {
				window.location.href = returnTo;
				return;
			}

			await navigate({ to: "/" });
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to sign in with your passkey.",
			);
		} finally {
			setPasskeySubmitting(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
			<Card className="w-full max-w-md p-8">
				<div className="mb-8">
					<h1 className="text-2xl font-semibold">Sign in</h1>

					<p className="mt-2 text-sm text-zinc-400">
						Sign in to Maze ID.
					</p>
				</div>

				<form
					onSubmit={(event) => {
						void handleLogin(event);
					}}
					className="space-y-5"
				>
					<div>
						<label
							htmlFor="email"
							className="mb-2 block text-sm font-medium text-zinc-300"
						>
							Email
						</label>

						<Input
							id="email"
							name="email"
							type="email"
							autoComplete="username"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							disabled={busy}
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-2 block text-sm font-medium text-zinc-300"
						>
							Password
						</label>

						<Input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
							disabled={busy}
						/>
					</div>

					<label className="flex items-center gap-2 text-sm text-zinc-400">
						<input
							type="checkbox"
							checked={rememberMe}
							onChange={(event) =>
								setRememberMe(event.target.checked)
							}
							disabled={busy}
						/>
						Remember me
					</label>

					<Button type="submit" disabled={busy} className="w-full">
						{submitting ? "Signing in..." : "Sign in"}
					</Button>
				</form>

				<div className="my-6 flex items-center gap-3">
					<div className="h-px flex-1 bg-zinc-800" />
					<span className="text-xs text-zinc-500">OR</span>
					<div className="h-px flex-1 bg-zinc-800" />
				</div>

				<Button
					type="button"
					variant="secondary"
					disabled={busy}
					onClick={() => {
						setPasskeyEmail(email);
						setPasskeyModalOpen(true);
					}}
					className="w-full"
				>
					Sign in with passkey
				</Button>
			</Card>

			<Modal
				open={passkeyModalOpen}
				title="Sign in with passkey"
				description="Enter the email address associated with your passkey."
				onClose={() => setPasskeyModalOpen(false)}
			>
				<form
					onSubmit={(event) => {
						void handlePasskeyLogin(event);
					}}
					className="space-y-5"
				>
					<div>
						<label
							htmlFor="passkey-email"
							className="mb-2 block text-sm font-medium text-zinc-300"
						>
							Email
						</label>

						<Input
							id="passkey-email"
							name="passkey-email"
							type="email"
							autoComplete="username"
							required
							autoFocus
							value={passkeyEmail}
							onChange={(event) =>
								setPasskeyEmail(event.target.value)
							}
							disabled={passkeySubmitting}
						/>
					</div>

					<div className="flex justify-end gap-3">
						<Button
							type="button"
							variant="ghost"
							disabled={passkeySubmitting}
							onClick={() => setPasskeyModalOpen(false)}
						>
							Cancel
						</Button>

						<Button type="submit" disabled={passkeySubmitting}>
							{passkeySubmitting
								? "Authenticating..."
								: "Continue"}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}

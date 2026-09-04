import type { ReactNode } from "react";

interface PreAuthLayoutProps {
	children: ReactNode;
}

export default function PreAuthLayout({ children }: PreAuthLayoutProps) {
	return (
		<div className="min-h-screen bg-zinc-950 text-white">
			<div className="relative flex min-h-screen flex-col overflow-hidden">
				{/* Ambient light */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0"
				>
					<div className="absolute -left-[20%] -top-[35%] h-[80%] w-[80%] rounded-full bg-violet-500/[0.035] blur-[140px]" />

					<div className="absolute -bottom-[35%] -right-[20%] h-[70%] w-[70%] rounded-full bg-indigo-500/[0.025] blur-[140px]" />
				</div>

				{/* Auth */}
				<main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 sm:px-8">
					<div className="w-full max-w-[400px]">{children}</div>
				</main>
			</div>
		</div>
	);
}

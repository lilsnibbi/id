import type { ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
	type: ToastType;
	message: string;
	onClose: () => void;
}

const icons: Record<ToastType, ReactNode> = {
	success: "✓",
	error: "×",
	info: "i",
	warning: "!",
};

const colors: Record<ToastType, string> = {
	success: "border-emerald-500/50",
	error: "border-red-500/50",
	info: "border-zinc-500",
	warning: "border-yellow-500/50",
};

const iconColors: Record<ToastType, string> = {
	success: "border-emerald-500/40 text-emerald-400",
	error: "border-red-500/40 text-red-400",
	info: "border-zinc-600 text-zinc-300",
	warning: "border-yellow-500/40 text-yellow-400",
};

export default function Toast({ type, message, onClose }: ToastProps) {
	return (
		<div
			className={`
                flex w-full max-w-sm items-start gap-3 rounded-xl
                border-2 bg-zinc-950 px-4 py-3 text-white
                shadow-2xl shadow-black/40
                ${colors[type]}
            `}
		>
			<div
				className={`
                    flex h-6 w-6 shrink-0 items-center justify-center
                    rounded-full border text-xs font-bold
                    ${iconColors[type]}
                `}
			>
				{icons[type]}
			</div>

			<p className="flex-1 pt-0.5 text-sm text-zinc-300">{message}</p>

			<button
				type="button"
				onClick={onClose}
				className="text-zinc-600 transition hover:text-white"
				aria-label="Close notification"
			>
				×
			</button>
		</div>
	);
}

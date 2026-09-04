import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({
	variant = "primary",
	className = "",
	...props
}: ButtonProps) {
	const variants = {
		primary:
			"bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400",

		secondary:
			"border border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/15 hover:bg-white/[0.06] hover:text-white disabled:opacity-50",

		danger: "border border-red-500/20 bg-red-500/[0.08] text-red-400 hover:border-red-500/30 hover:bg-red-500/[0.12] hover:text-red-300 disabled:opacity-50",

		ghost: "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200 disabled:opacity-50",
	};

	return (
		<button
			{...props}
			className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${variants[variant]} ${className}`}
		/>
	);
}

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
			"border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50",
		danger: "bg-red-600 text-white hover:bg-red-500 disabled:opacity-50",
		ghost:
			"text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50",
	};

	return (
		<button
			{...props}
			className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
		/>
	);
}

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...props }: InputProps) {
	return (
		<input
			{...props}
			className={`w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
		/>
	);
}

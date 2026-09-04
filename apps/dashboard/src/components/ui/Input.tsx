import type { InputHTMLAttributes } from "react";

/**
 * Props for the {@link Input} component.
 *
 * Extends the native HTML input attributes.
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * A reusable styled input component.
 *
 * Supports all standard HTML input attributes, which are passed through
 * to the underlying `<input>` element.
 *
 * @param props - Input properties and native HTML input attributes.
 * @returns A styled HTML input element.
 *
 * @example
 * <Input placeholder="Enter your name" />
 *
 * @example
 * <Input
 *     type="email"
 *     placeholder="you@example.com"
 *     required
 * />
 *
 * @example
 * <Input disabled value="Read-only value" />
 */
export default function Input({ className = "", ...props }: InputProps) {
	return (
		<input
			{...props}
			className={`w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
		/>
	);
}

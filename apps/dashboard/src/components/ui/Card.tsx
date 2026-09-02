import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export default function Card({ className = "", ...props }: CardProps) {
	return (
		<div
			{...props}
			className={`rounded-lg border border-zinc-800 bg-zinc-900 ${className}`}
		/>
	);
}

interface SpinnerProps {
	size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "md" }: SpinnerProps) {
	const sizes = {
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-8 w-8",
	};

	return (
		<div
			className={`${sizes[size]} animate-spin rounded-full border-2 border-zinc-700 border-t-white`}
			aria-label="Loading"
			role="status"
		/>
	);
}

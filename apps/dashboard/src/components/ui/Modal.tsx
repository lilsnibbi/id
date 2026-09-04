import type { ReactNode } from "react";

interface ModalProps {
	open: boolean;
	title: string;
	description?: string;
	onClose: () => void;
	children: ReactNode;
}

export default function Modal({
	open,
	title,
	description,
	children,
}: ModalProps) {
	if (!open) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				className="
					w-full
					max-w-md
					rounded-2xl
					border
					border-white/10
					bg-zinc-950/95
					p-7
					text-white
					shadow-2xl
					shadow-black/50
					ring-1
					ring-violet-500/5
				"
			>
				<div className="mb-7">
					<h2
						id="modal-title"
						className="text-xl font-semibold tracking-tight"
					>
						{title}
					</h2>

					{description && (
						<p className="mt-2 text-sm leading-6 text-zinc-500">
							{description}
						</p>
					)}
				</div>

				{children}
			</div>
		</div>
	);
}

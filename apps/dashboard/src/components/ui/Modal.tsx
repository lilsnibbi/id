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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-white shadow-xl"
			>
				<div className="mb-6">
					<h2 id="modal-title" className="text-lg font-semibold">
						{title}
					</h2>

					{description && (
						<p className="mt-2 text-sm text-zinc-400">{description}</p>
					)}
				</div>

				{children}
			</div>
		</div>
	);
}

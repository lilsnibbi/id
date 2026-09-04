import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Props for the {@link Modal} component.
 */
interface ModalProps {
	/**
	 * Whether the modal is visible.
	 */
	open: boolean;

	/**
	 * Title displayed at the top of the modal.
	 */
	title: string;

	/**
	 * Optional description displayed below the title.
	 */
	description?: string;

	/**
	 * Callback invoked when the modal is closed.
	 */
	onClose: () => void;

	/**
	 * Content rendered inside the modal.
	 */
	children: ReactNode;
}

/**
 * A reusable modal dialog rendered into `document.body` using a React portal.
 *
 * The modal is portaled outside the component's normal DOM hierarchy so its
 * backdrop can cover the entire application viewport. This allows the modal
 * to apply effects such as a full-screen blur or backdrop overlay without
 * being constrained by parent elements, stacking contexts, or overflow rules.
 *
 * The modal is only rendered when `open` is `true`. Clicking the backdrop
 * invokes the `onClose` callback.
 *
 * @param props - Modal configuration and content.
 * @returns The modal dialog when open, otherwise `null`.
 *
 * @example
 * <Modal
 *     open={isOpen}
 *     title="Confirm deletion"
 *     description="This action cannot be undone."
 *     onClose={() => setIsOpen(false)}
 * >
 *     <Button variant="danger">Delete</Button>
 * </Modal>
 *
 * @example
 * <Modal
 *     open={isOpen}
 *     title="Settings"
 *     onClose={() => setIsOpen(false)}
 * >
 *     <SettingsForm />
 * </Modal>
 */
export default function Modal({
	open,
	title,
	description,
	onClose,
	children,
}: ModalProps) {
	if (!open) {
		return null;
	}

	return createPortal(
		<div className="fixed inset-0 z-100 flex items-center justify-center px-4">
			<button
				type="button"
				aria-label="Close modal"
				className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
				onClick={onClose}
			/>

			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				className="
                    relative
                    z-10
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
					<h2 id="modal-title" className="text-xl font-semibold tracking-tight">
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
		</div>,
		document.body,
	);
}

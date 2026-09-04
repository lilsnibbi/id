import { createPortal } from "react-dom";

import Toast from "@/components/toast/Toast";
import type { ToastData } from "@/components/toast/ToastProvider";

interface ToastContainerProps {
	toasts: ToastData[];
	onRemove: (id: string) => void;
}

export default function ToastContainer({
	toasts,
	onRemove,
}: ToastContainerProps) {
	return createPortal(
		<div className="pointer-events-none fixed inset-x-0 top-6 z-200 flex flex-col items-center gap-3 px-6">
			{toasts.map((toast) => (
				<div key={toast.id} className="pointer-events-auto">
					<Toast
						type={toast.type}
						message={toast.message}
						closing={toast.closing}
						onClose={() => onRemove(toast.id)}
					/>
				</div>
			))}
		</div>,
		document.body,
	);
}

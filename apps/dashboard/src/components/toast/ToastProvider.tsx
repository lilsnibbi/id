import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import type { ToastType } from "@/components/toast/Toast";
import ToastContainer from "@/components/toast/ToastContainer";

export interface ToastData {
	id: string;
	type: ToastType;
	message: string;
	closing: boolean;
}

interface ToastContextValue {
	toast: {
		success: (message: string) => void;
		error: (message: string) => void;
		info: (message: string) => void;
		warning: (message: string) => void;
	};
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
	children: ReactNode;
}

const TOAST_DURATION = 4000;
const TOAST_EXIT_DURATION = 180;

export default function ToastProvider({ children }: ToastProviderProps) {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((current) =>
			current.map((toast) =>
				toast.id === id ? { ...toast, closing: true } : toast,
			),
		);

		setTimeout(() => {
			setToasts((current) => current.filter((toast) => toast.id !== id));
		}, TOAST_EXIT_DURATION);
	}, []);

	const addToast = useCallback(
		(type: ToastType, message: string) => {
			const id = crypto.randomUUID();

			setToasts((current) => [
				...current,
				{
					id,
					type,
					message,
					closing: false,
				},
			]);

			setTimeout(() => {
				removeToast(id);
			}, TOAST_DURATION);
		},
		[removeToast],
	);

	const toast = useMemo(
		() => ({
			success: (message: string) => addToast("success", message),
			error: (message: string) => addToast("error", message),
			info: (message: string) => addToast("info", message),
			warning: (message: string) => addToast("warning", message),
		}),
		[addToast],
	);

	const value = useMemo(
		() => ({
			toast,
		}),
		[toast],
	);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}

	return context.toast;
}

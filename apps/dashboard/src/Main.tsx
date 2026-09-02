import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import AuthProvider from "@/components/auth/AuthProvider";
import ToastProvider from "@/components/toast/ToastProvider";

import { router } from "./router";

import "@styles/global.css";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
	<StrictMode>
		<ToastProvider>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</ToastProvider>
	</StrictMode>,
);

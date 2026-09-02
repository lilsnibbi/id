import { Link } from "@tanstack/react-router";

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
			<div className="text-center">
				<p className="text-r3xl font-medium text-zinc-600">404</p>

				<h1 className="mt-2 text-2xl font-semibold text-white">
					Page not found
				</h1>

				<p className="mt-2 text-sm text-zinc-500">
					The page you are looking for doesn't exist.
				</p>

				<Link
					to="/"
					className="mt-6 inline-block rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
				>
					Go home
				</Link>
			</div>
		</div>
	);
}

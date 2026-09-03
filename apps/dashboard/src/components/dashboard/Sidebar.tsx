import { useState } from "react";

import { Link } from "@tanstack/react-router";

import { getNavigationItems } from "@/lib/navigation";

import { routeTree } from "@/routeTree.gen";

export default function Sidebar() {
	const items = getNavigationItems(routeTree);

	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

	function toggleGroup(to: string) {
		setCollapsed((current) => ({
			...current,
			[to]: !current[to],
		}));
	}

	return (
		<aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
			<div className="border-b border-zinc-800 px-6 py-5">
				<div className="font-semibold text-white">Maze ID</div>
				<div className="text-xs text-zinc-500">Identity management</div>
			</div>

			<nav className="space-y-1 p-3">
				{items.map((item) => {
					const hasChildren = item.children.length > 0;
					const isCollapsed = collapsed[item.to] ?? false;

					if (!hasChildren) {
						return (
							<Link
								key={item.to}
								to={item.to}
								activeOptions={{
									exact: true,
								}}
								activeProps={{
									className: "bg-zinc-800 text-white",
								}}
								inactiveProps={{
									className:
										"text-zinc-400 hover:bg-zinc-900 hover:text-white",
								}}
								className="block rounded-md px-3 py-2 text-sm font-medium"
							>
								{item.label}
							</Link>
						);
					}

					return (
						<div key={item.to}>
							<button
								type="button"
								onClick={() => toggleGroup(item.to)}
								className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white"
							>
								<span>{item.label}</span>

								<svg
									viewBox="0 0 20 20"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className={`h-4 w-4 transition-transform ${
										isCollapsed ? "-rotate-90" : ""
									}`}
									aria-hidden="true"
								>
									<path
										d="m6 8 4 4 4-4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>

							{!isCollapsed && (
								<div className="ml-3 mt-1 space-y-1 border-l border-zinc-800 pl-3">
									{item.children.map((child) => (
										<Link
											key={child.to}
											to={child.to}
											activeOptions={{
												exact: true,
											}}
											activeProps={{
												className:
													"bg-zinc-800 text-white",
											}}
											inactiveProps={{
												className:
													"text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200",
											}}
											className="block rounded-md px-3 py-1.5 text-sm"
										>
											{child.label}
										</Link>
									))}
								</div>
							)}
						</div>
					);
				})}
			</nav>
			<div className="mt-auto min-w-0 overflow-hidden border-t border-zinc-800 px-6 py-4">
				<div
					className="truncate text-xs text-zinc-600"
					title={`Build ${__APP_VERSION__}`}
				>
					Build {__APP_VERSION__}
				</div>
			</div>
		</aside>
	);
}

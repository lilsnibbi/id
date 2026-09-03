import type { AnyRoute } from "@tanstack/react-router";

export interface NavigationData {
	label: string;
	order: number;
	adminOnly?: boolean;
}

export interface NavigationItem {
	label: string;
	to: string;
	order: number;
	adminOnly?: boolean;
}

export interface NavigationGroup extends NavigationItem {
	children: NavigationItem[];
}

function getNavigation(route: AnyRoute): NavigationData | undefined {
	return route.options.staticData?.navigation;
}

function collectChildren(route: AnyRoute, isAdmin: boolean): NavigationItem[] {
	const items: NavigationItem[] = [];

	for (const child of route.children ?? []) {
		const navigation = getNavigation(child);

		if (!navigation) {
			items.push(...collectChildren(child, isAdmin));
			continue;
		}

		if (navigation.adminOnly && !isAdmin) {
			continue;
		}

		items.push({
			label: navigation.label,
			to: child.fullPath,
			order: navigation.order,
			adminOnly: navigation.adminOnly,
		});
	}

	return items.sort((a, b) => a.order - b.order);
}

function collectNavigation(
	route: AnyRoute,
	isAdmin: boolean,
	items: NavigationGroup[] = [],
) {
	const navigation = getNavigation(route);

	if (navigation) {
		if (navigation.adminOnly && !isAdmin) {
			return items;
		}

		items.push({
			label: navigation.label,
			to: route.fullPath,
			order: navigation.order,
			adminOnly: navigation.adminOnly,
			children: collectChildren(route, isAdmin),
		});

		return items;
	}

	for (const child of route.children ?? []) {
		collectNavigation(child, isAdmin, items);
	}

	return items;
}

export function getNavigationItems(
	routeTree: AnyRoute,
	isAdmin: boolean,
): NavigationGroup[] {
	return collectNavigation(routeTree, isAdmin).sort(
		(a, b) => a.order - b.order,
	);
}

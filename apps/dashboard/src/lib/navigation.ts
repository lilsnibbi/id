import type { AnyRoute } from "@tanstack/react-router";

export interface NavigationData {
	label: string;
	order: number;
}

export interface NavigationItem {
	label: string;
	to: string;
	order: number;
}

export interface NavigationGroup extends NavigationItem {
	children: NavigationItem[];
}

function getNavigation(route: AnyRoute): NavigationData | undefined {
	return route.options.staticData?.navigation;
}

function collectChildren(route: AnyRoute): NavigationItem[] {
	const items: NavigationItem[] = [];

	for (const child of route.children ?? []) {
		const navigation = getNavigation(child);

		if (!navigation) {
			items.push(...collectChildren(child));
			continue;
		}

		items.push({
			label: navigation.label,
			to: child.fullPath,
			order: navigation.order,
		});
	}

	return items.sort((a, b) => a.order - b.order);
}

function collectNavigation(route: AnyRoute, items: NavigationGroup[] = []) {
	const navigation = getNavigation(route);

	if (navigation) {
		items.push({
			label: navigation.label,
			to: route.fullPath,
			order: navigation.order,
			children: collectChildren(route),
		});

		return items;
	}

	for (const child of route.children ?? []) {
		collectNavigation(child, items);
	}

	return items;
}

export function getNavigationItems(routeTree: AnyRoute): NavigationGroup[] {
	return collectNavigation(routeTree).sort((a, b) => a.order - b.order);
}

import type { AnyRoute } from "@tanstack/react-router";

/**
 * Navigation metadata defined on a route.
 *
 * @property label The label displayed in the dashboard sidebar.
 * @property order The position of the route in the sidebar.
 * @property adminOnly Whether the route is only visible to administrators.
 */
export interface NavigationData {
	label: string;
	order: number;
	adminOnly?: boolean;
}

/**
 * A single navigation item displayed in the dashboard sidebar.
 *
 * @property label The label displayed in the sidebar.
 * @property to The route path used by the sidebar link.
 * @property order The position of the item within its group.
 * @property adminOnly Whether the item is only visible to administrators.
 */
export interface NavigationItem {
	label: string;
	to: string;
	order: number;
	adminOnly?: boolean;
}

/**
 * A navigation item that contains child sidebar items.
 */
export interface NavigationGroup extends NavigationItem {
	children: NavigationItem[];
}

/**
 * Gets navigation metadata defined on a route.
 *
 * @param route The route to inspect.
 * @returns The route's navigation metadata, or `undefined` when none is defined.
 */
function getNavigation(route: AnyRoute): NavigationData | undefined {
	return route.options.staticData?.navigation;
}

/**
 * Collects child navigation items from a route.
 *
 * Routes without navigation metadata are traversed so that nested routes can
 * still contribute sidebar items. Admin-only routes are excluded from the
 * sidebar for non-administrators.
 *
 * Marking a route inside an `adminOnly` route group as `adminOnly` is
 * technically redundant because the entire group is already hidden.
 * Explicitly marking those child routes is still recommended so their
 * intended access level remains clear if the route structure changes.
 *
 * @param route The parent route whose children should be collected.
 * @param isAdmin Whether the current user is an administrator.
 * @returns The visible child sidebar items sorted by order.
 */
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

/**
 * Collects navigation groups from a route tree.
 *
 * Admin-only groups are excluded from the dashboard sidebar when the current
 * user is not an administrator. Routes without navigation metadata are
 * traversed to find nested sidebar groups.
 *
 * @param route The route to inspect.
 * @param isAdmin Whether the current user is an administrator.
 * @param items The sidebar groups collected so far.
 * @returns The collected sidebar groups.
 */
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

/**
 * Builds the navigation items visible in the dashboard sidebar.
 *
 * Navigation is derived from route metadata and filtered according to the
 * user's administrator status. Admin-only routes are hidden from the
 * dashboard sidebar for non-administrators.
 *
 * This function only controls what appears in the sidebar. It does not
 * authorize or restrict access to routes. Protected routes must still enforce
 * authorization through their route guards.
 *
 * Marking routes inside an `adminOnly` group as `adminOnly` is technically
 * redundant, but still recommended to make each route's intended access level
 * explicit.
 *
 * @param routeTree The application's route tree.
 * @param isAdmin Whether the current user is an administrator.
 * @returns The navigation groups visible in the dashboard sidebar.
 */
export function getNavigationItems(
	routeTree: AnyRoute,
	isAdmin: boolean,
): NavigationGroup[] {
	return collectNavigation(routeTree, isAdmin).sort(
		(a, b) => a.order - b.order,
	);
}

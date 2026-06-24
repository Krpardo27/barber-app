export function isAdminRouteActive(pathname: string, routeHref: string) {
  if (routeHref === "/admin") {
    return pathname === "/admin";
  }

  return pathname === routeHref || pathname.startsWith(`${routeHref}/`);
}

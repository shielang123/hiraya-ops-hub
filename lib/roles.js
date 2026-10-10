export const ROLES = ["admin", "frontdesk", "bar", "housekeeping"];

export const ROLE_LABELS = {
  admin: "Admin",
  frontdesk: "Front desk",
  bar: "Bar counter",
  housekeeping: "Housekeeping",
};

// Pages in the Hub and which roles may open them
export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", roles: ["admin", "frontdesk"] },
  { href: "/arrivals", label: "Arrivals & departures", roles: ["admin", "frontdesk"] },
  { href: "/staff", label: "Staff", roles: ["admin"] },
];

export function canAccess(role, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(role);
}

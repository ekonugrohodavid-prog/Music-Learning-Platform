import type { RoleCode } from "@/types";

export interface ProtectedRoutePolicy {
  prefix: string;
  role: RoleCode;
}

export const protectedRoutePolicies: ProtectedRoutePolicy[] = [
  {
    prefix: "/student",
    role: "student",
  },
  {
    prefix: "/teacher",
    role: "teacher",
  },
  {
    prefix: "/admin",
    role: "admin",
  },
];

export function getProtectedRoutePolicy(
  pathname: string,
): ProtectedRoutePolicy | undefined {
  return protectedRoutePolicies.find(
    ({ prefix }) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

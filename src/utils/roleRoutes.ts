import type { AuthRole } from "@/features/auth/types";

export const getRoleHomeRoute = (role: AuthRole | null | undefined): string | null => {
  switch (role) {
    case "admin":
      return "/admin";
    case "collector":
      return "/collector";
    case "household":
      return "/household";
    default:
      return null;
  }
};

export const getLoginRoute = () => "/auth/login";
export const getRoleAssignRoute = () => "/auth/assign-role";

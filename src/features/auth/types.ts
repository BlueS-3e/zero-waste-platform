export type AuthRole = "household" | "collector" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  role: AuthRole;
  created_at?: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = SignInPayload & {
  fullName: string;
  role: AuthRole;
};

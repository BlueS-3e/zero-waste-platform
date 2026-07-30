import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClientOrThrow } from "@/services/supabase";
import { getProfile, signIn as signInApi, signUp as signUpApi, signOut as signOutApi } from "@/features/auth/api";
import type { AuthRole, Profile, SignInPayload, SignUpPayload } from "@/features/auth/types";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  role: AuthRole | null;
  signIn: (payload: SignInPayload) => Promise<Profile | null>;
  signUp: (payload: SignUpPayload) => Promise<Profile | null>;
  assignRole: (role: AuthRole) => Promise<Profile | null>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isCollector: boolean;
  isHousehold: boolean;
  isAuthenticated: boolean;
  needsRole: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (value: string | null | undefined): AuthRole | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "admin" || normalized === "collector" || normalized === "household") {
    return normalized as AuthRole;
  }

  return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const clearAuthState = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      return null;
    }

    try {
      // Profile is created automatically by the database trigger on signup.
      // We just need to fetch it here.
      const currentProfile = await getProfile(currentUser.id);
      const metadataRole = normalizeRole(currentUser.user_metadata?.role ?? currentUser.app_metadata?.role);
      const profileRole = normalizeRole(currentProfile?.role);
      const resolvedRole = profileRole ?? metadataRole;

      if (resolvedRole) {
        const mergedProfile: Profile = {
          ...(currentProfile ?? {}),
          id: currentUser.id,
          email: currentProfile?.email ?? currentUser.email ?? "",
          full_name: currentProfile?.full_name ?? currentUser.user_metadata?.fullName ?? currentUser.email ?? "",
          role: resolvedRole,
        } as Profile;

        setProfile(mergedProfile);
        return mergedProfile;
      }

      setProfile(null);
      return null;
    } catch {
      setProfile(null);
      return null;
    }
  };

  const loadSession = async () => {
    try {
      const supabase = getSupabaseClientOrThrow();
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        clearAuthState();
        setLoading(false);
        return;
      }

      if (data?.session?.user) {
        setSession(data.session);
        setUser(data.session.user);
        await refreshProfile(data.session.user);
      } else {
        clearAuthState();
      }
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();

    let subscription: { unsubscribe: () => void } | null = null;

    try {
      const supabase = getSupabaseClientOrThrow();
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await refreshProfile(session.user);
        } else {
          clearAuthState();
        }
        setLoading(false);
      });
      subscription = authListener.subscription;
    } catch (err: any) {
      // Error already handled by loadSession if it happened during init,
      // or we just log it if it happens here.
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (payload: SignInPayload): Promise<Profile | null> => {
    const data = await signInApi(payload);
    const currentUser = data.session?.user ?? data.user ?? null;
    if (currentUser) {
      setSession(data.session ?? null);
      setUser(currentUser);
      const currentProfile = await refreshProfile(currentUser);
      return currentProfile;
    }
    return null;
  };

  const signUp = async (payload: SignUpPayload): Promise<Profile | null> => {
    const data = await signUpApi(payload);
    const currentUser = data.user ?? data.session?.user ?? null;
    if (currentUser) {
      setUser(currentUser);
      setSession(data.session ?? null);
      const currentProfile = await refreshProfile(currentUser);
      return currentProfile;
    }
    return null;
  };

  const assignRole = async (selectedRole: AuthRole): Promise<Profile | null> => {
    if (!user) {
      return null;
    }

    const normalizedRole = normalizeRole(selectedRole);
    if (!normalizedRole) {
      return null;
    }

    const supabase = getSupabaseClientOrThrow();
    const currentProfile = await getProfile(user.id);
    const mergedProfile: Profile = {
      ...(currentProfile ?? {}),
      id: user.id,
      email: currentProfile?.email ?? user.email ?? "",
      full_name: currentProfile?.full_name ?? user.user_metadata?.fullName ?? user.email ?? "",
      role: normalizedRole,
    } as Profile;

    setProfile(mergedProfile);

    try {
      // Use update instead of upsert here to avoid 'new row violation' during role assignment.
      // The row should already exist via the database trigger.
      await supabase
        .from("profiles")
        .update({ role: mergedProfile.role })
        .eq("id", mergedProfile.id);
    } catch {
      // ignore
    }

    try {
      await supabase.auth.updateUser({ data: { role: normalizedRole } });
    } catch {
      // ignore
    }

    return mergedProfile;
  };

  const signOut = async () => {
    try {
      await signOutApi();
    } finally {
      clearAuthState();
    }
  };

  const role = normalizeRole(profile?.role ?? user?.user_metadata?.role ?? user?.app_metadata?.role);
  const isAdmin = role === "admin";
  const isCollector = role === "collector";
  const isHousehold = role === "household";
  const isAuthenticated = !!user;
  const needsRole = !!user && !role;

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        profile,
        session,
        loading,
        error,
        role,
        signIn,
        signUp,
        assignRole,
        signOut,
        isAdmin,
        isCollector,
        isHousehold,
        isAuthenticated,
        needsRole,
      },
    },
    children,
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

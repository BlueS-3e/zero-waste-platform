import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClientOrThrow } from "@/services/supabase";
import { getProfile, signIn as signInApi, signUp as signUpApi, signOut as signOutApi } from "@/features/auth/api";
import type { Profile, SignInPayload, SignUpPayload } from "@/features/auth/types";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const supabase = getSupabaseClientOrThrow();
    const { data } = await supabase.auth.getSession();

    if (data?.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      const currentProfile = await getProfile(data.session.user.id);
      setProfile(currentProfile);
    } else {
      setSession(null);
      setUser(null);
      setProfile(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSession();
    const supabase = getSupabaseClientOrThrow();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        const currentProfile = await getProfile(session.user.id);
        setProfile(currentProfile);
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (payload: SignInPayload) => {
    const data = await signInApi(payload);
    if (data.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      const currentProfile = await getProfile(data.session.user.id);
      setProfile(currentProfile);
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    const data = await signUpApi(payload);
    if (data.user) {
      setUser(data.user);
      setSession(data.session ?? null);
      const currentProfile = await getProfile(data.user.id);
      setProfile(currentProfile);
    }
  };

  const signOut = async () => {
    await signOutApi();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, profile, session, loading, signIn, signUp, signOut } },
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

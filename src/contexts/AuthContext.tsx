"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/types/database";

interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadSession() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        let { data } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", authUser.id)
          .single();

        // Auto-create profile if missing (fallback when DB trigger is not applied)
        if (!data) {
          const { data: created } = await supabase
            .from("profiles")
            .upsert(
              {
                id: authUser.id,
                full_name:
                  authUser.user_metadata?.full_name ??
                  authUser.user_metadata?.name ??
                  "",
                role: "candidate",
              },
              { onConflict: "id" }
            )
            .select("id, full_name, role")
            .single();
          data = created;
        }

        setProfile(data);
      }

      setLoading(false);
    }

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        if (newUser) {
          let { data } = await supabase
            .from("profiles")
            .select("id, full_name, role")
            .eq("id", newUser.id)
            .single();

          // Auto-create profile if missing
          if (!data) {
            const { data: created } = await supabase
              .from("profiles")
              .upsert(
                {
                  id: newUser.id,
                  full_name:
                    newUser.user_metadata?.full_name ??
                    newUser.user_metadata?.name ??
                    "",
                  role: "candidate",
                },
                { onConflict: "id" }
              )
              .select("id, full_name, role")
              .single();
            data = created;
          }

          setProfile(data);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: profile?.role === "admin",
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

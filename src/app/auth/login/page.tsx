"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginData = z.infer<typeof loginSchema>;

const inputClass =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm";
const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";
const errorClass = "text-xs text-red-400 mt-1";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/account";
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginData) {
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    // Check user role for redirect
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push(redirectTo);
    }
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight">
              <span className="text-white">H</span>
              <span className="text-teal">ARMONIA</span>
            </span>
          </Link>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white">
            Connexion
          </h1>
          <p className="mt-2 text-gray-400">
            Accédez à votre espace personnel
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <input
                id="email"
                type="email"
                {...register("email")}
                className={inputClass}
                placeholder="vous@exemple.com"
              />
            </div>
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className={labelClass}>Mot de passe</label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-gray-400 hover:text-teal transition"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={inputClass}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal px-6 py-3.5 font-['Space_Grotesk'] font-bold text-void text-lg transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-teal hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { SmoothInput } from "@/components/ui/SmoothInput";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    if (authError || !authData.user) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "evaluator") {
      setError("Accès réservé. Ce compte ne dispose pas des droits d'administration.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-void flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle className="h-10 w-10 p-2 rounded-full glass" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 group transition">
            <Image
              src="/images/logo/logo-transparent-dark.png"
              alt="Harmonia Progrès"
              width={160}
              height={40}
              priority
              className="h-8 w-auto mx-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal border border-teal/20 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Console Sécurisée</span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-text-primary tracking-tight">
            Espace Administration
          </h1>
          <p className="text-text-muted text-xs mt-1.5">
            Accès réservé aux administrateurs et membres du jury MIASA
          </p>
        </div>

        <div className="rounded-2xl glass p-8 border border-glass-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-text-primary mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
                <SmoothInput
                  id="admin-email"
                  type="email"
                  {...register("email")}
                  wrapperClassName="rounded-xl bg-void-2/60 border border-glass-border px-4 py-3 pl-10"
                  className="text-sm text-text-primary placeholder:text-text-muted"
                  placeholder="admin@harmonia.mg"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-text-primary mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
                <SmoothInput
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  wrapperClassName="rounded-xl bg-void-2/60 border border-glass-border px-4 py-3 pl-10"
                  className="text-sm text-text-primary placeholder:text-text-muted"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal px-6 py-3.5 font-['Space_Grotesk'] font-bold text-on-void text-sm transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                "Accéder au portail"
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-teal transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retourner au site public</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

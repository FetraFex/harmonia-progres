"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    if (authError) {
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

    if (profile?.role !== "admin") {
      setError("Accès non autorisé. Vous n'êtes pas administrateur.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="font-['Space_Grotesk'] text-2xl font-bold">
              <span className="text-white">H</span>
              <span className="text-teal">ARMONIA</span>
            </span>
          </Link>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-2">
            Administration
          </h1>
          <p className="text-gray-400 text-sm">
            Accès réservé aux administrateurs
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <input
                id="admin-email"
                type="email"
                {...register("email")}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                placeholder="admin@harmonia.mg"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
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
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal px-6 py-3.5 font-['Space_Grotesk'] font-bold text-void text-lg transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}

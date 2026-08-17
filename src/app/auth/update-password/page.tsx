"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

const schema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type UpdatePasswordData = z.infer<typeof schema>;

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: UpdatePasswordData) {
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/auth/login"), 3000);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-void flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-teal" strokeWidth={1.5} />
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-4">
            Mot de passe mis à jour
          </h1>
          <p className="text-gray-400 mb-8">
            Vous allez être redirigé vers la connexion...
          </p>
        </motion.div>
      </main>
    );
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
            Nouveau mot de passe
          </h1>
          <p className="mt-2 text-gray-400">
            Choisissez un nouveau mot de passe pour votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                placeholder="6 caractères minimum"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                placeholder="Retapez votre mot de passe"
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal px-6 py-3.5 font-['Space_Grotesk'] font-bold text-void text-lg transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Mettre à jour le mot de passe"
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { SmoothInput } from "@/components/ui/SmoothInput";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const signupSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type SignupData = z.infer<typeof signupSchema>;

const inputWrapperClass =
  "rounded-xl bg-glass-bg border border-glass-border px-4 py-3 pl-10";
const inputClass = "text-sm text-text-primary placeholder:text-text-muted";
const labelClass = "block text-sm font-medium text-text-secondary mb-1.5";
const errorClass = "text-xs text-red-400 mt-1";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupData) {
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Ensure profile exists in the profiles table (fallback if DB trigger is missing)
    const userId = authData.user?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            full_name: data.fullName,
            role: "candidate",
          },
          { onConflict: "id" }
        );

      // Ignore duplicate/RLS errors — the trigger may have already created it
      if (profileError && profileError.code !== "23505") {
        console.warn("Profile creation fallback failed:", profileError.message);
      }
    }

    if (authData.session) {
      router.push("/account");
      router.refresh();
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-void flex items-center justify-center px-6 relative">
        <div className="absolute top-5 right-5 z-20">
          <ThemeToggle className="h-10 w-10 p-2 rounded-full glass" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-teal" strokeWidth={1.5} />
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-text-primary mb-4">
            Vérifiez votre email
          </h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            Un lien de confirmation a été envoyé à votre adresse email.
            Cliquez dessus pour activer votre compte.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-xl bg-green px-8 py-3 font-['Space_Grotesk'] font-bold text-on-void transition hover:scale-[1.02]"
          >
            Aller à la connexion
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center px-6 relative">
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle className="h-10 w-10 p-2 rounded-full glass" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-6">
            <Logo
              width={160}
              height={40}
              priority
              className="h-10 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-text-primary">
            Créer un compte
          </h1>
          <p className="mt-2 text-text-muted">
            Rejoignez le programme Harmonia Progrès
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className={labelClass}>Nom complet</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <SmoothInput
                id="fullName"
                type="text"
                {...register("fullName")}
                wrapperClassName={inputWrapperClass}
                className={inputClass}
                placeholder="Prénom et Nom"
              />
            </div>
            {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <SmoothInput
                id="email"
                type="email"
                {...register("email")}
                wrapperClassName={inputWrapperClass}
                className={inputClass}
                placeholder="vous@exemple.com"
              />
            </div>
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <SmoothInput
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                wrapperClassName={inputWrapperClass}
                className={inputClass}
                placeholder="6 caractères minimum"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <SmoothInput
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                wrapperClassName={inputWrapperClass}
                className={inputClass}
                placeholder="Retapez votre mot de passe"
              />
            </div>
            {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green px-6 py-3.5 font-['Space_Grotesk'] font-bold text-on-void text-lg transition hover:scale-[1.02] hover:shadow-lg hover:shadow-green/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Déjà un compte ?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-teal hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

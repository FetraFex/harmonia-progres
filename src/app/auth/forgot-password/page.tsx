"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

const schema = z.object({
  email: z.string().email("Adresse email invalide"),
});

type ForgotPasswordData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: ForgotPasswordData) {
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
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
            Email envoyé
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-8 py-3 font-['Space_Grotesk'] font-bold text-void transition hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
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
            Mot de passe oublié
          </h1>
          <p className="mt-2 text-gray-400">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                placeholder="vous@exemple.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal px-6 py-3.5 font-['Space_Grotesk'] font-bold text-void text-lg transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le lien"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          <Link
            href="/auth/login"
            className="font-medium text-teal hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Retour à la connexion
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

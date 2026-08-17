"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, User, Mail, FileText, LogOut, Settings, ChevronRight, MapPin, Calendar } from "lucide-react";

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?next=/account");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    {
      icon: FileText,
      title: "Candidater",
      description: "Soumettre une nouvelle candidature au programme MIASA",
      href: "/candidater",
    },
    {
      icon: FileText,
      title: "Suivre ma candidature",
      description: "Consulter l'état d'avancement de votre dossier",
      href: "/candidater/suivi",
    },
  ];

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Mon espace
              </span>
              <h1 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-white">
                Bonjour, {profile?.full_name?.split(" ")[0] || "Candidat"}
              </h1>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="flex items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Déconnexion
            </button>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl glass p-6 mb-8">
            <h2 className="font-['Space_Grotesk'] font-semibold text-white mb-4">Mon profil</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-teal" strokeWidth={1.5} />
                <span className="text-gray-400">Nom :</span>
                <span className="text-white font-medium">{profile?.full_name || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-teal" strokeWidth={1.5} />
                <span className="text-gray-400">Email :</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Settings className="w-4 h-4 text-teal" strokeWidth={1.5} />
                <span className="text-gray-400">Rôle :</span>
                <span className="text-white font-medium capitalize">{profile?.role || "Candidat"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-teal" strokeWidth={1.5} />
                <span className="text-gray-400">Inscrit le :</span>
                <span className="text-white font-medium">
                  {new Date(user.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="font-['Space_Grotesk'] font-semibold text-white mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-2xl glass p-6 flex items-center gap-4 hover:border-teal/40 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
                  <action.icon className="w-6 h-6 text-teal" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Space_Grotesk'] font-semibold text-white text-sm">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-teal transition" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

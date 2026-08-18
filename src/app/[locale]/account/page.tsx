"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Application } from "@/types/database";
import {
  Loader2,
  User,
  Mail,
  FileText,
  LogOut,
  Settings,
  ChevronRight,
  MapPin,
  Calendar,
  Wheat,
  Fish,
  Palette,
  Building,
  Plus,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "Nouveau", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" },
  submitted: { label: "Candidature reçue", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  under_review: { label: "En évaluation", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  shortlisted: { label: "Présélectionné", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  interview: { label: "Entretien", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  accepted: { label: "Accepté", color: "text-teal", bg: "bg-teal/10", border: "border-teal/30" },
  rejected: { label: "Non retenu", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  waitlisted: { label: "Liste d'attente", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  withdrawn: { label: "Retiré", color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/20" },
};

const SECTOR_ICONS: Record<string, React.ElementType> = {
  agriculture: Wheat,
  artisanat: Palette,
  halieutique: Fish,
};

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?next=/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchApplications() {
      if (!user) return;
      try {
        setLoadingApps(true);
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setApplications(data as Application[]);
        }
      } catch (err) {
        console.error("Error loading user applications:", err);
      } finally {
        setLoadingApps(false);
      }
    }

    if (user) {
      fetchApplications();
    }
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-void text-text-primary">
      {/* Top Navigation Bar with Logo */}
      <header className="border-b border-glass-border bg-void/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition">
            <Image
              src="/images/logo/logo-transparent-dark.png"
              alt="Harmonia Progrès"
              width={140}
              height={36}
              priority
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-text-muted hover:text-text-primary transition hidden sm:inline-block"
            >
              Accueil
            </Link>
            <Link
              href="/candidater"
              className="rounded-xl bg-teal/10 border border-teal/30 px-3.5 py-1.5 text-xs font-semibold text-teal hover:bg-teal hover:text-on-void transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle candidature</span>
            </Link>
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="flex items-center gap-2 rounded-xl glass px-3.5 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
                Tableau de bord
              </span>
              <h1 className="mt-2 font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-text-primary">
                Bonjour, {profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Candidat"} 👋
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Gérez votre profil et suivez en temps réel l'avancement de vos candidatures MIASA.
              </p>
            </div>

            <Link
              href="/candidater"
              className="self-start sm:self-auto rounded-xl bg-teal px-5 py-3 font-['Space_Grotesk'] font-bold text-on-void text-sm transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Déposer un projet
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="rounded-2xl glass p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] font-bold text-lg text-text-primary">Informations personnelles</h2>
                  <p className="text-xs text-text-muted">Coordonnées associées à votre compte</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Compte vérifié
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal" />
                  Nom complet
                </span>
                <p className="text-sm font-semibold text-text-primary">
                  {profile?.full_name || "Non renseigné"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal" />
                  Adresse email
                </span>
                <p className="text-sm font-semibold text-text-primary truncate" title={user.email}>
                  {user.email}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-teal" />
                  Rôle
                </span>
                <p className="text-sm font-semibold text-text-primary capitalize">
                  {profile?.role || "Candidat"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal" />
                  Membre depuis
                </span>
                <p className="text-sm font-semibold text-text-primary">
                  {new Date(user.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* User Applications Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-text-primary flex items-center gap-2.5">
                  <FileText className="w-6 h-6 text-teal" strokeWidth={1.5} />
                  Mes candidatures
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Suivez l'historique et l'évaluation de vos projets déposés
                </p>
              </div>

              {applications.length > 0 && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full glass text-text-primary border border-glass-border">
                  {applications.length} {applications.length > 1 ? "dossiers" : "dossier"}
                </span>
              )}
            </div>

            {loadingApps ? (
              <div className="rounded-2xl glass p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
                <p className="text-sm text-text-muted">Chargement de vos candidatures...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-2xl glass p-10 md:p-14 text-center space-y-4 border border-glass-border">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-teal/10 flex items-center justify-center text-teal">
                  <FileText className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-text-primary">
                  Aucune candidature trouvée
                </h3>
                <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                  Vous n'avez pas encore soumis de projet au programme MIASA Jeunes Entrepreneurs. Lancez-vous dès aujourd'hui !
                </p>
                <div className="pt-2">
                  <Link
                    href="/candidater"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal px-6 py-3 font-['Space_Grotesk'] font-bold text-on-void text-sm transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20"
                  >
                    <Plus className="w-4 h-4" />
                    Commencer une candidature
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => {
                  const SectorIcon = SECTOR_ICONS[app.sector] || Building;
                  const statusInfo = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl glass p-6 hover:border-teal/40 transition group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-['JetBrains_Mono'] text-xs font-semibold px-2.5 py-1 rounded-md bg-void-2 text-teal border border-teal/20">
                              {app.reference_number || "RÉFÉRENCE EN ATTENTE"}
                            </span>
                            <span
                              className={`text-xs font-medium px-3 py-1 rounded-full border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>

                          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-text-primary group-hover:text-teal transition">
                            {app.project_name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-text-muted pt-1">
                            <span className="flex items-center gap-1.5">
                              <SectorIcon className="w-4 h-4 text-teal" strokeWidth={1.5} />
                              <span className="capitalize">{app.sector}</span>
                            </span>

                            {(app.commune || app.district) && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-teal" strokeWidth={1.5} />
                                <span>{app.commune || app.district}</span>
                              </span>
                            )}

                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
                              <span>
                                Déposé le{" "}
                                {new Date(app.created_at).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-glass-border">
                          <Link
                            href={`/candidater/suivi?ref=${encodeURIComponent(app.reference_number || "")}`}
                            className="w-full lg:w-auto rounded-xl glass px-4 py-2.5 text-xs font-semibold text-text-primary hover:bg-teal hover:text-on-void transition flex items-center justify-center gap-2"
                          >
                            <span>Suivre le statut</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

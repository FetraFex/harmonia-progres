"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Database,
  Server,
  CheckCircle2,
  Lock,
  User,
  Mail,
  Activity,
  Clock,
  FileText,
  Star,
  Users,
  Layers,
  Key,
  Globe,
  BarChart3,
} from "lucide-react";

interface SystemInfo {
  name: string;
  email: string;
  role: string;
}

interface TableStats {
  applications: number;
  evaluations: number;
  profiles: number;
  statusHistory: number;
  documents: number;
  contactMessages: number;
}

export default function ParametresPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [counts, setCounts] = useState<TableStats>({
    applications: 0,
    evaluations: 0,
    profiles: 0,
    statusHistory: 0,
    documents: 0,
    contactMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadInfo() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, role")
            .eq("id", user.id)
            .single();

          setSystemInfo({
            email: user.email || "",
            name: profile?.full_name || "Administrateur",
            role: profile?.role || "admin",
          });
        }

        const [appsRes, evalsRes, profsRes, histRes, docsRes, msgRes] = await Promise.all([
          supabase.from("applications").select("id", { count: "exact", head: true }),
          supabase.from("application_evaluations").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("application_status_history").select("id", { count: "exact", head: true }),
          supabase.from("application_documents").select("id", { count: "exact", head: true }),
          supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        ]);

        setCounts({
          applications: appsRes.count || 0,
          evaluations: evalsRes.count || 0,
          profiles: profsRes.count || 0,
          statusHistory: histRes.count || 0,
          documents: docsRes.count || 0,
          contactMessages: msgRes.count || 0,
        });
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadInfo();
  }, [supabase]);

  const dbTables = [
    { label: "Candidatures", count: counts.applications, icon: FileText, color: "text-teal" },
    { label: "Évaluations", count: counts.evaluations, icon: Star, color: "text-amber-400" },
    { label: "Comptes", count: counts.profiles, icon: Users, color: "text-blue-400" },
    { label: "Historique", count: counts.statusHistory, icon: Clock, color: "text-purple-400" },
    { label: "Documents", count: counts.documents, icon: Layers, color: "text-indigo-400" },
    { label: "Messages", count: counts.contactMessages, icon: Mail, color: "text-coral" },
  ];

  const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
            Configuration & Maintenance
          </span>
          <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-bold text-text-primary tracking-tight">
            Paramètres du système
          </h1>
          <p className="mt-1.5 text-sm text-text-muted">
            Informations sur l&apos;environnement d&apos;administration, santé de la base de données et sécurité.
          </p>
        </div>

        {/* Admin Profile + System Health Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Administrator Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass p-6 md:p-8 space-y-6 border border-glass-border"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-glass-border">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/20 flex items-center justify-center text-teal">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] font-bold text-base text-text-primary">
                  Session administrateur
                </h2>
                <p className="text-[11px] text-text-muted">Autorisations et identité de la session active</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Nom complet", value: systemInfo?.name || "—", icon: User },
                { label: "Email", value: systemInfo?.email || "—", icon: Mail },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3.5 rounded-xl bg-void-2/60 border border-glass-border">
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
                    <span className="text-xs text-text-muted">{item.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-text-primary">{item.value}</span>
                </div>
              ))}

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-void-2/60 border border-glass-border">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
                  <span className="text-xs text-text-muted">Niveau de rôle</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/20 text-[11px] font-semibold capitalize">
                  <Key className="w-3 h-3" />
                  {systemInfo?.role || "admin"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* System Health Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl glass p-6 md:p-8 space-y-6 border border-glass-border"
          >
            <div className="flex items-center justify-between pb-4 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/20 flex items-center justify-center text-teal">
                  <Activity className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] font-bold text-base text-text-primary">
                    Santé du système
                  </h2>
                  <p className="text-[11px] text-text-muted">État des services et connectivité</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Opérationnel
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Base de données PostgreSQL", sub: "Supabase", status: "healthy", icon: Database },
                { label: "Authentification", sub: "Supabase Auth", status: "healthy", icon: Shield },
                { label: "Row Level Security", sub: "RLS activé", status: "healthy", icon: Lock },
                { label: "Stockage fichiers", sub: "Supabase Storage", status: "healthy", icon: Server },
                { label: "Réseau CDN", sub: "Edge Network", status: "healthy", icon: Globe },
              ].map((svc) => (
                <div key={svc.label} className="flex items-center justify-between p-3 rounded-xl bg-void-2/60 border border-glass-border">
                  <div className="flex items-center gap-3">
                    <svc.icon className="w-4 h-4 text-text-muted/60" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-medium text-text-primary">{svc.label}</p>
                      <p className="text-[10px] text-text-muted">{svc.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                    <span className="text-[10px] font-medium text-teal">Actif</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Database Volume Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass p-6 md:p-8 border border-glass-border"
        >
          <div className="flex items-center justify-between pb-5 border-b border-glass-border mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                <BarChart3 className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] font-bold text-base text-text-primary">
                  Volume de la base de données
                </h2>
                <p className="text-[11px] text-text-muted">Nombre total de lignes par table ({totalRecords} enregistrements)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {dbTables.map((table, idx) => (
              <motion.div
                key={table.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + idx * 0.03 }}
                className="p-4 rounded-xl bg-void-2/60 border border-glass-border text-center hover:border-glass-border-strong transition group"
              >
                <div className={`w-8 h-8 rounded-lg bg-glass-bg mx-auto flex items-center justify-center ${table.color} mb-2 group-hover:scale-110 transition-transform`}>
                  <table.icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <span className="font-['Space_Grotesk'] font-bold text-xl text-text-primary block">
                  {loading ? "…" : table.count}
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5">{table.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security & RLS Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass p-6 md:p-8 space-y-4 border border-glass-border"
        >
          <h3 className="font-['Space_Grotesk'] font-bold text-base text-text-primary flex items-center gap-2.5 pb-3 border-b border-glass-border">
            <Lock className="w-4 h-4 text-teal" />
            Sécurité & Droits d&apos;accès (RLS)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-void-2/60 border border-glass-border space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal" />
                <span className="font-semibold text-text-primary">Candidats</span>
              </div>
              <p className="text-text-muted leading-relaxed">
                Accès limité à leurs propres dossiers de candidature et documents.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-void-2/60 border border-glass-border space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-text-primary">Évaluateurs</span>
              </div>
              <p className="text-text-muted leading-relaxed">
                Consultation et notation de toutes les candidatures soumises.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-void-2/60 border border-glass-border space-y-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-coral" />
                <span className="font-semibold text-text-primary">Administrateurs</span>
              </div>
              <p className="text-text-muted leading-relaxed">
                Accès complet : gestion des statuts, évaluations, paramètres et utilisateurs.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

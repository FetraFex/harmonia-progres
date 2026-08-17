// ──────────────────────────────────────────────
// Database types for HARMONIA PROGRES
// Auto-generate with: npx supabase gen types typescript --project-id <ref> > src/types/database.ts
// ──────────────────────────────────────────────

export type UserRole = "admin" | "evaluator" | "candidate";

export type ApplicationStatus =
  | "new"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "rejected"
  | "waitlisted"
  | "withdrawn";

export type Sector = "artisanat" | "halieutique" | "agriculture";

export type EducationLevel =
  | "none"
  | "primary"
  | "secondary"
  | "vocational"
  | "bachelor"
  | "master"
  | "other";

export type District = "manakara" | "vohipeno" | "autre";

export type ActivityType =
  | "riziculture"
  | "maraichage"
  | "transformation_agri"
  | "elevage"
  | "vannerie"
  | "raphia"
  | "nattes"
  | "paniers"
  | "peche"
  | "transformation_hal"
  | "conservation"
  | "commercialisation"
  | "autre";

export type NeedType =
  | "formation"
  | "equipement"
  | "financement"
  | "accompagnement"
  | "marketing"
  | "acces_marche"
  | "mentorat";

export type SituationActuelle =
  | "etudiant"
  | "salarie"
  | "chomeur"
  | "independant"
  | "retraite"
  | "autre";

// ── profiles ──────────────────────────────────
export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ── applications ──────────────────────────────
export interface Application {
  id: string;
  reference_number: string;
  user_id: string;

  // Personal info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  district: District;
  commune: string;
  address: string | null;

  // Profile
  situation: SituationActuelle;
  education_level: EducationLevel;
  experience_professionnelle: string | null;
  experience_entrepreneuriale: string | null;

  // Project
  project_name: string;
  sector: Sector;
  activity_type: ActivityType;
  project_description: string;
  problem_identified: string;
  solution_proposed: string;
  target_market: string;

  // Motivation
  motivation: string;
  needs: NeedType[];
  accomplishments: string;

  // Status
  status: ApplicationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  consent: boolean;

  created_at: string;
  updated_at: string;
}

// ── application_documents ─────────────────────
export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
}

// ── application_evaluations ───────────────────
export interface ApplicationEvaluation {
  id: string;
  application_id: string;
  evaluator_id: string;
  score: number | null;
  pertinence: number | null;
  faisabilite: number | null;
  motivation_score: number | null;
  potentiel_economique: number | null;
  impact_local: number | null;
  strengths: string | null;
  weaknesses: string | null;
  recommendation: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── application_status_history ────────────────
export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  old_status: ApplicationStatus | null;
  new_status: ApplicationStatus;
  changed_by: string | null;
  reason: string | null;
  created_at: string;
}

// ── contact_messages ──────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ── Database type (Supabase generated) ────────
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      applications: {
        Row: Application;
        Insert: Omit<
          Application,
          "id" | "reference_number" | "created_at" | "updated_at"
        >;
        Update: Partial<Omit<Application, "id" | "created_at">>;
      };
      application_documents: {
        Row: ApplicationDocument;
        Insert: Omit<ApplicationDocument, "id" | "uploaded_at">;
        Update: Partial<Omit<ApplicationDocument, "id" | "uploaded_at">>;
      };
      application_evaluations: {
        Row: ApplicationEvaluation;
        Insert: Omit<ApplicationEvaluation, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ApplicationEvaluation, "id" | "created_at">>;
      };
      application_status_history: {
        Row: ApplicationStatusHistory;
        Insert: Omit<ApplicationStatusHistory, "id" | "created_at">;
        Update: Partial<Omit<ApplicationStatusHistory, "id" | "created_at">>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, "id" | "created_at">;
        Update: Partial<Omit<ContactMessage, "id" | "created_at">>;
      };
    };
  };
}

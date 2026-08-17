// ──────────────────────────────────────────────
// Database types for HARMONIA PROGRES
// Auto-generate with: npx supabase gen types typescript --project-id <ref> > src/types/database.ts
// ──────────────────────────────────────────────

export type UserRole = "admin" | "evaluator";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted";

export type Sector = "artisanat" | "halieutique" | "agriculture";

export type EducationLevel =
  | "none"
  | "primary"
  | "secondary"
  | "vocational"
  | "bachelor"
  | "master"
  | "other";

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
  gender: string | null;
  address: string | null;
  city: string;
  region: string;

  // Education
  education_level: EducationLevel;
  education_institution: string | null;
  education_field: string | null;

  // Entrepreneurial project
  project_name: string;
  project_description: string;
  sector: Sector;
  project_stage: string | null;
  existing_business: boolean;
  business_name: string | null;

  // Motivation
  motivation: string;
  expectations: string | null;

  // Status
  status: ApplicationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;

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

// ── newsletter_subscribers ────────────────────
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  is_active: boolean;
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
        Update: Partial<
          Omit<ApplicationEvaluation, "id" | "created_at">
        >;
      };
      application_status_history: {
        Row: ApplicationStatusHistory;
        Insert: Omit<ApplicationStatusHistory, "id" | "created_at">;
        Update: Partial<
          Omit<ApplicationStatusHistory, "id" | "created_at">
        >;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, "id" | "subscribed_at">;
        Update: Partial<
          Omit<NewsletterSubscriber, "id" | "subscribed_at">
        >;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, "id" | "created_at">;
        Update: Partial<Omit<ContactMessage, "id" | "created_at">>;
      };
    };
  };
}

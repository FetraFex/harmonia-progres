import { createClient } from "@/lib/supabase/client";
import type {
  Application,
  ApplicationDocument,
  ApplicationEvaluation,
  ContactMessage,
  Sector,
  ApplicationStatus,
  EducationLevel,
} from "@/types/database";

const supabase = createClient();

// ── Newsletter ────────────────────────────────

export async function subscribeNewsletter(email: string) {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email })
    .select()
    .single();

  return { data, error };
}

// ── Contact ───────────────────────────────────

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert(payload)
    .select()
    .single();

  return { data, error };
}

// ── Applications ──────────────────────────────

export async function createApplication(payload: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city: string;
  region?: string;
  education_level: EducationLevel;
  education_institution?: string;
  education_field?: string;
  project_name: string;
  project_description: string;
  sector: Sector;
  project_stage?: string;
  existing_business: boolean;
  business_name?: string;
  motivation: string;
  expectations?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("applications")
    .insert({ ...payload, user_id: user.id })
    .select()
    .single();

  return { data: data as Application | null, error };
}

export async function getMyApplications() {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  return { data: data as Application[] | null, error };
}

export async function getApplication(id: string) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  return { data: data as Application | null, error };
}

export async function updateApplication(
  id: string,
  updates: Partial<Omit<Application, "id" | "created_at" | "updated_at">>
) {
  const { data, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { data: data as Application | null, error };
}

// ── Documents ─────────────────────────────────

export async function uploadDocument(
  applicationId: string,
  file: File,
  documentType: string
) {
  const filePath = `${applicationId}/${documentType}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("application-documents")
    .upload(filePath, file);

  if (uploadError) return { data: null, error: uploadError };

  const { data, error } = await supabase
    .from("application_documents")
    .insert({
      application_id: applicationId,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single();

  return { data: data as ApplicationDocument | null, error };
}

export async function getApplicationDocuments(applicationId: string) {
  const { data, error } = await supabase
    .from("application_documents")
    .select("*")
    .eq("application_id", applicationId)
    .order("uploaded_at", { ascending: false });

  return { data: data as ApplicationDocument[] | null, error };
}

// ── Admin: Applications ───────────────────────

export async function getAllApplications(filters?: {
  status?: ApplicationStatus;
  sector?: Sector;
}) {
  let query = supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.sector) query = query.eq("sector", filters.sector);

  const { data, error } = await query;
  return { data: data as Application[] | null, error };
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  adminNotes?: string
) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("applications")
    .update({
      status,
      admin_notes: adminNotes,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  return { data: data as Application | null, error };
}

// ── Admin: Evaluations ────────────────────────

export async function createEvaluation(payload: {
  application_id: string;
  score?: number;
  strengths?: string;
  weaknesses?: string;
  recommendation?: string;
  notes?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("application_evaluations")
    .insert({ ...payload, evaluator_id: user.id })
    .select()
    .single();

  return { data: data as ApplicationEvaluation | null, error };
}

export async function getApplicationEvaluations(applicationId: string) {
  const { data, error } = await supabase
    .from("application_evaluations")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });

  return { data: data as ApplicationEvaluation[] | null, error };
}

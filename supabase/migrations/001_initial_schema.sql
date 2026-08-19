-- ──────────────────────────────────────────────
-- HARMONIA PROGRES — Database Schema
-- HARMONIA PROGRES
-- Run this in Supabase SQL Editor
-- ──────────────────────────────────────────────

-- ── ENUM TYPES ────────────────────────────────

CREATE TYPE user_role AS ENUM ('admin', 'evaluator', 'candidate');

CREATE TYPE application_status AS ENUM (
  'new',
  'draft',
  'submitted',
  'under_review',
  'shortlisted',
  'interview',
  'accepted',
  'rejected',
  'waitlisted',
  'withdrawn'
);

CREATE TYPE sector AS ENUM ('artisanat', 'halieutique', 'agriculture');

CREATE TYPE education_level AS ENUM (
  'none',
  'primary',
  'secondary',
  'vocational',
  'bachelor',
  'master',
  'other'
);

-- ── TABLE: profiles ───────────────────────────

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  role        user_role NOT NULL DEFAULT 'candidate',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', ''), 'candidate'::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── TABLE: applications ───────────────────────

CREATE TABLE applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number  TEXT UNIQUE NOT NULL,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Personal info
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT NOT NULL,
  date_of_birth     DATE,
  district          TEXT NOT NULL,
  commune           TEXT,
  address           TEXT,

  -- Profile
  situation             TEXT,
  education_level       education_level NOT NULL DEFAULT 'secondary',
  experience_professionnelle     TEXT,
  experience_entrepreneuriale    TEXT,

  -- Project
  project_name        TEXT NOT NULL,
  sector              sector NOT NULL,
  activity_type       TEXT,
  project_description TEXT NOT NULL,
  problem_identified  TEXT,
  solution_proposed   TEXT,
  target_market       TEXT,

  -- Motivation
  motivation          TEXT NOT NULL,
  needs               TEXT[],
  accomplishments     TEXT,

  -- Consent
  consent             BOOLEAN NOT NULL DEFAULT false,

  -- Status
  status          application_status NOT NULL DEFAULT 'new',
  reviewed_by     UUID REFERENCES profiles(id),
  reviewed_at     TIMESTAMPTZ,
  admin_notes     TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-generate reference number: HP-YYYY-XXXX
CREATE SEQUENCE IF NOT EXISTS application_ref_seq START 1;

CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TRIGGER AS $$
DECLARE
  yr TEXT;
  seq TEXT;
BEGIN
  yr := TO_CHAR(now(), 'YYYY');
  seq := LPAD(CAST(nextval('application_ref_seq') AS TEXT), 4, '0');
  NEW.reference_number := 'HP-' || yr || '-' || seq;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_reference_number
  BEFORE INSERT ON applications
  FOR EACH ROW
  WHEN (NEW.reference_number IS NULL OR NEW.reference_number = '')
  EXECUTE FUNCTION generate_reference_number();

-- ── TABLE: application_documents ──────────────

CREATE TABLE application_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type   TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  file_path       TEXT NOT NULL,
  file_size       BIGINT,
  mime_type       TEXT,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── TABLE: application_evaluations ────────────

CREATE TABLE application_evaluations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  evaluator_id    UUID NOT NULL REFERENCES profiles(id),
  pertinence          INTEGER CHECK (pertinence >= 1 AND pertinence <= 5),
  faisabilite         INTEGER CHECK (faisabilite >= 1 AND faisabilite <= 5),
  motivation_score    INTEGER CHECK (motivation_score >= 1 AND motivation_score <= 5),
  potentiel_economique INTEGER CHECK (potentiel_economique >= 1 AND potentiel_economique <= 5),
  impact_local        INTEGER CHECK (impact_local >= 1 AND impact_local <= 5),
  score           INTEGER CHECK (score >= 0 AND score <= 100),
  strengths       TEXT,
  weaknesses      TEXT,
  recommendation  TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── TABLE: application_status_history ─────────

CREATE TABLE application_status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  old_status      application_status,
  new_status      application_status NOT NULL,
  changed_by      UUID REFERENCES profiles(id),
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO application_status_history (application_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.reviewed_by);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_status_change
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- ── TABLE: newsletter_subscribers ─────────────

CREATE TABLE newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true
);

-- ── TABLE: contact_messages ───────────────────

CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── INDEXES ───────────────────────────────────

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_sector ON applications(sector);
CREATE INDEX idx_applications_reference ON applications(reference_number);

CREATE INDEX idx_documents_application ON application_documents(application_id);
CREATE INDEX idx_evaluations_application ON application_evaluations(application_id);
CREATE INDEX idx_status_history_application ON application_status_history(application_id);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(is_active);

-- ── ROW LEVEL SECURITY ────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Applications
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can update all applications"
  ON applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Documents
CREATE POLICY "Users can view own documents"
  ON application_documents FOR SELECT
  USING (EXISTS (SELECT 1 FROM applications WHERE applications.id = application_documents.application_id AND applications.user_id = auth.uid()));

CREATE POLICY "Users can insert own documents"
  ON application_documents FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM applications WHERE applications.id = application_documents.application_id AND applications.user_id = auth.uid()));

-- Evaluations: only admins
CREATE POLICY "Admins can manage evaluations"
  ON application_evaluations FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Status history: only admins
CREATE POLICY "Admins can view status history"
  ON application_status_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Newsletter
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Contact
CREATE POLICY "Anyone can submit contact"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ── updated_at TRIGGER ────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER evaluations_updated_at
  BEFORE UPDATE ON application_evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

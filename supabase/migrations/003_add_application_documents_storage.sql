-- ──────────────────────────────────────────────
-- HARMONIA PROGRES — Application Documents Storage
-- Creates the "application-documents" bucket + storage RLS policies
-- ──────────────────────────────────────────────

-- Create the storage bucket (private by default)
INSERT INTO storage.buckets (id, name, public)
VALUES ('application-documents', 'application-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies

-- Candidates can upload documents into their own folder (user_id/<doc_type>/...)
CREATE POLICY "Users can upload own application documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'application-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Candidates can read their own documents
CREATE POLICY "Users can read own application documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'application-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Candidates can update (overwrite) their own documents
CREATE POLICY "Users can update own application documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'application-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Candidates can delete their own documents
CREATE POLICY "Users can delete own application documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'application-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read all documents (for review/download)
CREATE POLICY "Admins can read all application documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'application-documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admins can delete documents (cleanup)
CREATE POLICY "Admins can delete application documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'application-documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

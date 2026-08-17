-- ──────────────────────────────────────────────
-- HARMONIA PROGRES — Admin document policies
-- Admins must be able to view application_documents
-- (candidate-only policies were hiding documents from admins)
-- ──────────────────────────────────────────────

-- Admins can view all documents (for review/download)
CREATE POLICY "Admins can view all documents"
  ON application_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admins can delete documents (cleanup)
CREATE POLICY "Admins can delete all documents"
  ON application_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

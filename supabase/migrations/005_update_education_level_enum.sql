-- ──────────────────────────────────────────────
-- Update education_level enum to new values
-- Old: none, primary, secondary, vocational, bachelor, master, other
-- New: bachelier, licence, master, phd, other
-- ──────────────────────────────────────────────

-- 1. Create the new enum type
CREATE TYPE education_level_new AS ENUM (
  'bachelier',
  'licence',
  'master',
  'phd',
  'other'
);

-- 2. Alter the column to use the new type, mapping old values in the USING clause
ALTER TABLE applications
  ALTER COLUMN education_level DROP DEFAULT,
  ALTER COLUMN education_level TYPE education_level_new
    USING (
      CASE education_level::text
        WHEN 'bachelor' THEN 'bachelier'::education_level_new
        WHEN 'none' THEN 'other'::education_level_new
        WHEN 'primary' THEN 'other'::education_level_new
        WHEN 'secondary' THEN 'other'::education_level_new
        WHEN 'vocational' THEN 'other'::education_level_new
        ELSE education_level::text::education_level_new
      END
    );

-- 3. Restore the default
ALTER TABLE applications
  ALTER COLUMN education_level SET DEFAULT 'bachelier';

-- 4. Drop the old enum type and rename the new one
DROP TYPE education_level;
ALTER TYPE education_level_new RENAME TO education_level;

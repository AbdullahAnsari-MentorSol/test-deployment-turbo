-- Migration: Add new fields for voice1, voice2, no_of_speakers, speaker1, speaker2, and CTA, and remove the old voices field

BEGIN;

-- Remove the old voices column
ALTER TABLE podcast_settings
    DROP COLUMN IF EXISTS voices;

-- Add new columns for voice1, voice2, no_of_speakers, speaker1, speaker2, and CTA
ALTER TABLE podcast_settings
    ADD COLUMN voice1 JSONB,  -- Voice 1 will be stored as JSON
    ADD COLUMN voice2 JSONB,  -- Voice 2 will be stored as JSON
    ADD COLUMN no_of_speakers INT CHECK (no_of_speakers >= 1 AND no_of_speakers <= 2) DEFAULT 2, -- Number of speakers, default 2
    ADD COLUMN speaker1 TEXT DEFAULT 'Speaker 1', -- Default value for Speaker 1
    ADD COLUMN speaker2 TEXT DEFAULT 'Speaker 2', -- Default value for Speaker 2
    ADD COLUMN cta TEXT;  -- CTA (Call to Action)

COMMIT;

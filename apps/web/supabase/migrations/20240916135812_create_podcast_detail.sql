CREATE TABLE podcast_detail (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    podcast_title TEXT NOT NULL,
    podcast_audio_length INTERVAL NOT NULL,
    podcast_audio TEXT,
    account_id UUID REFERENCES public.accounts (id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE accounts
ADD COLUMN credit INTERVAL DEFAULT '0 seconds' NOT NULL;

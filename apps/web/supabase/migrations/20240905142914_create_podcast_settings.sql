CREATE TABLE podcast_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    podcast_prompt TEXT,
    brand_information TEXT,
    ai_model JSONB,
    voices JSONB,
    style TEXT[],
    number_of_words INT CHECK (number_of_words >= 300 AND number_of_words <= 2000),
    search_the_web BOOLEAN DEFAULT FALSE,
    quality TEXT CHECK (quality IN ('HD', 'SD')),
    account_id uuid references public.accounts (id) on delete cascade not null,
    created_at TIMESTAMP DEFAULT NOW()
);
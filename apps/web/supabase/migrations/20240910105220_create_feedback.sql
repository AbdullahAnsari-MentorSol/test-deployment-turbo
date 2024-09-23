CREATE TABLE feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL, 
    comment TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5), 
    liked BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT NOW(), 
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 005_create_members.sql
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    initials VARCHAR(5) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

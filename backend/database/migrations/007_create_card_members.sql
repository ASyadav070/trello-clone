-- 007_create_card_members.sql
CREATE TABLE IF NOT EXISTS card_members (
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (card_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_card_members ON card_members(card_id);

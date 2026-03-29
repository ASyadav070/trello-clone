-- 001_seed_initial_data.sql
-- Seed script for Trello Clone
-- Clears existing data first
TRUNCATE TABLE boards CASCADE;
TRUNCATE TABLE labels CASCADE;
TRUNCATE TABLE members CASCADE;

-- 1. Insert 1 Board
INSERT INTO boards (id, title, background) VALUES
('b1000000-0000-4000-a000-000000000000', 'My Project Board', '#0052cc');

-- 2. Insert 4 Lists
INSERT INTO lists (id, board_id, title, position) VALUES
('a1000000-0000-4000-a000-000000000000', 'b1000000-0000-4000-a000-000000000000', 'To Do', 0),
('a2000000-0000-4000-a000-000000000000', 'b1000000-0000-4000-a000-000000000000', 'In Progress', 1),
('a3000000-0000-4000-a000-000000000000', 'b1000000-0000-4000-a000-000000000000', 'In Review', 2),
('a4000000-0000-4000-a000-000000000000', 'b1000000-0000-4000-a000-000000000000', 'Done', 3);

-- 3. Insert 6 Labels
INSERT INTO labels (id, name, color) VALUES
('c0000001-1111-4000-a000-000000000000', 'Urgent', '#f87462'),
('c0000002-1111-4000-a000-000000000000', 'Feature', '#faa53d'),
('c0000003-1111-4000-a000-000000000000', 'Design', '#f5cd47'),
('c0000004-1111-4000-a000-000000000000', 'Backend', '#4bce97'),
('c0000005-1111-4000-a000-000000000000', 'Frontend', '#579dff'),
('c0000006-1111-4000-a000-000000000000', 'Research', '#9f8fef');

-- 4. Insert 5 Members
INSERT INTO members (id, name, avatar_url, initials) VALUES
('e0000001-2222-4000-a000-000000000000', 'Alice Smith', NULL, 'AS'),
('e0000002-2222-4000-a000-000000000000', 'Bob Jones', NULL, 'BJ'),
('e0000003-2222-4000-a000-000000000000', 'Charlie Brown', NULL, 'CB'),
('e0000004-2222-4000-a000-000000000000', 'Diana Prince', NULL, 'DP'),
('e0000005-2222-4000-a000-000000000000', 'Evan Wright', NULL, 'EW');

-- 5. Insert 10 Cards
INSERT INTO cards (id, list_id, title, description, position) VALUES
('c0000001-3333-4000-a000-000000000000', 'a1000000-0000-4000-a000-000000000000', 'Setup Next.js Project', 'Initialize basic boilerplate', 0),
('c0000002-3333-4000-a000-000000000000', 'a1000000-0000-4000-a000-000000000000', 'Design Database Schema', 'Plan schema per rules', 1),
('c0000003-3333-4000-a000-000000000000', 'a1000000-0000-4000-a000-000000000000', 'Build API Routes', 'Express REST endpoints', 2),
('c0000004-3333-4000-a000-000000000000', 'a2000000-0000-4000-a000-000000000000', 'Configure Database connection', 'Setup PostgreSQL pg pool', 0),
('c0000005-3333-4000-a000-000000000000', 'a2000000-0000-4000-a000-000000000000', 'Implement Zustand Store', 'Client state management details', 1),
('c0000006-3333-4000-a000-000000000000', 'a2000000-0000-4000-a000-000000000000', 'UI Drag and Drop', 'React beautiful dnd implementation', 2),
('c0000007-3333-4000-a000-000000000000', 'a3000000-0000-4000-a000-000000000000', 'Write Seed Scripts', 'Testing initial data populator', 0),
('c0000008-3333-4000-a000-000000000000', 'a3000000-0000-4000-a000-000000000000', 'Code Review Checklist', 'Review against strict rules', 1),
('c0000009-3333-4000-a000-000000000000', 'a4000000-0000-4000-a000-000000000000', 'Initial Readme', 'Update rules.md', 0),
('c0000010-3333-4000-a000-000000000000', 'a4000000-0000-4000-a000-000000000000', 'Setup CI/CD pipeline', 'GitHub Actions setup', 1);

-- 6. Attach Labels & Members to some cards
INSERT INTO card_labels (card_id, label_id) VALUES
('c0000001-3333-4000-a000-000000000000', 'c0000005-1111-4000-a000-000000000000'),
('c0000002-3333-4000-a000-000000000000', 'c0000004-1111-4000-a000-000000000000'),
('c0000003-3333-4000-a000-000000000000', 'c0000004-1111-4000-a000-000000000000');

INSERT INTO card_members (card_id, member_id) VALUES
('c0000001-3333-4000-a000-000000000000', 'e0000001-2222-4000-a000-000000000000'),
('c0000006-3333-4000-a000-000000000000', 'e0000003-2222-4000-a000-000000000000');

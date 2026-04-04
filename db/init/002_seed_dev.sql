-- Minimal dev seed data for local compose runs
-- Safe to re-run because inserts are guarded.

INSERT INTO users (email, username, password_hash)
SELECT 'demo@torsor.local', 'demo', '$2a$10$c5xtgYBe6QYi0G4YwQg69ez2Iy1ZPJ2cucohLzgjTFZHGSuiT3.sq'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'demo@torsor.local'
);

INSERT INTO projects (user_id, name, description, vibe, is_public)
SELECT u.id, 'Torsor Demo Project', 'Seeded project for local compose smoke tests.', 'builder', TRUE
FROM users u
WHERE u.email = 'demo@torsor.local'
  AND NOT EXISTS (
    SELECT 1 FROM projects p WHERE p.user_id = u.id AND p.name = 'Torsor Demo Project'
  );

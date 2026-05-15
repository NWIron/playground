-- D1 schema for devices
CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT,
  status TEXT,
  location TEXT,
  metadata JSON
);

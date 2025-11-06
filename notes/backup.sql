PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE [users] ("id" integer PRIMARY KEY,"email" text,"name" text);
INSERT INTO "users" VALUES(0,'majvr.werk@gmail.com','Thijs');
CREATE TABLE [groceries] ("id" integer PRIMARY KEY,"user_id" integer,"title" text,"content" text,"updated_at" text);
CREATE TABLE [recipes] ("id" integer PRIMARY KEY,"user_id" integer,"title" text,"content" text,"updated_at" text);
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE blueprints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
DELETE FROM sqlite_sequence;
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);
CREATE INDEX idx_blueprints_user_id ON blueprints(user_id);
CREATE INDEX idx_blueprints_updated_at ON blueprints(updated_at);

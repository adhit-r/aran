import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs/promises'; // Using fs.promises for async file operations
import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs for IDs

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'aran_docs.sqlite');

// Ensure the database directory exists
async function ensureDbDirectory(): Promise<void> {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      console.error('Failed to create database directory:', DB_DIR, error);
      throw error;
    }
  }
}

let dbInstance: Database | null = null;

export async function initializeDbSchema(db: Database): Promise<void> {
  // Added db parameter to use the passed instance
  await db.exec(`
    CREATE TABLE IF NOT EXISTS apiDocuments (
      id TEXT PRIMARY KEY, -- Using TEXT for UUIDs
      fileName TEXT NOT NULL,
      title TEXT,
      version TEXT,
      format TEXT NOT NULL,
      storagePath TEXT NOT NULL,
      uploadedBy TEXT,
      uploadedAt TEXT NOT NULL, -- ISO 8601 string
      lastModifiedAt TEXT, -- ISO 8601 string
      teamId TEXT,
      projectId TEXT,
      description TEXT,
      tags TEXT, -- Stored as JSON string: '["tag1", "tag2"]'
      CONSTRAINT uq_storagePath UNIQUE (storagePath)
    );
  `);
  console.log('apiDocuments table schema initialized (or already exists).');

  // Example of adding indexes (optional, can be run once)
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_apiDocuments_format ON apiDocuments(format);`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_apiDocuments_uploadedBy ON apiDocuments(uploadedBy);`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_apiDocuments_uploadedAt ON apiDocuments(uploadedAt);`);
}

export async function getOpenDb(): Promise<Database> {
  if (!dbInstance) {
    await ensureDbDirectory();
    const dbFileExists = await fs.access(DB_FILE).then(() => true).catch(() => false);

    const newDbInstance = await open({
      filename: DB_FILE,
      driver: sqlite3.Database,
    });
    console.log('SQLite database connection established to:', DB_FILE);

    if (!dbFileExists) {
      console.log('Database file did not exist, initializing schema...');
      await initializeDbSchema(newDbInstance); // Pass the instance
    }
    // Assign to global instance *after* potential initialization
    dbInstance = newDbInstance;
  }
  return dbInstance;
}

// Optional: Function to close the database connection if needed (e.g., during server shutdown)
export async function closeDb(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    console.log('SQLite database connection closed.');
  }
}

// It's useful to also export a function to generate IDs for new records if not using AUTOINCREMENT
export function generateNewId(): string {
  return uuidv4();
}

import { NextRequest, NextResponse } from 'next/server';
import { ApiDocumentMetadata } from '@/types/api-document'; // Adjust path as needed
import { getOpenDb } from '@/lib/sqlite-db';

export async function GET(request: NextRequest, { params }: { params: { documentId: string } }) {
  const { documentId } = params;

  if (!documentId) {
    return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
  }

  try {
    const db = await getOpenDb();

    // Explicitly list columns to ensure correct order and prevent selecting unwanted data
    // storagePath is included as it's part of ApiDocumentMetadata, even if not used for download URL here
    const row = await db.get(
      `SELECT id, fileName, title, version, format, storagePath,
              uploadedBy, uploadedAt, lastModifiedAt,
              teamId, projectId, description, tags
       FROM apiDocuments
       WHERE id = ?`,
      documentId
    );

    if (!row) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    // Transform the row to ApiDocumentMetadata
    // downloadUrl is intentionally omitted from this endpoint's response.
    const metadata: ApiDocumentMetadata = {
      id: row.id,
      fileName: row.fileName,
      title: row.title,
      version: row.version,
      format: row.format,
      storagePath: row.storagePath, // Still part of the metadata record
      uploadedBy: row.uploadedBy,
      // Convert ISO string dates from DB back to Date objects for the type,
      // NextResponse.json will handle serializing them back to ISO strings.
      uploadedAt: new Date(row.uploadedAt),
      lastModifiedAt: row.lastModifiedAt ? new Date(row.lastModifiedAt) : undefined,
      teamId: row.teamId,
      projectId: row.projectId,
      description: row.description,
      tags: row.tags ? JSON.parse(row.tags) : [],
      // downloadUrl is not set here
    };

    return NextResponse.json(metadata, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching API document ${documentId}:`, error);
    // Check for specific error types if needed, e.g., SQLite errors
    if (error.code === 'SQLITE_ERROR') { // Example of specific error check
        return NextResponse.json({ error: 'Database error occurred.', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch API document.', details: error.message || String(error) }, { status: 500 });
  }
}

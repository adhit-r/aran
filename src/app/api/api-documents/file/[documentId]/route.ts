import { NextRequest, NextResponse } from 'next/server';
import { getOpenDb } from '@/lib/sqlite-db';
import { ApiDocumentMetadata } from '@/types/api-document'; // Ensure this path is correct
import fs from 'fs/promises';
import path from 'path';
import { lookup } from 'mime-types';

export async function GET(request: NextRequest, { params }: { params: { documentId: string } }) {
  const { documentId } = params;

  if (!documentId) {
    return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
  }

  try {
    const db = await getOpenDb();

    // Fetch only necessary fields: storagePath and fileName
    const docMetadata = await db.get<{ storagePath: string, fileName: string, format: ApiDocumentMetadata['format'] }>(
      `SELECT storagePath, fileName, format FROM apiDocuments WHERE id = ?`,
      documentId
    );

    if (!docMetadata || !docMetadata.storagePath) {
      return NextResponse.json({ error: 'Document not found or storage path missing.' }, { status: 404 });
    }

    // Construct the full path to the file on disk
    // storagePath is stored relative to process.cwd() (e.g., "uploads/api_specs/...")
    const fullPathToSpecFile = path.join(process.cwd(), docMetadata.storagePath);

    // Check if file exists
    try {
      await fs.access(fullPathToSpecFile);
    } catch (fileAccessError) {
      console.error(`File not found at path: ${fullPathToSpecFile}`, fileAccessError);
      return NextResponse.json({ error: 'File not found on server.' }, { status: 404 });
    }

    // Determine Content-Type
    let contentType = lookup(docMetadata.fileName); // Guess from filename first
    if (!contentType) { // Fallback based on stored format
      switch (docMetadata.format) {
        case 'openapi-json':
        case 'postman-collection':
          contentType = 'application/json';
          break;
        case 'openapi-yaml':
          contentType = 'application/yaml';
          break;
        default:
          contentType = 'application/octet-stream';
      }
    }

    const fileBuffer = await fs.readFile(fullPathToSpecFile);

    // Create a Response object
    const response = new Response(fileBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Use 'inline' to suggest browser rendering; 'attachment' to force download
        'Content-Disposition': `inline; filename="${encodeURIComponent(docMetadata.fileName)}"`,
      },
    });

    return response;

  } catch (error: any) {
    console.error(`Error serving API document file ${documentId}:`, error);
    if (error.code === 'SQLITE_ERROR') {
        return NextResponse.json({ error: 'Database error occurred while fetching document metadata.', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to serve API document file.', details: error.message || String(error) }, { status: 500 });
  }
}

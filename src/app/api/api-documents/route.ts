import { NextRequest, NextResponse } from 'next/server';
import { ApiDocumentMetadata, ApiDocumentFormat } from '@/types/api-document'; // Adjust path as needed
import { getOpenDb } from '@/lib/sqlite-db';

// Allowed columns for ordering to prevent SQL injection
const ALLOWED_ORDER_BY_COLUMNS: (keyof Omit<ApiDocumentMetadata, 'downloadUrl' | 'tags'>)[] = [
    'fileName', 'title', 'version', 'format', 'uploadedAt', 'lastModifiedAt', 'uploadedBy', 'teamId', 'projectId'
];


export async function GET(request: NextRequest) {
  try {
    const db = await getOpenDb();
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let orderBy = searchParams.get('orderBy') || 'uploadedAt';
    if (!ALLOWED_ORDER_BY_COLUMNS.includes(orderBy as any)) {
        orderBy = 'uploadedAt'; // Default to a safe column if invalid input
    }

    let orderDirection = searchParams.get('orderDirection')?.toUpperCase() || 'DESC';
    if (orderDirection !== 'ASC' && orderDirection !== 'DESC') {
        orderDirection = 'DESC'; // Default to DESC if invalid input
    }

    // Base query for documents
    // Explicitly list columns to ensure correct order and prevent selecting unwanted data
    let query = `
      SELECT id, fileName, title, version, format, storagePath,
             uploadedBy, uploadedAt, lastModifiedAt,
             teamId, projectId, description, tags
      FROM apiDocuments
    `;

    // TODO: Add WHERE clauses here for filtering based on searchParams (e.g., format, teamId)

    query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;

    const documentsRaw = await db.all(query, limit, offset);

    const documents: ApiDocumentMetadata[] = documentsRaw.map(doc => ({
      ...doc,
      tags: doc.tags ? JSON.parse(doc.tags) : [],
      // Convert ISO string dates from DB back to Date objects for the type,
      // NextResponse.json will handle serializing them back to ISO strings.
      uploadedAt: new Date(doc.uploadedAt),
      lastModifiedAt: doc.lastModifiedAt ? new Date(doc.lastModifiedAt) : undefined,
    })) as ApiDocumentMetadata[]; // Type assertion after mapping

    // Query for total count (without limit/offset, but with filters if they were applied)
    // For simplicity, this count query doesn't include filters yet.
    const countResult = await db.get<{ total: number }>(`SELECT COUNT(*) as total FROM apiDocuments`);
    const totalDocuments = countResult?.total || 0;

    return NextResponse.json({
      data: documents,
      pagination: {
        total: totalDocuments,
        limit,
        offset,
        pageCount: Math.ceil(totalDocuments / limit),
        currentPage: Math.floor(offset / limit) + 1,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching API documents:', error);
    return NextResponse.json({ error: 'Failed to fetch API documents.', details: error.message || String(error) }, { status: 500 });
  }
}

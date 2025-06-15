import { NextRequest, NextResponse } from 'next/server';
import { ApiDocumentMetadata, ApiDocumentFormat } from '@/types/api-document';
import YAML from 'js-yaml'; // For parsing YAML files
import fs from 'fs/promises';
import path from 'path';
import { getOpenDb, generateNewId } from '@/lib/sqlite-db'; // DB Utilities

// Define Upload Directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'api_specs');

// Helper functions (detectFormat, parseApiDocumentContent) remain the same as they are generic
function detectFormat(fileName: string, contentType?: string): ApiDocumentFormat {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (contentType === 'application/json' || extension === 'json') {
    return 'openapi-json'; // Could also be Postman, further parsing needed
  }
  if (contentType === 'application/yaml' || contentType === 'text/yaml' || extension === 'yaml' || extension === 'yml') {
    return 'openapi-yaml';
  }
  return 'unknown';
}

interface ParsedSpecInfo {
  title?: string;
  version?: string;
  description?: string;
  format?: ApiDocumentFormat;
  tags?: string[]; // Added tags from parsing if possible
}

async function parseApiDocumentContent(content: string, initialFormat: ApiDocumentFormat): Promise<ParsedSpecInfo> {
  let parsed: any;
  let finalFormat = initialFormat;
  let tags: string[] | undefined = undefined;

  try {
    if (initialFormat === 'openapi-yaml') {
      parsed = YAML.load(content);
    } else if (initialFormat === 'openapi-json') {
      parsed = JSON.parse(content);
    } else {
      try {
        parsed = JSON.parse(content);
        finalFormat = 'openapi-json';
      } catch (e) {
        try {
          parsed = YAML.load(content);
          finalFormat = 'openapi-yaml';
        } catch (yamlError) {
          console.warn("Failed to parse content as JSON or YAML.", yamlError);
          return { format: 'unknown' };
        }
      }
    }

    if (parsed && (parsed.openapi || parsed.swagger)) {
      finalFormat = (finalFormat === 'openapi-yaml' || initialFormat === 'openapi-yaml') ? 'openapi-yaml' : 'openapi-json';
      if (Array.isArray(parsed.tags)) {
        tags = parsed.tags.map((tag: any) => typeof tag.name === 'string' ? tag.name : undefined).filter(Boolean) as string[];
      }
      return {
        title: parsed.info?.title,
        version: parsed.info?.version,
        description: parsed.info?.description,
        format: finalFormat,
        tags: tags,
      };
    }
    else if (parsed && parsed.info && parsed.item) {
        if (parsed.info._postman_id) {
             finalFormat = 'postman-collection';
        }
      // Postman collections don't typically have a global tags field in info, tags are per-item.
      return {
        title: parsed.info?.name,
        version: parsed.info?.version?.string || parsed.info?.version,
        description: typeof parsed.info?.description === 'string' ? parsed.info.description : parsed.info?.description?.content,
        format: finalFormat,
      };
    }

  } catch (error) {
    console.error('Error parsing API document content:', error);
    return { format: 'unknown' };
  }
  return { format: 'unknown' };
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const MAX_FILE_SIZE_MB = 5;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.` }, { status: 413 });
    }

    // Ensure upload directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Save file to local filesystem
    // Use a timestamp and original filename for uniqueness on disk, but keep original filename for metadata
    const timestampPrefix = `${Date.now()}`;
    const uniqueDiskFileName = `${timestampPrefix}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`; // Sanitize filename
    const diskPath = path.join(UPLOADS_DIR, uniqueDiskFileName);
    const relativeStoragePath = path.join('uploads', 'api_specs', uniqueDiskFileName); // Path relative to cwd

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(diskPath, fileBuffer);
    console.log(`File saved to disk: ${diskPath}`);

    // Metadata Extraction
    const fileContentText = await file.text();
    const initialFormat = detectFormat(file.name, file.type);
    const parsedInfo = await parseApiDocumentContent(fileContentText, initialFormat);

    const finalFormat = parsedInfo.format || initialFormat;
    const documentId = generateNewId(); // Generate UUID for the document
    const currentTime = new Date().toISOString();
    const userId = 'mock-user-id'; // TODO: Replace with actual authenticated user ID

    const metadataToSave: ApiDocumentMetadata = {
      id: documentId,
      fileName: file.name,
      title: parsedInfo.title || file.name,
      version: parsedInfo.version,
      description: parsedInfo.description,
      format: finalFormat,
      storagePath: relativeStoragePath, // Store relative path
      uploadedBy: userId,
      uploadedAt: new Date(currentTime), // Store as Date object, will be stringified by JSON response
      lastModifiedAt: new Date(currentTime),
      tags: parsedInfo.tags || [],
      // teamId, projectId can be added later or passed from client
    };

    // Store metadata in SQLite
    const db = await getOpenDb();
    const stmt = await db.prepare(`
      INSERT INTO apiDocuments (id, fileName, title, version, format, storagePath, uploadedBy, uploadedAt, lastModifiedAt, teamId, projectId, description, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    await stmt.run(
      metadataToSave.id,
      metadataToSave.fileName,
      metadataToSave.title,
      metadataToSave.version,
      metadataToSave.format,
      metadataToSave.storagePath,
      metadataToSave.uploadedBy,
      (metadataToSave.uploadedAt as Date).toISOString(), // Store dates as ISO strings
      (metadataToSave.lastModifiedAt as Date).toISOString(),
      metadataToSave.teamId,       // Will be NULL if undefined
      metadataToSave.projectId,    // Will be NULL if undefined
      metadataToSave.description,  // Will be NULL if undefined
      JSON.stringify(metadataToSave.tags) // Store tags array as JSON string
    );
    await stmt.finalize();

    console.log(`Metadata saved to SQLite for doc ID: ${documentId}`);

    return NextResponse.json(metadataToSave, { status: 201 });

  } catch (error: any) {
    console.error('Error uploading API document:', error);
    return NextResponse.json({ error: 'Failed to upload API document.', details: error.message || String(error) }, { status: 500 });
  }
}

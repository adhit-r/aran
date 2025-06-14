import { NextRequest, NextResponse } from 'next/server';
import { ApiDocumentMetadata, ApiDocumentFormat } from '@/types/api-document';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs if Firestore isn't auto-generating client-side
import YAML from 'js-yaml'; // For parsing YAML files

// --- Firebase Admin SDK Setup (Conceptual - actual initialization would be in a shared lib) ---
// import admin from 'firebase-admin';
// import { getStorage } from 'firebase-admin/storage';
// import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Mock Firebase initialization check - in a real app, this would be handled by firebase-admin setup
let _firebaseAppInitialized = false;
function initializeFirebaseAdminIfNeeded() {
  if (!_firebaseAppInitialized) {
    // Conceptual: admin.initializeApp(...);
    console.log("Mock Firebase Admin Initialized (Conceptual)");
    _firebaseAppInitialized = true;
  }
}
initializeFirebaseAdminIfNeeded();

// --- Mock Firebase Interaction Functions ---
// These would use the Firebase Admin SDK in a real backend
async function mockUploadToStorage(fileBuffer: Buffer, filePath: string, contentType?: string): Promise<{ success: boolean; storagePath?: string; error?: string }> {
  console.log(`Mock uploading ${filePath} (${(fileBuffer.length / 1024).toFixed(2)} KB, type: ${contentType}) to Firebase Storage.`);
  // In real implementation:
  // const bucket = getStorage().bucket();
  // await bucket.file(filePath).save(fileBuffer, { metadata: { contentType } });
  return { success: true, storagePath: filePath };
}

async function mockSaveMetadataToFirestore(metadata: Omit<ApiDocumentMetadata, 'id'>): Promise<ApiDocumentMetadata> {
  const newId = uuidv4(); // Generate ID client-side for mock
  const savedDoc = {
    ...metadata,
    id: newId,
    uploadedAt: new Date(), // Simulate server timestamp
    lastModifiedAt: new Date(),
  } as ApiDocumentMetadata;
  console.log(`Mock saving metadata to Firestore for doc ID: ${newId}`, savedDoc);
  // In real implementation:
  // const db = getFirestore();
  // const docRef = await db.collection('apiDocuments').add({
  //   ...metadata,
  //   uploadedAt: FieldValue.serverTimestamp(),
  //   lastModifiedAt: FieldValue.serverTimestamp(),
  // });
  // return { ...metadata, id: docRef.id, uploadedAt: new Date(), lastModifiedAt: new Date() }; // Approximate
  return savedDoc;
}


function detectFormat(fileName: string, contentType?: string): ApiDocumentFormat {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (contentType === 'application/json' || extension === 'json') {
    return 'openapi-json'; // Could also be Postman, further parsing needed
  }
  if (contentType === 'application/yaml' || contentType === 'text/yaml' || extension === 'yaml' || extension === 'yml') {
    return 'openapi-yaml';
  }
  // Add more sophisticated detection if needed, e.g., based on content structure for Postman
  return 'unknown';
}

interface ParsedSpecInfo {
  title?: string;
  version?: string;
  description?: string;
  format?: ApiDocumentFormat; // Can refine format after parsing
}

async function parseApiDocumentContent(content: string, initialFormat: ApiDocumentFormat): Promise<ParsedSpecInfo> {
  let parsed: any;
  let finalFormat = initialFormat;

  try {
    if (initialFormat === 'openapi-yaml') {
      parsed = YAML.load(content);
    } else if (initialFormat === 'openapi-json') {
      parsed = JSON.parse(content);
    } else {
      // Try parsing as JSON by default if unknown but looks like JSON based on extension
      try {
        parsed = JSON.parse(content);
        finalFormat = 'openapi-json'; // Tentatively assume OpenAPI JSON
      } catch (e) {
        // If JSON parsing fails, try YAML
        try {
          parsed = YAML.load(content);
          finalFormat = 'openapi-yaml'; // Tentatively assume OpenAPI YAML
        } catch (yamlError) {
          console.warn("Failed to parse content as JSON or YAML.", yamlError);
          return { format: 'unknown' };
        }
      }
    }

    // Check for OpenAPI structure
    if (parsed && (parsed.openapi || parsed.swagger)) {
      finalFormat = initialFormat === 'openapi-yaml' || finalFormat === 'openapi-yaml' ? 'openapi-yaml' : 'openapi-json';
      return {
        title: parsed.info?.title,
        version: parsed.info?.version,
        description: parsed.info?.description,
        format: finalFormat,
      };
    }
    // Check for Postman Collection structure (basic)
    else if (parsed && parsed.info && parsed.item) {
        // More specific check for Postman schema version might be good
        if (parsed.info._postman_id) {
             finalFormat = 'postman-collection';
        }
      return {
        title: parsed.info?.name, // Postman uses 'name' in info block
        version: parsed.info?.version?.string || parsed.info?.version, // Postman version can be an object or string
        description: typeof parsed.info?.description === 'string' ? parsed.info.description : parsed.info?.description?.content,
        format: finalFormat,
      };
    }

  } catch (error) {
    console.error('Error parsing API document content:', error);
    return { format: 'unknown' }; // Return unknown if any parsing error
  }
  return { format: 'unknown' }; // Default if no known structure identified
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Basic validation
    const MAX_FILE_SIZE_MB = 5;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.` }, { status: 413 }); // 413 Payload Too Large
    }

    const userId = 'mock-user-id'; // TODO: Replace with actual authenticated user ID
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Firestore-friendly timestamp for filename
    const uniqueFileNameForStorage = `${timestamp}-${file.name}`;
    const storagePath = `api-documents/${userId}/${uniqueFileNameForStorage}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to Firebase Storage (using mock)
    const uploadResult = await mockUploadToStorage(fileBuffer, storagePath, file.type);
    if (!uploadResult.success || !uploadResult.storagePath) {
      return NextResponse.json({ error: 'Failed to upload file to storage.' }, { status: 500 });
    }

    // Metadata Extraction
    const fileContentText = await file.text();
    const initialFormat = detectFormat(file.name, file.type);
    const parsedInfo = await parseApiDocumentContent(fileContentText, initialFormat);

    const finalFormat = parsedInfo.format || initialFormat;

    const metadataToSave: Omit<ApiDocumentMetadata, 'id' | 'uploadedAt' | 'lastModifiedAt' | 'downloadUrl'> = {
      fileName: file.name,
      title: parsedInfo.title || file.name, // Default to filename if no title extracted
      version: parsedInfo.version,
      description: parsedInfo.description,
      format: finalFormat,
      storagePath: uploadResult.storagePath,
      uploadedBy: userId,
      // teamId, projectId, tags can be added later or passed from client
    };

    // Save metadata to Firestore (using mock)
    const savedMetadata = await mockSaveMetadataToFirestore(metadataToSave);

    return NextResponse.json(savedMetadata, { status: 201 });

  } catch (error: any) {
    console.error('Error uploading API document:', error);
    // Check for specific error types if needed, e.g., from Firebase
    return NextResponse.json({ error: 'Failed to upload API document.', details: error.message || String(error) }, { status: 500 });
  }
}

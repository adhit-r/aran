import { NextRequest, NextResponse } from 'next/server';
import { ApiDocumentMetadata, ApiDocumentFormat } from '@/types/api-document'; // Adjust path as needed

// --- Firebase Admin SDK Setup (Conceptual - actual initialization would be in a shared lib) ---
// import admin from 'firebase-admin';
// import { getFirestore, Timestamp } from 'firebase-admin/firestore'; // For Timestamp type

// Mock Firebase initialization check
let _firebaseAppInitialized = false;
function initializeFirebaseAdminIfNeeded() {
  if (!_firebaseAppInitialized) {
    // Conceptual: admin.initializeApp(...);
    console.log("Mock Firebase Admin Initialized (Conceptual) for listing documents.");
    _firebaseAppInitialized = true;
  }
}
initializeFirebaseAdminIfNeeded();

// --- Mock Firebase Interaction Function ---
// This would use the Firebase Admin SDK in a real backend
const mockFetchDocumentsFromFirestore = async (
  limit: number = 20,
  orderBy: string = 'uploadedAt',
  orderDirection: 'desc' | 'asc' = 'desc'
): Promise<ApiDocumentMetadata[]> => {
  console.log(`Mock fetching documents from Firestore: limit=${limit}, orderBy=${orderBy}, direction=${orderDirection}`);
  // Simulate fetching and transforming data
  // In a real scenario, you'd handle Firestore Timestamps properly
  const mockDataFromDb = [
    {
      id: 'mock-doc-1',
      fileName: 'petstore-openapi.json',
      title: 'Pet Store API',
      version: '1.0.1',
      format: 'openapi-json' as ApiDocumentFormat,
      storagePath: 'api-documents/user1/petstore-openapi.json',
      uploadedBy: 'user1',
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      lastModifiedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      teamId: 'teamA',
      description: 'A sample API for managing pets in a store.',
      tags: ['pets', 'store', 'v1']
    },
    {
      id: 'mock-doc-2',
      fileName: 'weather-api.yaml',
      title: 'Global Weather API',
      version: '2.1.0',
      format: 'openapi-yaml' as ApiDocumentFormat,
      storagePath: 'api-documents/user2/weather-api.yaml',
      uploadedBy: 'user2',
      uploadedAt: new Date(), // Today
      lastModifiedAt: new Date(),
      teamId: 'teamB',
      description: 'Provides current weather and forecasts for any location.',
      tags: ['weather', 'forecast', 'location']
    },
    {
      id: 'mock-doc-3',
      fileName: 'user-service.json',
      title: 'User Management Service',
      version: '0.9.0',
      format: 'openapi-json' as ApiDocumentFormat,
      storagePath: 'api-documents/user1/user-service.json',
      uploadedBy: 'user1',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Two days ago
      lastModifiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      teamId: 'teamA',
      description: 'Handles user authentication and profile management.',
      tags: ['users', 'auth', 'profile']
    }
  ];

  // Simulate ordering
  mockDataFromDb.sort((a, b) => {
    const valA = a[orderBy as keyof ApiDocumentMetadata] as any;
    const valB = b[orderBy as keyof ApiDocumentMetadata] as any;
    if (orderDirection === 'asc') {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });

  return mockDataFromDb.slice(0, limit).map(doc => ({
      ...doc,
      // Ensure dates are consistently represented, e.g., as ISO strings for JSON response
      uploadedAt: doc.uploadedAt instanceof Date ? doc.uploadedAt.toISOString() : new Date(doc.uploadedAt as any).toISOString(),
      lastModifiedAt: doc.lastModifiedAt ? (doc.lastModifiedAt instanceof Date ? doc.lastModifiedAt.toISOString() : new Date(doc.lastModifiedAt as any).toISOString()) : undefined,
  })) as unknown as ApiDocumentMetadata[]; // Cast needed due to Date to string conversion for response
};


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Basic pagination and ordering parameters (example)
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const orderBy = searchParams.get('orderBy') || 'uploadedAt';
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'desc' | 'asc';
    // In a real implementation, validate orderBy against allowed fields

    // --- Real Firestore Logic (conceptual) ---
    // const db = getFirestore();
    // let query: admin.firestore.Query = db.collection('apiDocuments');
    // query = query.orderBy(orderBy, orderDirection);
    // if (limit) {
    //   query = query.limit(limit);
    // }
    // // For pagination with startAfter:
    // // const lastVisibleDocId = searchParams.get('startAfter');
    // // if (lastVisibleDocId) {
    // //   const lastDoc = await db.collection('apiDocuments').doc(lastVisibleDocId).get();
    // //   if (lastDoc.exists) {
    // //     query = query.startAfter(lastDoc);
    // //   }
    // // }
    // const snapshot = await query.get();
    // if (snapshot.empty) {
    //   return NextResponse.json([], { status: 200 });
    // }
    // const documents: ApiDocumentMetadata[] = snapshot.docs.map(doc => {
    //   const data = doc.data();
    //   return {
    //     id: doc.id,
    //     ...data,
    //     // Convert Firestore Timestamps to ISO strings or Date objects for the client
    //     uploadedAt: (data.uploadedAt as Timestamp).toDate().toISOString(),
    //     lastModifiedAt: data.lastModifiedAt ? (data.lastModifiedAt as Timestamp).toDate().toISOString() : undefined,
    //   } as ApiDocumentMetadata; // Ensure all fields match
    // });
    // --- End Real Firestore Logic ---

    // Using mock function
    const documents = await mockFetchDocumentsFromFirestore(limit, orderBy, orderDirection);

    return NextResponse.json(documents, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching API documents:', error);
    return NextResponse.json({ error: 'Failed to fetch API documents.', details: error.message || String(error) }, { status: 500 });
  }
}

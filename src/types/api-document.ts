// src/types/api-document.ts

/**
 * Represents the detected or specified format of an API documentation file.
 */
export type ApiDocumentFormat =
  | "openapi-json"
  | "openapi-yaml"
  | "postman-collection"
  // Potentially others like AsyncAPI, GraphQL Schema, etc.
  | "unknown";

/**
 * Represents the metadata for an uploaded API document in the inventory.
 * This information would typically be stored in a Firestore collection.
 */
export interface ApiDocumentMetadata {
  /** Unique Firestore document ID for this metadata entry. */
  id: string;

  /** Original name of the uploaded file (e.g., "petstore.yaml"). */
  fileName: string;

  /**
   * Extracted or user-provided title for the API document.
   * For OpenAPI, this would typically come from the `info.title` field.
   */
  title?: string;

  /**
   * Extracted or user-provided version for the API document.
   * For OpenAPI, this would typically come from the `info.version` field.
   */
  version?: string;

  /** Detected or user-specified format of the API document. */
  format: ApiDocumentFormat;

  /** Full path to the raw API document file in Firebase Storage (e.g., "api-documents/{userId}/{documentId}/{fileName}"). */
  storagePath: string;

  /** Temporary download URL for accessing the file. Populated on demand, not typically stored in Firestore. */
  downloadUrl?: string;

  /** User ID (from Firebase Auth) of the user who uploaded this document. */
  uploadedBy: string;

  /**
   * Timestamp of when the document was uploaded.
   * For direct Firestore backend models, `firebase.firestore.Timestamp` is preferred.
   * Using `Date` here for broader client/server compatibility without direct SDK dependency.
   */
  uploadedAt: Date; // firebase.firestore.Timestamp;

  /**
   * Timestamp of when the document metadata or file was last modified.
   * For direct Firestore backend models, `firebase.firestore.Timestamp` is preferred.
   */
  lastModifiedAt?: Date; // firebase.firestore.Timestamp;

  /** Optional: Identifier for a team or organization if using multi-tenancy. */
  teamId?: string;

  /** Optional: Identifier for a project this document might be associated with. */
  projectId?: string;

  /** A short description of the API, extracted from the document or user-provided. */
  description?: string;

  /** Tags associated with the API document for categorization and filtering. */
  tags?: string[];

  // Future considerations:
  // processingStatus?: 'pending' | 'processed' | 'error';
  // processingError?: string;
  // linkedApiId?: string; // If this document is linked to a specific API in the catalog
}

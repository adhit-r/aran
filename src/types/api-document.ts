export type ApiDocumentFormat = "openapi-json" | "openapi-yaml" | "postman-collection" | "unknown";

// This interface is also used by the API Catalog if it includes 'method'
// and is relevant for the overall data structure.
export interface ApiEntry { // Also serves as a base for API Catalog items
  id: string;
  name: string;
  endpoint: string;
  method?: string; // Added for API Catalog Tree View & Detail Modal
  category?: string; // From original ApiCatalogPage
  owner?: string;    // From original ApiCatalogPage
  status?: "active" | "deprecated" | "development"; // From original ApiCatalogPage
  documentationUrl?: string; // From original ApiCatalogPage
}

export interface ApiDocumentMetadata extends ApiEntry { // Extends ApiEntry for shared fields
  fileName: string;
  title?: string;
  version?: string;
  format: ApiDocumentFormat;

  storagePath: string;
  downloadUrl?: string;

  uploadedBy: string;
  uploadedAt: Date; // Using Date for simplicity here, can be Firestore Timestamp on backend
  lastModifiedAt?: Date;

  teamId?: string;
  projectId?: string;

  description?: string;
  tags?: string[];
}

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ApiDocumentUpload } from '@/components/api-documentation/ApiDocumentUpload';
import { ApiDocumentList } from '@/components/api-documentation/ApiDocumentList';
import { ApiDocumentMetadata } from '@/types/api-document';
import { toast } from "sonner";
import { ApiDocumentDetailModal } from '@/components/api-documentation/ApiDocumentDetailModal';
// Dialog components are used within ApiDocumentDetailModal, no need for direct import here unless used separately.


export default function ApiDocumentationPage() {
  const [apiDocuments, setApiDocuments] = useState<ApiDocumentMetadata[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(true);
  const [fetchDocsError, setFetchDocsError] = useState<string | null>(null);

  // State for the detail modal (to be fully implemented in sub-step 3.4)
  const [selectedDocumentForModal, setSelectedDocumentForModal] = useState<ApiDocumentMetadata | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const fetchApiDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    setFetchDocsError(null);
    try {
      const response = await fetch('/api/api-documents');
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `Failed to fetch documents: ${response.status}`);
      }
      const data: ApiDocumentMetadata[] = await response.json();
      setApiDocuments(data);
    } catch (error: any) {
      console.error("Error fetching API documents:", error);
      setFetchDocsError(error.message || "An unexpected error occurred.");
      toast.error("Failed to load API documents.", { description: error.message });
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    fetchApiDocuments();
  }, [fetchApiDocuments]);

  const handleUploadSuccess = (uploadedDocument: ApiDocumentMetadata) => {
    console.log("Upload successful on page:", uploadedDocument);
    toast.success(`Document "${uploadedDocument.fileName}" uploaded successfully!`, {
      description: `ID: ${uploadedDocument.id}, Format: ${uploadedDocument.format}`,
    });
    fetchApiDocuments(); // Refresh the list after successful upload
  };

  const handleSelectDocument = (document: ApiDocumentMetadata) => {
    // Fetch the full document details (including a fresh downloadUrl) before opening the modal.
    const fetchFullDocumentDetails = async () => {
      try {
        // Consider adding a page-level loading state here if this fetch is slow
        // For example, a small spinner next to the item clicked or a general page overlay
        toast.loading("Fetching document details...", { id: "loading-doc-details"});
        const response = await fetch(`/api/api-documents/${document.id}`);
        toast.dismiss("loading-doc-details");

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.error || `Failed to fetch document details: ${response.status}`);
        }
        const fullDocumentData: ApiDocumentMetadata = await response.json();
        setSelectedDocumentForModal(fullDocumentData);
        setIsDetailModalOpen(true);
      } catch (error: any) {
        toast.dismiss("loading-doc-details");
        console.error("Error fetching full document details:", error);
        toast.error("Failed to load document details.", { description: error.message });
        // Optionally, open modal with existing (possibly stale) data or don't open if critical fields are missing
        // For this example, we'll open with potentially stale 'document' if fetch fails but it exists
        // Or better, ensure that the `downloadUrl` is always present if we decide to open.
        // If `downloadUrl` is critical and might be missing from the list item, then perhaps don't open.
        // For now, let's assume we open with what we have if the fetch fails after selection.
        // setSelectedDocumentForModal(document);
        // setIsDetailModalOpen(true);
      }
    };
    fetchFullDocumentDetails();
  };


  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <header className="mb-0"> {/* Reduced margin bottom as gap-8 on parent handles it */}
        <h1 className="font-headline text-3xl font-semibold">API Document Inventory</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and explore your API specification documents. Upload new documents,
          view existing ones, and (soon) render OpenAPI/Swagger specifications.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Changed md to lg for breakpoint */}
        <div className="lg:col-span-1">
          <ApiDocumentUpload onUploadSuccess={handleUploadSuccess} className="sticky top-6" />
        </div>

        <div className="lg:col-span-2">
          <ApiDocumentList
            documents={apiDocuments}
            isLoading={isLoadingDocs}
            error={fetchDocsError}
            onSelectDocument={handleSelectDocument}
          />
        </div>
      </div>

      {/* Detail Modal */}
      <ApiDocumentDetailModal
        document={selectedDocumentForModal}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          // It's good practice to clear the selected document when modal closes,
          // ensuring fresh data is loaded next time, or that stale data isn't accidentally shown.
          setSelectedDocumentForModal(null);
        }}
      />
    </div>
  );
}

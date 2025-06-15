"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ApiDocumentUpload } from '@/components/api-documentation/ApiDocumentUpload';
import { ApiDocumentList } from '@/components/api-documentation/ApiDocumentList';
import { ApiDocumentMetadata } from '@/types/api-document';
import { toast } from "sonner";
import { ApiDocumentDetailModal } from '@/components/api-documentation/ApiDocumentDetailModal';

interface PaginationState {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  pageCount: number;
}

export default function ApiDocumentationPage() {
  const [apiDocuments, setApiDocuments] = useState<ApiDocumentMetadata[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(true);
  const [fetchDocsError, setFetchDocsError] = useState<string | null>(null);

  const [selectedDocumentForModal, setSelectedDocumentForModal] = useState<ApiDocumentMetadata | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    limit: 10, // Default items per page
    offset: 0,
    currentPage: 1,
    pageCount: 0,
  });

  const fetchApiDocuments = useCallback(async (pageNumber: number = 1) => {
    setIsLoadingDocs(true);
    setFetchDocsError(null);
    const currentLimit = pagination.limit; // Use current limit from state
    const offset = (pageNumber - 1) * currentLimit;

    try {
      // TODO: Add other query params like orderBy, orderDirection, filters if needed
      const response = await fetch(`/api/api-documents?limit=${currentLimit}&offset=${offset}`);
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `Failed to fetch documents: ${response.status}`);
      }
      const result: { data: ApiDocumentMetadata[]; pagination: PaginationState } = await response.json();
      setApiDocuments(result.data);
      setPagination(result.pagination);
    } catch (error: any) {
      console.error("Error fetching API documents:", error);
      setFetchDocsError(error.message || "An unexpected error occurred.");
      // Do not show toast here for initial load, ApiDocumentList will show error state
      // toast.error("Failed to load API documents.", { description: error.message });
    } finally {
      setIsLoadingDocs(false);
    }
  }, [pagination.limit]); // Dependency on pagination.limit if it can change

  useEffect(() => {
    fetchApiDocuments(1); // Fetch first page on initial load
  }, [fetchApiDocuments]);

  const handleUploadSuccess = (uploadedDocument: ApiDocumentMetadata) => {
    console.log("Upload successful on page:", uploadedDocument);
    toast.success(`Document "${uploadedDocument.fileName}" uploaded successfully!`, {
      description: `ID: ${uploadedDocument.id}, Format: ${uploadedDocument.format}`,
    });
    fetchApiDocuments(1); // Refresh the list, go to first page to see the new item (assuming default sort by new)
  };

  const handleSelectDocument = (document: ApiDocumentMetadata) => {
    const fetchFullDocumentDetails = async () => {
      try {
        toast.loading("Fetching document details...", { id: "loading-doc-details"});
        // The file serving endpoint now returns the file content directly, not metadata + downloadUrl
        // The ApiDocumentDetailModal will use document.id to construct the file URL if needed,
        // or use document.storagePath if we decide to make that directly usable (e.g. via a GET route that serves based on storagePath)
        // For now, the modal primarily needs the metadata. The downloadUrl for the *original* file could be generated
        // by a separate API if we don't want to expose storagePath directly or need signed URLs.
        // The current /api/api-documents/[documentId] route returns metadata WITHOUT downloadUrl.
        // The modal will need the document.id to construct the file content URL: /api/api-documents/file/[document.id]

        // No need to re-fetch metadata if the list item already has all required fields for the modal.
        // The downloadUrl for the spec content is now implicitly /api/api-documents/file/{document.id}
        // So, we can just use the document object passed from the list.
        // However, the prompt for the modal suggested it would fetch from document.downloadUrl.
        // Let's stick to the design where the modal gets the *metadata* and constructs its own fetch URL for content.
        // The `document` object from the list should be sufficient for the modal's metadata display.
        // The special downloadUrl for the SwaggerUI component to fetch spec content is /api/api-documents/file/{document.id}

        const documentWithPotentialDownloadUrl = {
            ...document,
            // This is the URL the SwaggerUI component inside the modal will use to fetch the spec content
            downloadUrl: `/api/api-documents/file/${document.id}`
        };

        setSelectedDocumentForModal(documentWithPotentialDownloadUrl);
        setIsDetailModalOpen(true);
        toast.dismiss("loading-doc-details"); // Dismiss loading toast only after modal state is set
      } catch (error: any) { // This catch block might not be strictly necessary if not re-fetching
        toast.dismiss("loading-doc-details");
        console.error("Error preparing document details for modal:", error);
        toast.error("Failed to prepare document details for modal.", { description: error.message });
      }
    };
    fetchFullDocumentDetails(); // Call the async function
  };

  const handlePageChange = (newPage: number) => {
    fetchApiDocuments(newPage);
  };


  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <header className="mb-0">
        <h1 className="font-headline text-3xl font-semibold">API Document Inventory</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and explore your API specification documents. Upload new documents,
          view existing ones, and render OpenAPI/Swagger specifications.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ApiDocumentUpload onUploadSuccess={handleUploadSuccess} className="sticky top-6" />
        </div>

        <div className="lg:col-span-2">
          <ApiDocumentList
            documents={apiDocuments}
            isLoading={isLoadingDocs}
            error={fetchDocsError}
            onSelectDocument={handleSelectDocument}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <ApiDocumentDetailModal
        document={selectedDocumentForModal}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDocumentForModal(null);
        }}
      />
    </div>
  );
}

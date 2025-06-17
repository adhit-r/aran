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
    limit: 10,
    offset: 0,
    currentPage: 1,
    pageCount: 0,
  });

  const fetchApiDocuments = useCallback(async (pageNumber: number = 1) => {
    setIsLoadingDocs(true);
    setFetchDocsError(null);
    const currentLimit = pagination.limit;
    const offset = (pageNumber - 1) * currentLimit;

    try {
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
      // Removed toast from here to avoid duplicate error display with ApiDocumentList
    } finally {
      setIsLoadingDocs(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    fetchApiDocuments(1);
  }, [fetchApiDocuments]);

  const handleUploadSuccess = (uploadedDocument: ApiDocumentMetadata) => {
    console.log("Upload successful on page:", uploadedDocument);
    toast.success(`Document "${uploadedDocument.fileName}" uploaded successfully!`, {
      description: `ID: ${uploadedDocument.id}, Format: ${uploadedDocument.format}`,
    });
    fetchApiDocuments(1);
  };

  const handleSelectDocument = (document: ApiDocumentMetadata) => {
    const fetchFullDocumentDetails = async () => {
      try {
        toast.loading("Fetching document details...", { id: "loading-doc-details"});
        const response = await fetch(`/api/api-documents/${document.id}`);
        toast.dismiss("loading-doc-details");

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.error || `Failed to fetch document details: ${response.status}`);
        }
        const fullDocumentData: ApiDocumentMetadata = await response.json();
        // The modal itself will construct the /api/api-documents/file/ID URL
        // So, we pass the metadata which includes the ID.
        setSelectedDocumentForModal(fullDocumentData);
        setIsDetailModalOpen(true);
      } catch (error: any) {
        toast.dismiss("loading-doc-details");
        console.error("Error fetching full document details:", error);
        toast.error("Failed to load document details.", { description: error.message });
      }
    };
    fetchFullDocumentDetails();
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

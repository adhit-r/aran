"use client";

import React, { useState, useEffect } from 'react';
import { ApiDocumentMetadata } from '@/types/api-document';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Added DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Download, FileWarning } from 'lucide-react';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css"; // Import Swagger UI styles
import YAML from 'js-yaml'; // For parsing YAML

interface ApiDocumentDetailModalProps {
  document: ApiDocumentMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApiDocumentDetailModal({ document, isOpen, onClose }: ApiDocumentDetailModalProps) {
  const [specContent, setSpecContent] = useState<any | null>(null);
  const [isLoadingSpec, setIsLoadingSpec] = useState<boolean>(false);
  const [fetchSpecError, setFetchSpecError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && document && document.downloadUrl && (document.format === 'openapi-json' || document.format === 'openapi-yaml')) {
      const fetchSpec = async () => {
        setIsLoadingSpec(true);
        setFetchSpecError(null);
        setSpecContent(null);
        try {
          const response = await fetch(document.downloadUrl!);
          if (!response.ok) {
            throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
          }
          const rawContent = await response.text();
          if (document.format === 'openapi-yaml') {
            setSpecContent(YAML.load(rawContent));
          } else {
            setSpecContent(JSON.parse(rawContent));
          }
        } catch (error: any) {
          console.error("Error fetching or parsing spec:", error);
          setFetchSpecError(error.message || "Could not load or parse the API specification.");
        } finally {
          setIsLoadingSpec(false);
        }
      };
      fetchSpec();
    } else {
      // Clear spec if modal is closed, document is null, or not a supported format for rendering
      setSpecContent(null);
      setIsLoadingSpec(false);
      setFetchSpecError(null);
    }
  }, [document, isOpen]); // Rerun effect when document or isOpen state changes

  if (!document) {
    return null;
  }

  const getFormatBadgeVariant = (format: ApiDocumentMetadata['format']) => {
    switch (format) {
      case 'openapi-json': return 'default';
      case 'openapi-yaml': return 'secondary';
      case 'postman-collection': return 'outline';
      default: return 'destructive';
    }
  };

  const handleDownload = () => {
    if (document?.downloadUrl) {
        // Create a temporary link to trigger the download with the original filename
        const link = document.createElement('a');
        link.href = document.downloadUrl;
        // Potentially add target="_blank" and rel="noopener noreferrer" if direct download is problematic
        // Forcing download with original filename often requires server-side Content-Disposition header
        // or more complex client-side blob handling. A direct link usually works if server sends correct headers.
        // As a fallback, it might open in a new tab.
        link.setAttribute('download', document.fileName || 'api-document'); // Suggest filename
        link.target = '_blank'; // Open in new tab as a fallback behavior
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="truncate pr-10">{document.title || document.fileName}</DialogTitle>
          <DialogDescription>
            Version: {document.version || "-"} | Format:
            <Badge variant={getFormatBadgeVariant(document.format)} className="ml-1 text-xs">
              {document.format}
            </Badge>
            | Uploaded: {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : '-'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto py-4 pr-2 custom-scrollbar"> {/* Added custom-scrollbar if defined globally */}
          {isLoadingSpec && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading specification...</p>
            </div>
          )}
          {fetchSpecError && (
            <div className="text-red-600 dark:text-red-400 p-4 border border-red-600/50 bg-red-500/10 rounded-md flex flex-col items-center justify-center h-full">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Error loading specification:</p>
              <p className="text-sm text-center">{fetchSpecError}</p>
            </div>
          )}
          {!isLoadingSpec && !fetchSpecError && specContent && (document.format === 'openapi-json' || document.format === 'openapi-yaml') && (
            <div className="swagger-ui-container bg-background text-foreground">
              <SwaggerUI spec={specContent} />
            </div>
          )}
          {!isLoadingSpec && !fetchSpecError && !specContent && (document.format === 'openapi-json' || document.format === 'openapi-yaml') && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <FileWarning className="h-10 w-10 mb-3" />
                <p className="font-semibold">No content to display.</p>
                <p className="text-sm text-center">The document might be empty or could not be loaded.</p>
             </div>
          )}
          {!isLoadingSpec && !fetchSpecError && document.format === 'postman-collection' && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <FileWarning className="h-10 w-10 mb-3" />
              <p className="font-semibold">Postman Collection</p>
              <p className="text-sm text-center">Live preview is not available for Postman Collections. Please download the file and import it into Postman.</p>
            </div>
          )}
          {!isLoadingSpec && !fetchSpecError && document.format === 'unknown' && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <FileWarning className="h-10 w-10 mb-3" />
              <p className="font-semibold">Unknown Document Format</p>
              <p className="text-sm text-center">Preview is not available for this file type.</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={handleDownload} disabled={!document.downloadUrl}>
            <Download className="mr-2 h-4 w-4" /> Download Original
          </Button>
          <DialogClose asChild>
            <Button variant="default">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

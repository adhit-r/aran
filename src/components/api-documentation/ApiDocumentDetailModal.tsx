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
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Download, FileWarning } from 'lucide-react';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import YAML from 'js-yaml';

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
    if (isOpen && document && document.id && (document.format === 'openapi-json' || document.format === 'openapi-yaml')) {
      const specContentUrl = `/api/api-documents/file/${document.id}`;
      const fetchSpec = async () => {
        setIsLoadingSpec(true);
        setFetchSpecError(null);
        setSpecContent(null);
        try {
          const response = await fetch(specContentUrl);
          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}. Server says: ${errorBody}`);
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
      setSpecContent(null);
      setIsLoadingSpec(false);
      setFetchSpecError(null);
    }
  }, [document, isOpen]);

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

  const downloadButtonUrl = document?.id ? `/api/api-documents/file/${document.id}` : '#';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl h-[90vh] flex flex-col">
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

        <div className="flex-grow overflow-y-auto py-4 pr-2 custom-scrollbar">
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
                <p className="font-semibold">No content to display or preview not applicable.</p>
                <p className="text-sm text-center">The document might be empty, could not be loaded, or is not an OpenAPI specification.</p>
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
          <Button variant="outline" asChild disabled={!document?.id}>
            <a href={downloadButtonUrl} download={document.fileName}>
              <Download className="mr-2 h-4 w-4" /> Download Original
            </a>
          </Button>
          <DialogClose asChild>
            <Button variant="default">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

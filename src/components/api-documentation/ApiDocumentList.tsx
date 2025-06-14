"use client";

import React from 'react';
import { ApiDocumentMetadata } from '@/types/api-document';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Loader2, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns'; // Assuming date-fns is available or will be added

interface ApiDocumentListProps {
  documents: ApiDocumentMetadata[];
  isLoading: boolean;
  error: string | null;
  onSelectDocument: (document: ApiDocumentMetadata) => void;
  // onDownloadDocument is implicitly handled by onSelectDocument which provides downloadUrl
  className?: string;
}

export function ApiDocumentList({
  documents,
  isLoading,
  error,
  onSelectDocument,
  className,
}: ApiDocumentListProps) {

  const getFormatBadgeVariant = (format: ApiDocumentMetadata['format']) => {
    switch (format) {
      case 'openapi-json': return 'default';
      case 'openapi-yaml': return 'secondary';
      case 'postman-collection': return 'outline';
      default: return 'destructive'; // for 'unknown'
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60 border rounded-md bg-background shadow-sm p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-60 border border-red-500/50 bg-red-500/10 rounded-md p-6 text-red-700 dark:text-red-400">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="font-semibold">Error loading documents:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 border rounded-md bg-background shadow-sm p-6">
        <Info className="h-8 w-8 mb-3 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">No API documents found.</p>
        <p className="text-sm text-muted-foreground">Upload a document to get started.</p>
      </div>
    );
  }

  return (
    <div className={`border rounded-md bg-background shadow-sm ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Version</TableHead>
            <TableHead>Format</TableHead>
            <TableHead className="hidden md:table-cell">File Name</TableHead>
            <TableHead className="hidden lg:table-cell">Uploaded At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium truncate max-w-xs" title={doc.title || doc.fileName}>
                {doc.title || doc.fileName}
              </TableCell>
              <TableCell className="hidden sm:table-cell">{doc.version || '-'}</TableCell>
              <TableCell>
                <Badge variant={getFormatBadgeVariant(doc.format)} className="text-xs">
                  {doc.format}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell truncate max-w-xs" title={doc.fileName}>{doc.fileName}</TableCell>
              <TableCell className="hidden lg:table-cell text-sm">
                {doc.uploadedAt ? format(new Date(doc.uploadedAt), 'MMM dd, yyyy HH:mm') : '-'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectDocument(doc)}
                  title="View Details / Download"
                >
                  <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Details</span>
                </Button>
                {/* Direct download button can be added here if needed, using doc.downloadUrl if pre-fetched */}
                {/* For now, selecting the document will show details and provide download option */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ApiDocumentMetadata } from '@/types/api-document'; // Assuming this path is correct

interface ApiDocumentUploadProps {
  onUploadSuccess?: (uploadedDocument: ApiDocumentMetadata) => void;
  className?: string;
}

export function ApiDocumentUpload({ onUploadSuccess, className }: ApiDocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // To reset the file input

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null); // Clear previous errors on new file selection
      setUploadSuccess(null); // Clear previous success message
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/api-documents/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Upload failed with status: ${response.status}`);
      }

      setUploadSuccess(`File uploaded successfully: ${result.fileName} (ID: ${result.id})`);
      if (onUploadSuccess) {
        onUploadSuccess(result as ApiDocumentMetadata);
      }
      setSelectedFile(null); // Clear the selection
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input field
      }

    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UploadCloud className="mr-2 h-5 w-5" /> Upload API Document
        </CardTitle>
        <CardDescription>
          Select an API specification file (e.g., OpenAPI JSON/YAML, Postman Collection). Max 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="api-doc-file" className="sr-only">Choose file</Label>
          <Input
            id="api-doc-file"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,.yaml,.yml" // Basic client-side filter
            className="block w-full text-sm text-slate-500 dark:text-slate-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-primary/10 file:text-primary
                       dark:file:bg-primary/20 dark:file:text-primary
                       hover:file:bg-primary/20 dark:hover:file:bg-primary/30
                       cursor-pointer"
          />
        </div>

        {selectedFile && (
          <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/30 flex items-center">
            <FileText className="h-5 w-5 mr-2 shrink-0 text-primary" />
            <div className="flex-grow">
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-xs"> ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
            </div>
          </div>
        )}

        <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>

        {uploadError && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400 p-3 border border-red-600/50 bg-red-500/10 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
            {uploadError}
          </div>
        )}
        {uploadSuccess && (
          <div className="mt-2 text-sm text-green-600 dark:text-green-400 p-3 border border-green-600/50 bg-green-500/10 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 shrink-0" />
            {uploadSuccess}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

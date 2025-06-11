
"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { discoverApisAction, type DiscoverApisActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Discover APIs
    </Button>
  );
}

export default function ApiDiscoveryPage() {
  const initialState: DiscoverApisActionState = { message: "" };
  const [state, formAction] = useFormState(discoverApisAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.message && !state.error && !state.inputErrors) {
      // Optionally reset form or parts of it on success, if desired
      // formRef.current?.reset(); 
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-semibold">Smart API Discovery</h1>
      <p className="text-muted-foreground">
        Automatically discover and categorize APIs based on traffic and patterns. Paste your API traffic data below.
      </p>

       <Alert variant="default" className="bg-blue-900/20 border-blue-700 text-blue-300 [&>svg]:text-blue-400">
        <Info className="h-4 w-4" />
        <AlertTitle>Data Privacy Notice</AlertTitle>
        <AlertDescription>
          If your API traffic data (e.g., logs, HAR files) contains PII, CPNI, or other sensitive information within 
          request/response payloads, ensure it is appropriately masked or redacted <strong className="font-semibold">before submission</strong>. 
          This application sends the provided data to an AI model for analysis. 
          Properly sanitizing sensitive data is crucial for compliance with data privacy regulations.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Input Traffic Data</CardTitle>
          <CardDescription>
            Provide API traffic data, including endpoint URLs, request/response structures, and security protocols.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="trafficData" className="mb-2 block">Traffic Data (e.g., logs, HAR file content)</Label>
              <Textarea
                id="trafficData"
                name="trafficData"
                rows={10}
                placeholder="Paste your API traffic data here..."
                className="font-code"
              />
              {state.inputErrors?.find(err => err.path.includes("trafficData")) && (
                 <p className="text-sm text-destructive mt-1">
                    {state.inputErrors.find(err => err.path.includes("trafficData"))?.message}
                </p>
              )}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.message && !state.error && state.discoveredApis && (
        <Alert variant="default" className="bg-accent/30 border-accent">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Discovery Complete!</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state.error && (
         <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.discoveredApis && state.discoveredApis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Discovered APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Security Protocols</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.discoveredApis.map((api, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium font-code">{api.endpoint}</TableCell>
                    <TableCell>{api.category}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{api.description}</TableCell>
                    <TableCell>{api.securityProtocols}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {state.discoveredApis && state.discoveredApis.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No APIs were discovered based on the provided data.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

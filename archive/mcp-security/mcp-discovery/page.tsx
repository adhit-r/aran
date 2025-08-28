"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { discoverMcpsAction, type DiscoverMcpsActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Terminal, Info, Network, Cpu, Shield } from "lucide-react";
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
      Discover MCP Implementations
    </Button>
  );
}

export default function MCPDiscoveryPage() {
  const initialState: DiscoverMcpsActionState = { message: "" };
  const [state, formAction] = useFormState(discoverMcpsAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.message && !state.error && !state.inputErrors) {
      // Optionally reset form or parts of it on success, if desired
      // formRef.current?.reset(); 
    }
  }, [state]);

  const getSecurityLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'monitoring': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-semibold">MCP Discovery</h1>
      <p className="text-muted-foreground">
        Automatically discover and analyze Model Context Protocol (MCP) implementations within the observed environment.
      </p>

      <Alert variant="default" className="bg-blue-900/20 border-blue-700 text-blue-300 [&>svg]:text-blue-400">
        <Info className="h-4 w-4" />
        <AlertTitle>Data Processing Notice</AlertTitle>
        <AlertDescription>
          Your MCP traffic data is processed locally using pattern matching and rule-based analysis. 
          No data is sent to external AI services. However, ensure sensitive information is 
          appropriately masked or redacted <strong className="font-semibold">before submission</strong> 
          for compliance with data privacy regulations.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Input MCP Traffic Data</CardTitle>
          <CardDescription>
            Provide MCP traffic data, including endpoint URLs, request/response structures, and AI tool interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="trafficData" className="mb-2 block">MCP Traffic Data (e.g., logs, HAR file content)</Label>
              <Textarea
                id="trafficData"
                name="trafficData"
                rows={10}
                placeholder="Paste your MCP traffic data here... Example:
GET /mcp/github/repos HTTP/1.1
POST /mcp/db/query HTTP/1.1
Content-Type: application/json
{ 'query': 'SELECT * FROM users' }

GET /mcp/fs/read HTTP/1.1
{ 'path': '/etc/passwd' }"
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

      {state.message && !state.error && state.discoveredMcps && (
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

      {state.discoveredMcps && state.discoveredMcps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Discovered MCP Implementations
            </CardTitle>
            <CardDescription>
              Found {state.discoveredMcps.length} MCP implementation(s) in the provided traffic data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Endpoints</TableHead>
                  <TableHead>Data Sources</TableHead>
                  <TableHead>AI Actions</TableHead>
                  <TableHead>Security Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.discoveredMcps.map((mcp) => (
                  <TableRow key={mcp.id}>
                    <TableCell className="font-medium">{mcp.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{mcp.description}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {mcp.endpoints.slice(0, 2).map((endpoint, index) => (
                          <div key={index} className="text-xs font-mono bg-muted p-1 rounded">
                            {endpoint}
                          </div>
                        ))}
                        {mcp.endpoints.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{mcp.endpoints.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {mcp.dataSources.slice(0, 2).map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                        {mcp.dataSources.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{mcp.dataSources.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {mcp.actions.slice(0, 2).map((action, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs">
                            <Cpu className="h-3 w-3 text-muted-foreground" />
                            {action}
                          </div>
                        ))}
                        {mcp.actions.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{mcp.actions.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSecurityLevelBadgeVariant(mcp.securityLevel)} className="capitalize">
                        {mcp.securityLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(mcp.status)} className="capitalize">
                        {mcp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            MCP Security Considerations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Authentication & Authorization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Verify AI application credentials</li>
                <li>• Implement proper access controls</li>
                <li>• Monitor AI-tool interactions</li>
                <li>• Use role-based permissions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Data Privacy</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Audit data access patterns</li>
                <li>• Implement data masking</li>
                <li>• Monitor sensitive data flows</li>
                <li>• Enforce data retention policies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

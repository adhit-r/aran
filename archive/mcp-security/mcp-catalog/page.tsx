
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Network, 
  Cpu, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Plus,
  Search
} from "lucide-react";

export default function MCPCatalogPage() {
  // Mock data for MCP implementations
  const mcpImplementations = [
    {
      id: "mcp-1",
      name: "GitHub MCP Server",
      description: "Model Context Protocol server for GitHub integration",
      status: "active",
      securityLevel: "high",
      endpoints: ["/mcp/github/repos", "/mcp/github/issues"],
      lastUpdated: "2024-01-15",
      aiAccess: true,
      dataSources: ["GitHub API", "Repository metadata"],
      actions: ["Read repositories", "Create issues", "Update files"]
    },
    {
      id: "mcp-2", 
      name: "Database MCP Connector",
      description: "MCP implementation for database access and queries",
      status: "active",
      securityLevel: "critical",
      endpoints: ["/mcp/db/query", "/mcp/db/schema"],
      lastUpdated: "2024-01-10",
      aiAccess: true,
      dataSources: ["PostgreSQL", "MySQL", "MongoDB"],
      actions: ["Execute queries", "Read schemas", "Modify data"]
    },
    {
      id: "mcp-3",
      name: "File System MCP",
      description: "File system access through Model Context Protocol",
      status: "monitoring",
      securityLevel: "medium",
      endpoints: ["/mcp/fs/read", "/mcp/fs/write"],
      lastUpdated: "2024-01-12",
      aiAccess: true,
      dataSources: ["Local filesystem", "Network drives"],
      actions: ["Read files", "Write files", "List directories"]
    },
    {
      id: "mcp-4",
      name: "Calendar MCP Integration",
      description: "Calendar and scheduling MCP implementation",
      status: "active",
      securityLevel: "medium",
      endpoints: ["/mcp/calendar/events", "/mcp/calendar/schedule"],
      lastUpdated: "2024-01-08",
      aiAccess: true,
      dataSources: ["Google Calendar", "Outlook Calendar"],
      actions: ["Read events", "Create events", "Update schedules"]
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'monitoring': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  const getSecurityLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Model Context Protocol Catalog</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your Model Context Protocol implementations for AI/ML applications.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add MCP Implementation
        </Button>
      </div>

      <Alert variant="default" className="bg-blue-900/20 border-blue-700 text-blue-300 [&>svg]:text-blue-400">
        <Info className="h-4 w-4" />
        <AlertTitle>Model Context Protocol Security</AlertTitle>
        <AlertDescription>
          MCP enables AI applications to access external data and perform actions. Monitor these implementations carefully 
          as they can access sensitive data and perform actions on your systems.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {mcpImplementations.map((mcp) => (
          <Card key={mcp.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Network className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{mcp.name}</CardTitle>
                    <CardDescription>{mcp.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(mcp.status)} className="capitalize">
                    {mcp.status}
                  </Badge>
                  <Badge variant={getSecurityLevelBadgeVariant(mcp.securityLevel)} className="capitalize">
                    {mcp.securityLevel} security
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Endpoints</h4>
                  <div className="space-y-1">
                    {mcp.endpoints.map((endpoint, index) => (
                      <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                        {endpoint}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Data Sources</h4>
                  <div className="space-y-1">
                    {mcp.dataSources.map((source, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">AI Actions</h4>
                <div className="space-y-1">
                  {mcp.actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Cpu className="h-3 w-3 text-muted-foreground" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Last updated: {mcp.lastUpdated}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="mr-2 h-3 w-3" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="mr-2 h-3 w-3" />
                    Security Audit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Security Considerations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Authentication & Authorization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Verify AI application credentials</li>
                <li>• Implement proper access controls</li>
                <li>• Monitor AI-tool interactions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Data Privacy</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Audit data access patterns</li>
                <li>• Implement data masking</li>
                <li>• Monitor sensitive data flows</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

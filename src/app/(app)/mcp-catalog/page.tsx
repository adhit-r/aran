
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Added CardContent and CardHeader
import { PlusCircle, Search, ExternalLink } from "lucide-react";

interface McpEntry {
  id: string;
  name: string;
  protocolIdentifier: string;
  version: string;
  description: string;
  owner: string;
  status: "active" | "experimental" | "deprecated";
  schemaDefinitionUrl?: string;
}

const initialMcps: McpEntry[] = [
  { 
    id: "mcp1", 
    name: "Image Generation Context", 
    protocolIdentifier: "img-gen-ctx/v1.2", 
    version: "1.2.0",
    description: "Context protocol for instructing image generation models, includes parameters for style, resolution, and content.",
    owner: "AI Services Team", 
    status: "active", 
    schemaDefinitionUrl: "https://example.com/schemas/img-gen-ctx-v1.2.json" 
  },
  { 
    id: "mcp2", 
    name: "Text Summarization Task", 
    protocolIdentifier: "txt-sum-task/v0.9", 
    version: "0.9.1",
    description: "Defines the input text and desired output length/style for text summarization models.",
    owner: "NLP Research", 
    status: "experimental", 
  },
   { 
    id: "mcp3", 
    name: "Legacy Query Protocol", 
    protocolIdentifier: "legacy-q-proto/v2.0", 
    version: "2.0.3",
    description: "Older protocol for internal knowledge base queries, scheduled for deprecation.",
    owner: "Archive Systems", 
    status: "deprecated",
    schemaDefinitionUrl: "https://example.com/schemas/legacy-q-v2.json" 
  },
];

export default function McpCatalogPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [mcps, setMcps] = React.useState<McpEntry[]>(initialMcps);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Form state for new MCP
  const [newMcpName, setNewMcpName] = React.useState("");
  const [newMcpProtocolId, setNewMcpProtocolId] = React.useState("");
  const [newMcpVersion, setNewMcpVersion] = React.useState("");
  const [newMcpDescription, setNewMcpDescription] = React.useState("");
  const [newMcpOwner, setNewMcpOwner] = React.useState("");
  const [newMcpStatus, setNewMcpStatus] = React.useState<McpEntry["status"]>("experimental");
  const [newMcpSchemaUrl, setNewMcpSchemaUrl] = React.useState("");


  const filteredMcps = mcps.filter(
    (mcp) =>
      mcp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcp.protocolIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcp.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMcp = () => {
    const newMcp: McpEntry = {
        id: `mcp${mcps.length + 1}`, // Simple ID generation
        name: newMcpName,
        protocolIdentifier: newMcpProtocolId,
        version: newMcpVersion,
        description: newMcpDescription,
        owner: newMcpOwner,
        status: newMcpStatus,
        schemaDefinitionUrl: newMcpSchemaUrl || undefined,
    };
    setMcps([...mcps, newMcp]);
    setIsDialogOpen(false);
    // Reset form fields
    setNewMcpName("");
    setNewMcpProtocolId("");
    setNewMcpVersion("");
    setNewMcpDescription("");
    setNewMcpOwner("");
    setNewMcpStatus("experimental");
    setNewMcpSchemaUrl("");
  };

  const getStatusBadgeVariant = (status: McpEntry["status"]) => {
    switch (status) {
      case "active": return "default"; 
      case "experimental": return "secondary";
      case "deprecated": return "destructive";
      default: return "outline";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">MCP Catalog</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New MCP
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Model Context Protocol (MCP)</DialogTitle>
              <DialogDescription>
                Enter the details for the new MCP to add it to the catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid gap-1.5">
                <Label htmlFor="mcpName">Name</Label>
                <Input id="mcpName" value={newMcpName} onChange={(e) => setNewMcpName(e.target.value)} placeholder="e.g., Image Generation Context v2" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mcpProtocolId">Protocol Identifier</Label>
                <Input id="mcpProtocolId" value={newMcpProtocolId} onChange={(e) => setNewMcpProtocolId(e.target.value)} placeholder="e.g., img-gen-ctx/v2.0" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mcpVersion">Version</Label>
                <Input id="mcpVersion" value={newMcpVersion} onChange={(e) => setNewMcpVersion(e.target.value)} placeholder="e.g., 2.0.1" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mcpDescription">Description</Label>
                <Textarea id="mcpDescription" value={newMcpDescription} onChange={(e) => setNewMcpDescription(e.target.value)} placeholder="Describe the purpose and function of this MCP." />
              </div>
               <div className="grid gap-1.5">
                <Label htmlFor="mcpOwner">Owner</Label>
                <Input id="mcpOwner" value={newMcpOwner} onChange={(e) => setNewMcpOwner(e.target.value)} placeholder="e.g., AI Platform Team" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mcpStatus">Status</Label>
                <Select value={newMcpStatus} onValueChange={(value) => setNewMcpStatus(value as McpEntry["status"])}>
                  <SelectTrigger id="mcpStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="experimental">Experimental</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mcpSchemaUrl">Schema Definition URL (Optional)</Label>
                <Input id="mcpSchemaUrl" value={newMcpSchemaUrl} onChange={(e) => setNewMcpSchemaUrl(e.target.value)} placeholder="https://example.com/schema.json" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleAddMcp}>Add MCP</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search MCPs by name, identifier, description, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      <Card>
        <CardHeader>
             {/* Placeholder for potential future actions like bulk import/export */}
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Identifier</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schema</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredMcps.length > 0 ? (
                filteredMcps.map((mcp) => (
                    <TableRow key={mcp.id}>
                    <TableCell className="font-medium">{mcp.name}</TableCell>
                    <TableCell className="font-code text-sm">{mcp.protocolIdentifier}</TableCell>
                    <TableCell>{mcp.version}</TableCell>
                    <TableCell>{mcp.owner}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(mcp.status)} className="capitalize">{mcp.status}</Badge>
                    </TableCell>
                    <TableCell>
                        {mcp.schemaDefinitionUrl ? (
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                            <a href={mcp.schemaDefinitionUrl} target="_blank" rel="noopener noreferrer">
                            View Schema <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                        ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">
                    No MCPs found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

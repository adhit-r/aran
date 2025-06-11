
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PlusCircle, Search, ExternalLink } from "lucide-react";

interface ApiEntry {
  id: string;
  name: string;
  endpoint: string;
  category: string;
  owner: string;
  status: "active" | "deprecated" | "development";
  documentationUrl: string;
}

const initialApis: ApiEntry[] = [
  { 
    id: "1", 
    name: "JSONPlaceholder API", 
    endpoint: "https://jsonplaceholder.typicode.com/posts", 
    category: "Mock Data/Testing", 
    owner: "Public", 
    status: "active", 
    documentationUrl: "https://jsonplaceholder.typicode.com/" 
  },
  { 
    id: "2", 
    name: "OpenWeatherMap API", 
    endpoint: "https://api.openweathermap.org/data/2.5/weather", 
    category: "Weather", 
    owner: "OpenWeatherMap", 
    status: "active", 
    documentationUrl: "https://openweathermap.org/api" 
  },
  { 
    id: "3", 
    name: "The Cat API", 
    endpoint: "https://api.thecatapi.com/v1/images/search", 
    category: "Animals/Entertainment", 
    owner: "TheCatAPI", 
    status: "active", 
    documentationUrl: "https://docs.thecatapi.com/" 
  },
  { 
    id: "4", 
    name: "Public APIs List", 
    endpoint: "https://api.publicapis.org/entries", 
    category: "API Directory", 
    owner: "Public APIs GitHub", 
    status: "active", 
    documentationUrl: "https://github.com/public-apis/public-apis"
  },
];

export default function ApiCatalogPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [apis, setApis] = React.useState<ApiEntry[]>(initialApis);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Form state for new API
  const [newApiName, setNewApiName] = React.useState("");
  const [newApiEndpoint, setNewApiEndpoint] = React.useState("");
  const [newApiCategory, setNewApiCategory] = React.useState("");
  const [newApiOwner, setNewApiOwner] = React.useState("");
  const [newApiDocsUrl, setNewApiDocsUrl] = React.useState("");


  const filteredApis = apis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddApi = () => {
    const newApi: ApiEntry = {
        id: String(apis.length + 1),
        name: newApiName,
        endpoint: newApiEndpoint,
        category: newApiCategory,
        owner: newApiOwner,
        status: "development",
        documentationUrl: newApiDocsUrl
    };
    setApis([...apis, newApi]);
    setIsDialogOpen(false);
    // Reset form fields
    setNewApiName("");
    setNewApiEndpoint("");
    setNewApiCategory("");
    setNewApiOwner("");
    setNewApiDocsUrl("");
  };

  const getStatusBadgeVariant = (status: ApiEntry["status"]) => {
    switch (status) {
      case "active": return "default"; 
      case "deprecated": return "destructive";
      case "development": return "secondary";
      default: return "outline";
    }
  }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">API Catalog</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New API
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New API</DialogTitle>
              <DialogDescription>
                Enter the details for the new API to add it to the catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newApiName} onChange={(e) => setNewApiName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endpoint" className="text-right">Endpoint</Label>
                <Input id="endpoint" value={newApiEndpoint} onChange={(e) => setNewApiEndpoint(e.target.value)} className="col-span-3" placeholder="/v1/example" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input id="category" value={newApiCategory} onChange={(e) => setNewApiCategory(e.target.value)} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="owner" className="text-right">Owner</Label>
                <Input id="owner" value={newApiOwner} onChange={(e) => setNewApiOwner(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="docsUrl" className="text-right">Docs URL</Label>
                <Input id="docsUrl" value={newApiDocsUrl} onChange={(e) => setNewApiDocsUrl(e.target.value)} className="col-span-3" placeholder="/docs/my-api" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleAddApi}>Add API</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search APIs by name, endpoint, category, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documentation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApis.length > 0 ? (
              filteredApis.map((api) => (
                <TableRow key={api.id}>
                  <TableCell className="font-medium">{api.name}</TableCell>
                  <TableCell className="font-code">{api.endpoint}</TableCell>
                  <TableCell>{api.category}</TableCell>
                  <TableCell>{api.owner}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(api.status)} className="capitalize">{api.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" asChild className="p-0 h-auto">
                      <a href={api.documentationUrl} target="_blank" rel="noopener noreferrer">
                        View Docs <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No APIs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

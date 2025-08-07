
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
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Search, ExternalLink, List, FolderTree, Grid3X3, Download } from "lucide-react";
import { buildApiTree, parseEndpointPath } from '@/lib/api-tree-utils';
import ApiTreeView from '@/components/api-catalog/ApiTreeView';
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdvancedFilters } from '@/components/api-catalog/AdvancedFilters';
import { SortableTableHeader } from '@/components/api-catalog/SortableTableHeader';
import { ApiGridView } from '@/components/api-catalog/ApiGridView';
import { sortApis, filterApis, toggleSortDirection } from '@/lib/api-filtering';
import { 
  SortConfig, 
  FilterConfig, 
  SortField, 
  DEFAULT_FILTER_CONFIG, 
  DEFAULT_SORT_CONFIG 
} from '@/types/filtering';

// Ensure ApiEntry here is compatible with TreeApiEntry, or map it.
// For now, let's make them compatible by adding optional method.
interface ApiEntry {
  id: string;
  name: string;
  endpoint: string;
  method?: string; // Added method
  category: string;
  owner: string;
  status: "active" | "deprecated" | "development";
  documentationUrl: string;
}

const initialApis: ApiEntry[] = [
  {
    id: "1",
    name: "Get Posts",
    endpoint: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    category: "Mock Data/Testing",
    owner: "Public",
    status: "active",
    documentationUrl: "https://jsonplaceholder.typicode.com/"
  },
  {
    id: "2",
    name: "Get Weather",
    endpoint: "https://api.openweathermap.org/data/2.5/weather",
    method: "GET",
    category: "Weather",
    owner: "OpenWeatherMap",
    status: "active",
    documentationUrl: "https://openweathermap.org/api"
  },
  {
    id: "3",
    name: "Search Cat Images",
    endpoint: "https://api.thecatapi.com/v1/images/search",
    method: "GET",
    category: "Animals/Entertainment",
    owner: "TheCatAPI",
    status: "active",
    documentationUrl: "https://docs.thecatapi.com/"
  },
  {
    id: "4",
    name: "List Public APIs",
    endpoint: "https://api.publicapis.org/entries",
    method: "GET",
    category: "API Directory",
    owner: "Public APIs GitHub",
    status: "active",
    documentationUrl: "https://github.com/public-apis/public-apis"
  },
  // More diverse paths for tree testing
  {
    id: "5",
    name: "Get User Details",
    endpoint: "/api/v1/users/{userId}",
    method: "GET",
    category: "User Management",
    owner: "Internal Team",
    status: "active",
    documentationUrl: "/docs/users/get-user",
  },
  {
    id: "6",
    name: "Update User Profile",
    endpoint: "/api/v1/users/{userId}/profile",
    method: "PUT",
    category: "User Management",
    owner: "Internal Team",
    status: "development",
    documentationUrl: "/docs/users/update-profile",
  },
  {
    id: "7",
    name: "List Products",
    endpoint: "/api/v1/products",
    method: "GET",
    category: "E-commerce",
    owner: "Product Team",
    status: "active",
    documentationUrl: "/docs/products/list",
  },
   {
    id: "8",
    name: "Create Product",
    endpoint: "/api/v1/products",
    method: "POST",
    category: "E-commerce",
    owner: "Product Team",
    status: "active",
    documentationUrl: "/docs/products/create",
  },
  {
    id: "9",
    name: "Root Endpoint API",
    endpoint: "/",
    method: "GET",
    category: "Core",
    owner: "Platform Team",
    status: "active",
    documentationUrl: "/docs/root",
  },
   {
    id: "10",
    name: "Health Check API",
    endpoint: "https://api.example.com/healthz",
    method: "GET",
    category: "Monitoring",
    owner: "Ops Team",
    status: "active",
    documentationUrl: "/docs/health",
  }
];

export default function ApiCatalogPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [apis, setApis] = React.useState<ApiEntry[]>(initialApis);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'table' | 'tree' | 'grid'>('table');
  const [selectedApiIdInTree, setSelectedApiIdInTree] = React.useState<string | null>(null);
  const [isApiDetailModalOpen, setIsApiDetailModalOpen] = React.useState(false);
  
  // Advanced filtering and sorting state
  const [sortConfig, setSortConfig] = React.useState<SortConfig>(DEFAULT_SORT_CONFIG);
  const [filterConfig, setFilterConfig] = React.useState<FilterConfig>(DEFAULT_FILTER_CONFIG);
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  // Form state for new API
  const [newApiName, setNewApiName] = React.useState("");
  const [newApiEndpoint, setNewApiEndpoint] = React.useState("");
  const [newApiMethod, setNewApiMethod] = React.useState("GET"); // Added method state
  const [newApiCategory, setNewApiCategory] = React.useState("");
  const [newApiOwner, setNewApiOwner] = React.useState("");
  const [newApiDocsUrl, setNewApiDocsUrl] = React.useState("");

  // Computed filtered and sorted APIs
  const processedApis = React.useMemo(() => {
    const filtered = filterApis(apis, filterConfig, searchTerm);
    return sortApis(filtered, sortConfig);
  }, [apis, filterConfig, searchTerm, sortConfig]);

  // Memoize tree data generation - use all APIs, not filtered ones for full tree structure
  const apiTreeData = React.useMemo(
    () => buildApiTree(apis),
    [apis]
  );

  // Handle sorting
  const handleSort = (field: SortField) => {
    setSortConfig(prevSort => ({
      field,
      direction: prevSort.field === field 
        ? toggleSortDirection(prevSort.direction)
        : 'asc'
    }));
  };

  // Handle filtering
  const handleFilterChange = (newFilterConfig: FilterConfig) => {
    setFilterConfig(newFilterConfig);
  };

  const handleClearFilters = () => {
    setFilterConfig(DEFAULT_FILTER_CONFIG);
  };

  const handleAddApi = () => {
    const newApi: ApiEntry = {
        id: String(Date.now()), // Use timestamp for more unique ID
        name: newApiName,
        endpoint: newApiEndpoint,
        method: newApiMethod, // Added method
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
    setNewApiMethod("GET");
    setNewApiCategory("");
    setNewApiOwner("");
    setNewApiDocsUrl("");
  };

  const handleApiSelectFromTree = (node: any) => {
    const apiId = node.id || node.apiId;
    setSelectedApiIdInTree(apiId);
    setIsApiDetailModalOpen(true);
    console.log("Selected API from Tree:", apiId);
  };

  const selectedApiDetails = React.useMemo(() => {
    if (!selectedApiIdInTree) return null;
    return apis.find(api => api.id === selectedApiIdInTree);
  }, [apis, selectedApiIdInTree]);

  // Export functionality
  const handleExportData = () => {
    const dataToExport = {
      apis: processedApis,
      filters: filterConfig,
      sort: sortConfig,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-catalog-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export ({processedApis.length})
          </Button>
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
                  <Label htmlFor="method" className="text-right">Method</Label>
                  <select id="method" value={newApiMethod} onChange={(e) => setNewApiMethod(e.target.value)} className="col-span-3 border p-2 rounded-md">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                    <option value="OPTIONS">OPTIONS</option>
                    <option value="HEAD">HEAD</option>
                  </select>
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
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        apis={apis}
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        isVisible={showAdvancedFilters}
        onToggleVisibility={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search APIs by name, endpoint, category, owner, or method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('table')}>
                <List className="mr-2 h-4 w-4" /> Table
            </Button>
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                <Grid3X3 className="mr-2 h-4 w-4" /> Grid
            </Button>
            <Button variant={viewMode === 'tree' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('tree')}>
                <FolderTree className="mr-2 h-4 w-4" /> Tree
            </Button>
        </div>
      </div>


      {viewMode === 'table' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHeader
                  field="name"
                  label="Name"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  field="method"
                  label="Method"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  field="endpoint"
                  label="Endpoint"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  field="category"
                  label="Category"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  field="owner"
                  label="Owner"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  field="status"
                  label="Status"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <TableHead>Documentation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedApis.length > 0 ? (
                processedApis.map((api) => (
                  <TableRow key={api.id}>
                    <TableCell className="font-medium">{api.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {api.method || "ANY"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-code">{api.endpoint}</TableCell>
                    <TableCell>{api.category}</TableCell>
                    <TableCell>{api.owner}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(api.status || 'active')} className="capitalize">{api.status || 'active'}</Badge>
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
                  <TableCell colSpan={7} className="text-center"> {/* Increased colSpan */}
                    No APIs found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {viewMode === 'grid' && (
        <ApiGridView apis={processedApis} />
      )}

      {viewMode === 'tree' && (
        <Card>
          <CardContent className="p-0"> {/* Remove CardContent padding if tree handles its own */}
            <ScrollArea className="h-[600px] border rounded-md"> {/* Example height, adjust as needed */}
                 <ApiTreeView
                    treeData={apiTreeData}
                    onApiSelect={handleApiSelectFromTree}
                    defaultExpandedLevel={1}
                    selectedApiNodeId={selectedApiIdInTree}
                />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Modal for API Details from Tree */}
      {selectedApiDetails && (
        <Dialog open={isApiDetailModalOpen} onOpenChange={setIsApiDetailModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedApiDetails.name}</DialogTitle>
              <DialogDescription>
                Details for the selected API.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <Badge variant="secondary" className="font-mono">{selectedApiDetails.method || "ANY"}</Badge>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Endpoint:</span>
                <span className="font-code text-right break-all">{selectedApiDetails.endpoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span>{selectedApiDetails.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner:</span>
                <span>{selectedApiDetails.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={getStatusBadgeVariant(selectedApiDetails.status)} className="capitalize">
                  {selectedApiDetails.status}
                </Badge>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Documentation:</span>
                 <Button variant="link" size="sm" asChild className="p-0 h-auto">
                    <a href={selectedApiDetails.documentationUrl} target="_blank" rel="noopener noreferrer">
                        View Docs <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => setIsApiDetailModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

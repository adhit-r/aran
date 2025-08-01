import React from 'react';
import { ApiEntry } from '@/types/api-document';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiGridViewProps {
  apis: ApiEntry[];
}

export const ApiGridView: React.FC<ApiGridViewProps> = ({ apis }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const getStatusBadgeVariant = (status: ApiEntry["status"]) => {
    switch (status) {
      case "active": return "default"; 
      case "deprecated": return "destructive";
      case "development": return "secondary";
      default: return "outline";
    }
  };

  const getMethodBadgeColor = (method?: string) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'POST': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'PUT': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'PATCH': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const handleCopyEndpoint = async (endpoint: string, apiId: string) => {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopiedId(apiId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy endpoint:', err);
    }
  };

  if (apis.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No APIs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {apis.map((api) => (
        <Card key={api.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate" title={api.name}>
                  {api.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  {api.method && (
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs font-mono", getMethodBadgeColor(api.method))}
                    >
                      {api.method.toUpperCase()}
                    </Badge>
                  )}
                  <Badge 
                    variant={getStatusBadgeVariant(api.status)} 
                    className="capitalize text-xs"
                  >
                    {api.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Endpoint</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted px-2 py-1 rounded truncate" title={api.endpoint}>
                  {api.endpoint}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex-shrink-0"
                  onClick={() => handleCopyEndpoint(api.endpoint, api.id)}
                  title="Copy endpoint"
                >
                  {copiedId === api.id ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
              <p className="text-sm">{api.category}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Owner</p>
              <p className="text-sm">{api.owner}</p>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button variant="link" size="sm" asChild className="p-0 h-auto">
                <a 
                  href={api.documentationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  View Docs <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
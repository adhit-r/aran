import React from 'react';
import { TreeNode } from '@/lib/api-tree-utils';
import { ChevronRight, ChevronDown, FileText, Network, GitMerge } from 'lucide-react'; // Added GitMerge for path segments
import { Badge } from '@/components/ui/badge'; // For displaying HTTP method

interface ApiTreeViewNodeProps {
  node: TreeNode;
  level: number;
  onToggleExpand: (nodeId: string) => void;
  expandedNodeIds: Set<string>;
  onApiSelect: (apiId: string, event: React.MouseEvent) => void;
  selectedApiId?: string | null;
}

const ApiTreeViewNode: React.FC<ApiTreeViewNodeProps> = ({
  node,
  level,
  onToggleExpand,
  expandedNodeIds,
  onApiSelect,
  selectedApiId,
}) => {
  const isExpanded = expandedNodeIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isApi = !!node.apiId;

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent onApiSelect if parent is also an API
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  };

  const handleSelect = (event: React.MouseEvent) => {
    if (isApi) {
      onApiSelect(node.apiId!, event);
    } else if (hasChildren) { // If not an API itself, but has children, toggle expand
      handleToggle(event);
    }
  };

  const getMethodColor = (method?: string) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'bg-sky-600/80 hover:bg-sky-500/80 border-sky-500/50 text-white';
      case 'POST': return 'bg-green-600/80 hover:bg-green-500/80 border-green-500/50 text-white';
      case 'PUT': return 'bg-amber-600/80 hover:bg-amber-500/80 border-amber-500/50 text-white';
      case 'DELETE': return 'bg-red-600/80 hover:bg-red-500/80 border-red-500/50 text-white';
      case 'PATCH': return 'bg-purple-600/80 hover:bg-purple-500/80 border-purple-500/50 text-white';
      default: return 'bg-gray-500/80 hover:bg-gray-400/80 border-gray-400/50 text-white';
    }
  };

  const nodeIsSelected = isApi && selectedApiId === node.apiId;

  return (
    <div>
      <div
        className={`flex items-center p-1.5 rounded-md cursor-pointer hover:bg-muted/60 ${nodeIsSelected ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
        style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }} // Dynamic indentation + base padding
        onClick={handleSelect}
        title={node.fullPath}
      >
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="p-0.5 rounded-sm hover:bg-muted-foreground/20 focus:outline-none"
            aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
          >
            {isExpanded ? <ChevronDown size={16} className="mr-2" /> : <ChevronRight size={16} className="mr-2" />}
          </button>
        ) : (
          <span style={{ width: '20px' }} className="mr-2 inline-block"></span> // Placeholder for alignment if no children
        )}

        {isApi ? (
          <Network size={16} className={`mr-2 shrink-0 ${nodeIsSelected ? '' : 'text-primary'}`} />
        ) : (
          <GitMerge size={16} className="mr-2 text-muted-foreground shrink-0" /> // Icon for path segment
        )}

        <span className={`truncate select-none ${isApi ? 'font-medium' : 'text-sm text-muted-foreground'}`}>
          {node.name}
        </span>
        {isApi && node.method && (
           <Badge variant="outline" className={`ml-2 text-xs px-1.5 py-0.5 ${getMethodColor(node.method)} ${nodeIsSelected ? 'border-accent-foreground/50' : ''}`}>
            {node.method.toUpperCase()}
          </Badge>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <ApiTreeViewNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
              expandedNodeIds={expandedNodeIds}
              onApiSelect={onApiSelect}
              selectedApiId={selectedApiId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTreeViewNode;

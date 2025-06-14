// src/components/api-catalog/ApiTreeViewNode.tsx
import React from 'react';
import { ChevronRight, ChevronDown, GitMerge, Network } from 'lucide-react'; // Using GitMerge for path segment
import { TreeNode } from '@/lib/api-tree-utils'; // Adjusted import path
import { Badge } from '@/components/ui/badge'; // For method display
import { cn } from '@/lib/utils';

interface ApiTreeViewNodeProps {
  node: TreeNode;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: (nodeId: string) => void;
  onNodeSelect: (node: TreeNode) => void; // Pass the whole node
}

const ApiTreeViewNode: React.FC<ApiTreeViewNodeProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
  onToggleExpand,
  onNodeSelect,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isApi = !!node.apiId;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If it's an API node, select it.
    // If it's a folder node (has children but not an API itself), toggle it.
    // If it's an API node that also has children (e.g. methods as children), select it. Toggle is separate.
    if (isApi) {
      onNodeSelect(node);
    } else if (hasChildren) {
      onToggleExpand(node.id);
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node click when only toggling
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  };

  const getMethodBadgeVariant = (method?: string) => {
   switch (method?.toUpperCase()) {
     case 'GET': return 'bg-green-600/20 text-green-700 border-green-600/40 hover:bg-green-600/30';
     case 'POST': return 'bg-blue-600/20 text-blue-700 border-blue-600/40 hover:bg-blue-600/30';
     case 'PUT': return 'bg-yellow-600/20 text-yellow-700 border-yellow-600/40 hover:bg-yellow-600/30';
     case 'DELETE': return 'bg-red-600/20 text-red-700 border-red-600/40 hover:bg-red-600/30';
     case 'PATCH': return 'bg-purple-600/20 text-purple-700 border-purple-600/40 hover:bg-purple-600/30';
     default: return 'bg-gray-600/20 text-gray-700 border-gray-600/40 hover:bg-gray-600/30'; // More neutral default
   }
 };

  return (
    <div className="flex flex-col"> {/* Use flex-col to stack node and its children */}
      <div
        className={cn(
          "flex items-center py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer group", // Added group for potential hover effects on children
          isSelected && isApi && "bg-accent text-accent-foreground hover:bg-accent/90"
        )}
        style={{ paddingLeft: `${level * 1.25 + 0.25}rem` }} // Adjusted base padding
        onClick={handleNodeClick}
        title={node.fullPath}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-2 shrink-0 cursor-pointer" onClick={handleChevronClick} />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2 shrink-0 cursor-pointer" onClick={handleChevronClick}/>
          )
        ) : (
          <span className="w-4 mr-2 shrink-0"></span> // Placeholder for alignment if no children (leaf node)
        )}

        {isApi ? <Network className="h-4 w-4 mr-2 shrink-0 text-blue-500" /> :
                 (hasChildren ? <GitMerge className="h-4 w-4 mr-2 shrink-0 text-slate-500 transform rotate-90" /> : <span className="w-4 mr-2 shrink-0"></span>) // GitMerge for folders, space for leaf path segments
        }

        <span className={cn("truncate flex-grow select-none", isApi ? "font-medium" : "text-sm text-muted-foreground")}>
            {node.name}
        </span>
        {isApi && node.method && (
          <Badge variant="outline" className={cn("ml-2 text-xs px-1.5 py-0.5 font-mono", getMethodBadgeVariant(node.method))}>
            {node.method.toUpperCase()}
          </Badge>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="pl-0"> {/* Children are already indented by their own level calculation */}
          {node.children.map((childNode) => (
            <ApiTreeViewNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              isExpanded={expandedNodeIds.has(childNode.id)} // Pass child's expansion state
              isSelected={selectedApiNodeId === childNode.id && !!childNode.apiId} // Pass child's selection state
              onToggleExpand={onToggleExpand} // Pass down from parent
              onNodeSelect={onApiSelect} // Pass down from parent (renamed from onNodeSelect for clarity)
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ApiTreeViewNode;

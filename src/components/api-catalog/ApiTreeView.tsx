// src/components/api-catalog/ApiTreeView.tsx
import React, { useState, useEffect } from 'react';
import { TreeNode } from '@/lib/api-tree-utils'; // Adjusted import path
import ApiTreeViewNode from './ApiTreeViewNode'; // Assuming same directory or correct path

interface ApiTreeViewProps {
  treeData: TreeNode[];
  onApiSelect: (node: TreeNode) => void; // Changed from (apiId: string) to (node: TreeNode) for more context
  selectedApiNodeId?: string | null;
  defaultExpandedLevel?: number; // e.g., 0 for root, 1 for first level children
}

const ApiTreeView: React.FC<ApiTreeViewProps> = ({
  treeData,
  onApiSelect,
  selectedApiNodeId,
  defaultExpandedLevel = 0
}) => {
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const idsToExpand = new Set<string>();
    const expandNodesRecursively = (nodes: TreeNode[], currentLevel: number) => {
      if (currentLevel >= defaultExpandedLevel) { // Stop if currentLevel reaches or exceeds defaultExpandedLevel
        return;
      }
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          idsToExpand.add(node.id);
          expandNodesRecursively(node.children, currentLevel + 1);
        }
      });
    };

    if (defaultExpandedLevel > 0) { // Only run if we need to expand some levels
        expandNodesRecursively(treeData, 0);
    }
    setExpandedNodeIds(idsToExpand);
  }, [treeData, defaultExpandedLevel]);


  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodeIds((prevExpandedIds) => {
      const newExpandedIds = new Set(prevExpandedIds);
      if (newExpandedIds.has(nodeId)) {
        newExpandedIds.delete(nodeId);
      } else {
        newExpandedIds.add(nodeId);
      }
      return newExpandedIds;
    });
  };

  // No need for renderTreeNodes, map directly in JSX
  if (!treeData || treeData.length === 0) {
    return <p className="text-muted-foreground p-4 text-center">No APIs to display in tree view.</p>;
  }

  return (
    <div className="space-y-0.5 py-1"> {/* Added py-1 for slight vertical padding around the tree */}
      {treeData.map((node) => (
        <ApiTreeViewNode
          key={node.id}
          node={node}
          level={0}
          isExpanded={expandedNodeIds.has(node.id)}
          isSelected={selectedApiNodeId === node.id && !!node.apiId}
          onToggleExpand={handleToggleExpand}
          onNodeSelect={onApiSelect} // Pass the onApiSelect from props
        />
      ))}
    </div>
  );
};

export default ApiTreeView;

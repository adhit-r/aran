import React, { useState, useEffect } from 'react';
import { TreeNode } from '@/lib/api-tree-utils';
import ApiTreeViewNode from './ApiTreeViewNode';

interface ApiTreeViewProps {
  treeData: TreeNode[];
  onApiSelect: (apiId: string, event: React.MouseEvent) => void;
  defaultExpandedLevel?: number;
  selectedApiId?: string | null;
}

const ApiTreeView: React.FC<ApiTreeViewProps> = ({
  treeData,
  onApiSelect,
  defaultExpandedLevel = 0, // Default to 0 (none expanded) or 1 (first level expanded)
  selectedApiId,
}) => {
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const getDefaultExpanded = (nodes: TreeNode[], currentLevel: number, currentPathIds: Set<string>): void => {
      if (currentLevel >= defaultExpandedLevel) {
        return;
      }
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          currentPathIds.add(node.id);
          getDefaultExpanded(node.children, currentLevel + 1, currentPathIds);
        }
      });
    };
    if (defaultExpandedLevel > 0) {
      const idsToExpand = new Set<string>();
      getDefaultExpanded(treeData, 0, idsToExpand);
      setExpandedNodeIds(idsToExpand);
    } else {
      setExpandedNodeIds(new Set<string>()); // Ensure it's reset if defaultExpandedLevel is 0
    }
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

  if (!treeData || treeData.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No API structure to display. Filter might be too restrictive or no APIs available.</div>;
  }

  return (
    <div className="p-2 space-y-0.5">
      {treeData.map((node) => (
        <ApiTreeViewNode
          key={node.id}
          node={node}
          level={0}
          onToggleExpand={handleToggleExpand}
          expandedNodeIds={expandedNodeIds}
          onApiSelect={onApiSelect}
          selectedApiId={selectedApiId}
        />
      ))}
    </div>
  );
};

export default ApiTreeView;

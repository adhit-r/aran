import React, { useState, useEffect } from 'react';
import { TreeNode } from '@/lib/api-tree-utils';
import ApiTreeViewNode from './ApiTreeViewNode';

interface ApiTreeViewProps {
  treeData: TreeNode[];
  onApiSelect: (apiId: string, event: React.MouseEvent) => void; // Pass event for more context if needed
  defaultExpandedLevel?: number; // Expand tree to a certain level by default
  selectedApiId?: string | null;
}

const ApiTreeView: React.FC<ApiTreeViewProps> = ({
  treeData,
  onApiSelect,
  defaultExpandedLevel = 0,
  selectedApiId,
}) => {
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const getDefaultExpanded = (nodes: TreeNode[], currentLevel: number): Set<string> => {
      let ids = new Set<string>();
      if (currentLevel >= defaultExpandedLevel) {
        return ids;
      }
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          ids.add(node.id);
          const childIds = getDefaultExpanded(node.children, currentLevel + 1);
          childIds.forEach(id => ids.add(id));
        }
      });
      return ids;
    };
    if (defaultExpandedLevel > 0) {
      setExpandedNodeIds(getDefaultExpanded(treeData, 0));
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
    return <div className="p-4 text-center text-muted-foreground">No API structure to display.</div>;
  }

  return (
    <div className="p-2 space-y-0.5"> {/* Reduced space-y for tighter packing */}
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

import type { ApiEntry } from '@/types/api-document'; // Adjusted import path

export interface TreeNode {
  id: string;          // e.g., 'segment1/segment2/segment3' or 'segment1/segment2/api-{apiId}'
  name: string;        // The last segment name (e.g., 'segment3' or API name for API nodes)
  fullPath: string;    // Full path from root, e.g., 'segment1/segment2/segment3'
  children: TreeNode[];
  apiId?: string;       // ID of the ApiEntry if this node represents an API endpoint
  method?: string;      // HTTP method if it's an API endpoint
  // Add apiName if you want to store the original API name separately from the segment name
}

export function parseEndpointPath(endpoint: string): string[] {
  let pathOnly = endpoint;
  try {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      const url = new URL(endpoint);
      pathOnly = url.pathname;
    }
  } catch (e) {
    // Invalid URL, proceed assuming it might be a path or malformed
    console.warn(`Invalid URL string for endpoint: ${endpoint}`, e);
  }

  return pathOnly
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
    .split('/')
    .filter(segment => segment.length > 0) // Remove empty segments from multiple slashes
    .map(segment => decodeURIComponent(segment));
}

export function buildApiTree(apis: ApiEntry[]): TreeNode[] {
  const rootNodes: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>(); // Tracks nodes by their fullPath to avoid duplicates

  apis.forEach(api => {
    const segments = parseEndpointPath(api.endpoint);
    let currentLevelNodes = rootNodes; // This will point to rootNodes or a parent's children array
    let currentPath = '';

    if (segments.length === 0) { // Root-level API
      const nodeId = `api-root-${api.id}`; // Make ID unique for root APIs
      let rootApiNode = nodeMap.get(nodeId); // Check if this specific API node already exists

      if (!rootApiNode) {
          // If a generic "/" node exists from another API, we might want to add this as a distinct node or merge.
          // For simplicity, let's create a distinct node if its ID is different.
          // A more complex merge could involve a root "/" node that lists multiple direct APIs.
          rootApiNode = {
            id: nodeId,
            name: `${api.method ? api.method + ' ' : ''}${api.name}`,
            fullPath: '/', // All root APIs share a conceptual '/' path
            children: [],
            apiId: api.id,
            method: api.method,
          };
          rootNodes.push(rootApiNode);
          nodeMap.set(nodeId, rootApiNode); // Store by its unique API-specific ID
      }
      // If rootApiNode with this ID already exists, we assume it's the same API, do nothing.
      return;
    }

    segments.forEach((segment, index) => {
      const isLastSegment = index === segments.length - 1;
      const previousPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let node = nodeMap.get(currentPath);

      if (!node) {
        node = {
          id: currentPath, // Use full path as ID for path segment nodes
          name: segment,
          fullPath: currentPath,
          children: [],
        };
        if (previousPath === '') { // Node is a child of the root
          rootNodes.push(node);
        } else {
          const parentNode = nodeMap.get(previousPath);
          parentNode?.children.push(node); // parentNode should exist
        }
        nodeMap.set(currentPath, node);
      }

      if (isLastSegment) { // This segment corresponds to the API endpoint
        // If the node itself is not yet an API, make it one
        if (!node.apiId) {
          node.apiId = api.id;
          node.method = api.method;
          // node.name = `${api.method ? api.method + ' ' : ''}${api.name}`; // Optionally rename the path segment node to the API name/method
        } else {
          // The path segment is already an API. Create a new child node for this specific API method/ID.
          // This handles cases like /users (GET all users) and /users (POST create user)
          const specificApiNodeId = `api-leaf-${api.id}`; // Ensure unique ID for leaf API node
          const specificApiNode: TreeNode = {
            id: specificApiNodeId,
            name: `${api.method ? api.method + ' ' : ''}${api.name}`,
            fullPath: currentPath + '/' + specificApiNodeId, // Make path distinct for map if needed, though parentage handles structure
            children: [],
            apiId: api.id,
            method: api.method,
          };
          node.children.push(specificApiNode);
          // nodeMap.set(specificApiNodeId, specificApiNode); // Not strictly needed if only accessed via parent
        }
      }
      // Sort children after modification
      if (previousPath === '') {
        rootNodes.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        nodeMap.get(previousPath)?.children.sort((a, b) => a.name.localeCompare(b.name));
      }
      // For the next iteration, current node's children become the level to add to
      currentLevelNodes = node.children; // This line was missing in the provided logic, it should be here.
                                        // However, the logic structure with parentNode.children.push is more robust.
                                        // The currentLevelNodes variable as used in the original prompt was a bit ambiguous.
                                        // The corrected logic above directly pushes to parentNode.children or rootNodes.
    });
  });
  rootNodes.sort((a, b) => a.name.localeCompare(b.name)); // Final sort of root nodes
  return rootNodes;
}

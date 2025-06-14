// src/lib/api-tree-utils.ts

export interface ApiEntry {
  id: string;
  name: string;
  endpoint: string;
  // other properties like method, description, etc. could be here
  method?: string; // Adding method as it's common for APIs
  description?: string;
}

export interface TreeNode {
  id: string; // Unique ID for the node (e.g., generated from full path)
  name: string; // Name of the path segment
  fullPath: string; // Full path to this node
  children: TreeNode[];
  apiId?: string; // Optional: ID of the ApiEntry if this node represents an actual API
  apiName?: string; // Optional: Name of the API if this node represents an actual API
  method?: string; // Optional: HTTP method if this node represents an API
}

/**
 * Parses an API endpoint string (URL or path) into an array of path segments.
 * @param endpoint The API endpoint string.
 * @returns An array of path segments.
 */
export function parseEndpointPath(endpoint: string): string[] {
  let pathname: string;
  try {
    // Check if it's a full URL
    if (endpoint.includes('://')) {
      const url = new URL(endpoint);
      pathname = url.pathname;
    } else {
      // Assume it's already a path
      pathname = endpoint;
    }
  } catch (error) {
    // Invalid URL or endpoint string
    console.error(`Invalid endpoint string: ${endpoint}`, error);
    return [];
  }

  // Normalize the path: remove leading/trailing slashes and split
  const segments = pathname
    .trim()
    .replace(/^\/+|\/+$/g, '') // Remove leading and trailing slashes
    .split('/');

  // Filter out any empty segments (e.g., from multiple slashes like //)
  // and decode URI components
  return segments.filter(segment => segment.length > 0).map(decodeURIComponent);
}

/**
 * Builds an API tree from a list of API entries.
 * @param apis An array of ApiEntry objects.
 * @param parseFn The function to parse endpoint paths into segments.
 * @returns An array of root TreeNode objects.
 */
export function buildApiTree(
  apis: ApiEntry[],
  parseFn: (endpoint: string) => string[] = parseEndpointPath
): TreeNode[] {
  const rootNodes: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>(); // Helper to quickly find nodes by fullPath

  apis.forEach(api => {
    const segments = parseFn(api.endpoint);

    if (segments.length === 0) {
      const rootApiNodeId = `api-root-${api.id}`;
      let rootApiNode = nodeMap.get(rootApiNodeId); // Try to find an existing node for this specific API ID at root
      if (!rootApiNode) { // If no specific node for this API ID, try to find a generic one by path '/'
          rootApiNode = nodeMap.get('/');
      }

      if (!rootApiNode) {
        rootApiNode = {
          id: rootApiNodeId,
          name: api.name || api.endpoint || 'Root API',
          fullPath: '/',
          children: [],
          apiId: api.id,
          apiName: api.name,
          method: api.method,
        };
        rootNodes.push(rootApiNode);
        nodeMap.set(rootApiNodeId, rootApiNode); // Map by specific ID
        if (!nodeMap.has('/')) nodeMap.set('/', rootApiNode); // Also map by generic path if not taken
      } else {
        // If a node for path '/' or specific ID already existed, update it if it wasn't this specific API
        // This logic might need refinement if multiple APIs truly map to the exact same root path
        // and should be represented as distinct nodes at the root.
        // For now, if a generic '/' node exists, we might overwrite its apiId if it's not set.
        if (!rootApiNode.apiId) {
            rootApiNode.apiId = api.id;
            rootApiNode.apiName = api.name;
            rootApiNode.method = api.method;
        } else if (rootApiNode.apiId !== api.id) {
            // If the existing root node represents a *different* API, create a new node
            const newRootApiNode: TreeNode = {
                id: rootApiNodeId,
                name: api.name || api.endpoint || 'Root API',
                fullPath: '/',
                children: [],
                apiId: api.id,
                apiName: api.name,
                method: api.method,
            };
            rootNodes.push(newRootApiNode);
            nodeMap.set(rootApiNodeId, newRootApiNode);
        }
      }
      return;
    }

    let currentLevelNodes = rootNodes;
    let currentPath = '';

    segments.forEach((segment, index) => {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let node = nodeMap.get(currentPath);

      if (!node) {
        node = {
          id: `node-${currentPath.replace(/\//g, '-')}`,
          name: segment,
          fullPath: currentPath,
          children: [],
        };
        // Add to correct parent's children list or rootNodes
        if (parentPath === '') { // This means it's a root segment
            currentLevelNodes.push(node);
        } else {
            const parentNode = nodeMap.get(parentPath);
            if (parentNode) { // Should always exist if parentPath is not empty
                parentNode.children.push(node);
                parentNode.children.sort((a, b) => a.name.localeCompare(b.name));
            } else { // Fallback, though ideally parent should be found
                currentLevelNodes.push(node);
            }
        }
        nodeMap.set(currentPath, node);
        if (parentPath === '') { // If it was added to rootNodes
             currentLevelNodes.sort((a, b) => a.name.localeCompare(b.name));
        }
      }

      if (index === segments.length - 1) {
        // This node (or a new one if methods differ) represents the API endpoint
        if (!node.apiId) { // If it's purely a path segment so far
            node.apiId = api.id;
            node.apiName = api.name;
            node.method = api.method;
        } else if (node.apiId !== api.id && node.fullPath === currentPath) {
            // The path segment itself was already an API, and this is a new API on the same path (e.g. different method)
            // Create a new child node specifically for this API method/ID if methods are different or names are different
            // Or, if methods are the same, this might be an issue with data (multiple APIs with same path & method)
            const methodNodeName = api.method ? `${api.method} - ${api.name}` : api.name;
            const methodNodeId = `node-${currentPath.replace(/\//g, '-')}-${api.method || 'nomethod'}-${api.id}`;

            let methodNode = node.children.find(child => child.id === methodNodeId);
            if (!methodNode) {
                 methodNode = {
                    id: methodNodeId,
                    name: methodNodeName,
                    fullPath: currentPath, // It shares the path but is distinct by method/id
                    children: [],
                    apiId: api.id,
                    apiName: api.name,
                    method: api.method,
                };
                node.children.push(methodNode);
                node.children.sort((a, b) => a.name.localeCompare(b.name));
                // nodeMap.set(methodNodeId, methodNode); // Not strictly necessary to map these distinct method nodes if only accessed via parent
            }
        }
      }
      currentLevelNodes = node.children; // Next iteration will look into this node's children
    });
  });
  // Final sort of root nodes
  rootNodes.sort((a,b) => a.name.localeCompare(b.name));
  return rootNodes;
}

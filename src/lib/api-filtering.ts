import { ApiEntry } from "@/types/api-document";
import { SortConfig, FilterConfig, SortDirection, SortField } from "@/types/filtering";

export function sortApis(apis: ApiEntry[], sortConfig: SortConfig): ApiEntry[] {
  return [...apis].sort((a, b) => {
    const { field, direction } = sortConfig;
    
    let aValue: any;
    let bValue: any;
    
    switch (field) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'method':
        aValue = a.method?.toLowerCase() || '';
        bValue = b.method?.toLowerCase() || '';
        break;
      case 'endpoint':
        aValue = a.endpoint?.toLowerCase() || '';
        bValue = b.endpoint?.toLowerCase() || '';
        break;
      case 'category':
        aValue = a.category?.toLowerCase() || '';
        bValue = b.category?.toLowerCase() || '';
        break;
      case 'owner':
        aValue = a.owner?.toLowerCase() || '';
        bValue = b.owner?.toLowerCase() || '';
        break;
      case 'status':
        // Sort by status priority: active > development > deprecated
        const statusPriority = { active: 3, development: 2, deprecated: 1 };
        aValue = statusPriority[a.status || 'active'] || 0;
        bValue = statusPriority[b.status || 'active'] || 0;
        break;
      default:
        aValue = '';
        bValue = '';
    }
    
    let comparison = 0;
    if (aValue < bValue) {
      comparison = -1;
    } else if (aValue > bValue) {
      comparison = 1;
    }
    
    return direction === 'desc' ? -comparison : comparison;
  });
}

export function filterApis(apis: ApiEntry[], filterConfig: FilterConfig, searchTerm: string = ''): ApiEntry[] {
  return apis.filter((api) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = 
        api.name?.toLowerCase().includes(searchLower) ||
        api.endpoint?.toLowerCase().includes(searchLower) ||
        api.category?.toLowerCase().includes(searchLower) ||
        api.owner?.toLowerCase().includes(searchLower) ||
        api.method?.toLowerCase().includes(searchLower);
      
      if (!searchMatch) return false;
    }
    
    // Status filter
    if (filterConfig.status.length > 0 && !filterConfig.status.includes(api.status || 'active')) {
      return false;
    }
    
    // Method filter
    if (filterConfig.method.length > 0 && !filterConfig.method.includes(api.method || '')) {
      return false;
    }
    
    // Category filter
    if (filterConfig.category.length > 0 && !filterConfig.category.includes(api.category || '')) {
      return false;
    }
    
    // Owner filter
    if (filterConfig.owner.length > 0 && !filterConfig.owner.includes(api.owner || '')) {
      return false;
    }
    
    return true;
  });
}

export function getUniqueValues(apis: ApiEntry[], field: keyof ApiEntry): string[] {
  const values = apis
    .map(api => api[field])
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
  
  return Array.from(new Set(values)).sort();
}

export function toggleSortDirection(currentDirection: SortDirection): SortDirection {
  return currentDirection === 'asc' ? 'desc' : 'asc';
}

export function getSortIcon(field: SortField, currentSort: SortConfig): 'asc' | 'desc' | null {
  if (currentSort.field !== field) return null;
  return currentSort.direction;
}
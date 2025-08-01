// Types for advanced filtering and sorting
export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'method' | 'endpoint' | 'category' | 'owner' | 'status';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  status: string[];
  method: string[];
  category: string[];
  owner: string[];
}

export interface ViewMode {
  type: 'table' | 'tree' | 'grid' | 'compact';
}

export const DEFAULT_FILTER_CONFIG: FilterConfig = {
  status: [],
  method: [],
  category: [],
  owner: []
};

export const DEFAULT_SORT_CONFIG: SortConfig = {
  field: 'name',
  direction: 'asc'
};
import React from 'react';
import { FilterConfig } from '@/types/filtering';
import { ApiEntry } from '@/types/api-document';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Filter } from 'lucide-react';
import { getUniqueValues } from '@/lib/api-filtering';

interface AdvancedFiltersProps {
  apis: ApiEntry[];
  filterConfig: FilterConfig;
  onFilterChange: (filterConfig: FilterConfig) => void;
  onClearFilters: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  apis,
  filterConfig,
  onFilterChange,
  onClearFilters,
  isVisible,
  onToggleVisibility
}) => {
  const uniqueStatuses = ['active', 'development', 'deprecated'];
  const uniqueMethods = getUniqueValues(apis, 'method');
  const uniqueCategories = getUniqueValues(apis, 'category');
  const uniqueOwners = getUniqueValues(apis, 'owner');

  const handleFilterToggle = (
    filterType: keyof FilterConfig,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filterConfig[filterType];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);

    onFilterChange({
      ...filterConfig,
      [filterType]: newValues
    });
  };

  const getOnCheckedChange = (filterType: keyof FilterConfig, value: string) => (checked: boolean) => {
    handleFilterToggle(filterType, value, checked);
  };

  const getActiveFilterCount = () => {
    return Object.values(filterConfig).reduce((count, values) => count + values.length, 0);
  };

  const renderFilterSection = (
    title: string,
    filterType: keyof FilterConfig,
    options: string[]
  ) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${filterType}-${option}`}
              checked={filterConfig[filterType].includes(option)}
              onCheckedChange={getOnCheckedChange(filterType, option)}
            />
            <label
              htmlFor={`${filterType}-${option}`}
              className="text-sm cursor-pointer flex-1"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleVisibility}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
        
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {isVisible && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFilterSection('Status', 'status', uniqueStatuses)}
            <Separator />
            {renderFilterSection('Method', 'method', uniqueMethods)}
            <Separator />
            {renderFilterSection('Category', 'category', uniqueCategories)}
            <Separator />
            {renderFilterSection('Owner', 'owner', uniqueOwners)}
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onClearFilters}>
                Clear All
              </Button>
              <Button onClick={onToggleVisibility}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
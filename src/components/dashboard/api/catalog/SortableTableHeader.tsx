import React from 'react';
import { Button } from '@/components/ui/button';
import { TableHead } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortConfig, SortField } from '@/types/filtering';
import { getSortIcon } from '@/lib/api-filtering';
import { cn } from '@/lib/utils';

interface SortableTableHeaderProps {
  field: SortField;
  label: string;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  className?: string;
}

export const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  field,
  label,
  sortConfig,
  onSort,
  className
}) => {
  const sortIcon = getSortIcon(field, sortConfig);
  
  const getSortIconComponent = () => {
    if (sortIcon === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    } else if (sortIcon === 'desc') {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  return (
    <TableHead className={cn("p-0", className)}>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className={cn(
          "h-auto p-2 font-medium justify-start hover:bg-muted/50 w-full",
          sortConfig.field === field && "text-foreground"
        )}
      >
        {label}
        <div className="ml-2">
          {getSortIconComponent()}
        </div>
      </Button>
    </TableHead>
  );
};
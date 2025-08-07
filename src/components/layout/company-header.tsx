"use client";

import React from 'react';
import { useCompanyContext } from '@/hooks/use-company-context';
import { Building2, Globe, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CompanyHeader() {
  const { company, loading, error } = useCompanyContext();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading organization...</span>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex items-center space-x-2 text-sm text-red-600">
        <Globe className="w-4 h-4" />
        <span>Organization not found</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {company.logo ? (
        <img 
          src={company.logo} 
          alt={company.name} 
          className="w-6 h-6 rounded object-contain"
        />
      ) : (
        <Building2 className="w-5 h-5 text-blue-600" />
      )}
      
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{company.name}</span>
        {company.domain && (
          <div className="flex items-center space-x-1">
            <Globe className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{company.domain}</span>
            <Badge variant="outline" className="text-xs">
              {company.status}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

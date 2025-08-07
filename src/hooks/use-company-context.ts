import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';

interface Company {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  status: 'active' | 'suspended' | 'pending';
}

export function useCompanyContext() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCompanyFromSubdomain = async () => {
      try {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        // Skip for localhost and www
        if (subdomain === 'localhost' || subdomain === 'www' || hostname.includes('127.0.0.1')) {
          setLoading(false);
          return;
        }

        // Find company by subdomain
        const companies = await pb.collection('companies').getList(1, 50, {
          filter: 'status = "active"'
        });

        const foundCompany = companies.items.find((c: any) => {
          const companyDomain = c.domain || '';
          const companyName = c.name.toLowerCase().replace(/\s+/g, '');
          const subdomainLower = subdomain.toLowerCase();
          
          return companyDomain.includes(subdomainLower) || companyName === subdomainLower;
        });

        if (foundCompany) {
          setCompany(foundCompany as Company);
        } else {
          setError('Organization not found');
        }
      } catch (err) {
        console.error('Error getting company context:', err);
        setError('Failed to load organization');
      } finally {
        setLoading(false);
      }
    };

    getCompanyFromSubdomain();
  }, []);

  return { company, loading, error };
}

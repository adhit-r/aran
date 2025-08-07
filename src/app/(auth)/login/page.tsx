"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Shield, Building2, Globe, ChevronDown } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface Company {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  status: 'active' | 'suspended' | 'pending';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const { login } = useAuth();
  const router = useRouter();

  // Load available companies
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const result = await pb.collection('companies').getList(1, 50, {
          filter: 'status = "active"',
          sort: 'name'
        });
        setCompanies(result.items as Company[]);
      } catch (error) {
        console.error('Failed to load companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    loadCompanies();
  }, []);

  // Auto-detect company from subdomain
  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
      const company = companies.find(c => 
        c.domain?.includes(subdomain) || 
        c.name.toLowerCase().replace(/\s+/g, '') === subdomain.toLowerCase()
      );
      if (company) {
        setSelectedCompany(company.id);
      }
    }
  }, [companies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedCompany) {
      setError('Please select your organization');
      setLoading(false);
      return;
    }

    try {
      // Login with company context
      await login(email, password, selectedCompany);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    const company = companies.find(c => c.id === companyId);
    if (company?.domain) {
      // Update URL to reflect company subdomain
      const newUrl = `${window.location.protocol}//${company.domain}${window.location.pathname}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Aran API Sentinel
            </CardTitle>
            <p className="text-gray-600">
              Sign in to your organization workspace
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Organization Selection */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Organization
                </Label>
                <Select 
                  value={selectedCompany} 
                  onValueChange={handleCompanyChange}
                  disabled={loadingCompanies}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingCompanies ? "Loading organizations..." : "Select your organization"} />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        <div className="flex items-center space-x-2">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-4 h-4 rounded" />
                          ) : (
                            <Building2 className="w-4 h-4 text-gray-500" />
                          )}
                          <span>{company.name}</span>
                          {company.domain && (
                            <span className="text-xs text-gray-400">({company.domain})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !selectedCompany}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Subdomain Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-blue-700">
                <Globe className="w-4 h-4" />
                <span>Access via subdomain: <code className="bg-blue-100 px-1 rounded">company.aran.com</code></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
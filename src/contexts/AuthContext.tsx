"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { pb, User, Company, getCurrentUser, getCurrentCompany, isAuthenticated, logout } from '@/lib/pocketbase';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            
            // Fetch company data
            const companyData = await pb.collection('companies').getOne(currentUser.company);
            setCompany(companyData as unknown as Company);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    pb.authStore.onChange((token, model) => {
      if (model) {
        setUser(model as unknown as User);
        // Fetch company data when user changes
        if (model.company) {
          pb.collection('companies').getOne(model.company)
            .then((companyData) => setCompany(companyData as unknown as Company))
            .catch(console.error);
        }
      } else {
        setUser(null);
        setCompany(null);
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      if (authData.record) {
        setUser(authData.record as unknown as User);
        
        // Fetch company data
        const companyData = await pb.collection('companies').getOne(authData.record.company);
        setCompany(companyData as unknown as Company);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCompany(null);
  };

  const value: AuthContextType = {
    user,
    company,
    isAuthenticated: isAuthenticated(),
    login,
    logout: handleLogout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
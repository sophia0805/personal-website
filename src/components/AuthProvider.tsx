'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isOwner: boolean;
  isLoading: boolean;
  clientIp?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientIp, setClientIp] = useState<string>();

  // Check IP on mount
  useEffect(() => {
    const checkIP = async () => {
      try {
        const response = await fetch('/api/check-ip');
        const data = await response.json();
        setIsOwner(data.isOwner);
        setClientIp(data.clientIp);
      } catch (error) {
        console.error('Failed to check IP:', error);
        setIsOwner(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkIP();
  }, []);

  return (
    <AuthContext.Provider value={{ isOwner, isLoading, clientIp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

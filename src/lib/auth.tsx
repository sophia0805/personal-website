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

  useEffect(() => {
    const checkIP = async () => {
      const response = await fetch('/api/check-ip');
      const data = await response.json();
      console.log('data', data)
      setIsOwner(data.isOwner);
      setClientIp(data.clientIp);
      setIsLoading(false);
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

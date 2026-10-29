import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { AuthService } from '../services/db';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('barberpro_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      const fresh = AuthService.getCurrentUser(parsed.id);
      if (fresh) setUser(fresh);
      else localStorage.removeItem('barberpro_user');
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const u = AuthService.login(username, password);
    if (u) {
      setUser(u);
      localStorage.setItem('barberpro_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barberpro_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

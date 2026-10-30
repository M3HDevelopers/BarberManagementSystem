import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple user database
const USERS = [
  { id: 'u1', username: 'admin', password: 'admin123', role: 'owner', name: 'John Owner' },
  { id: 'u2', username: 'manager', password: 'manager123', role: 'manager', name: 'Sarah Manager' },
  { id: 'u3', username: 'reception', password: 'reception123', role: 'receptionist', name: 'Mike Front' },
  { id: 'u4', username: 'barber1', password: 'barber123', role: 'barber', name: 'Tony Styles' },
  { id: 'u5', username: 'barber2', password: 'barber123', role: 'barber', name: 'James Fade' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('barberpro_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = USERS.find(u => u.id === parsed.id);
        if (found) setUser(found);
        else localStorage.removeItem('barberpro_user');
      }
    } catch {
      localStorage.removeItem('barberpro_user');
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('barberpro_user', JSON.stringify(userData));
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  propertyId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── Demo credentials bypass ───────────────────────────────────────────────────
const DEMO_EMAIL = 'demo@singularity.com';
const DEMO_PASSWORD = 'demo1234';
const DEMO_USER: User = {
  id: 'demo-001',
  name: 'Sarah Mitchell',
  email: DEMO_EMAIL,
  role: 'General Manager',
  propertyId: 'SGM01',
};
const DEMO_TOKEN = 'demo-access-token';

function isDemoCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === DEMO_TOKEN) {
      // Demo session — restore instantly without API call
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }
    if (token) {
      authService.me()
        .then(setUser)
        .catch(() => localStorage.removeItem('access_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (isDemoCredentials(email, password)) {
      // Demo bypass — no backend required
      localStorage.setItem('access_token', DEMO_TOKEN);
      setUser(DEMO_USER);
      return;
    }
    const data = await authService.login({ email, password });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    setUser(data.user);
  };

  const logout = async () => {
    const token = localStorage.getItem('access_token');
    if (token !== DEMO_TOKEN) await authService.logout().catch(() => {});
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

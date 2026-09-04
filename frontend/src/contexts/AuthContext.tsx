import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

type Role = 'public' | 'volunteer' | 'coordinator';
export interface AuthUser { id: string; email: string; role: Role; }
interface AuthValue { user: AuthUser | null; token: string | null; login: (email: string, password: string, admin?: boolean) => Promise<void>; signup: (email: string, password: string, adminCode?: string) => Promise<void>; logout: () => void; }

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const AuthContext = createContext<AuthValue | null>(null);

function readUser(): AuthUser | null {
  const stored = localStorage.getItem('relieflanka_user');
  return stored ? JSON.parse(stored) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('relieflanka_token'));
  const [user, setUser] = useState<AuthUser | null>(readUser);

  const saveSession = (response: { token: string; user: AuthUser }) => {
    localStorage.setItem('relieflanka_token', response.token);
    localStorage.setItem('relieflanka_user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  };

  const login = async (email: string, password: string, admin = false) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password, admin });
    saveSession(response.data);
  };

  const signup = async (email: string, password: string, adminCode?: string) => {
    const endpoint = adminCode ? '/api/auth/admin/signup' : '/api/auth/signup';
    const response = await axios.post(`${API_URL}${endpoint}`, { email, password, ...(adminCode ? { adminCode } : {}) });
    saveSession(response.data);
  };

  const logout = () => {
    localStorage.removeItem('relieflanka_token');
    localStorage.removeItem('relieflanka_user');
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}

"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface HealthProfile {
  diabetes?: boolean;
  highBloodPressure?: boolean;
  heartDisease?: boolean;
  allergies?: string[];
  obesity?: boolean;
  lactoseIntolerance?: boolean;
  kidneyDisease?: boolean;
  highCholesterol?: boolean;
  glutenIntolerance?: boolean;
  otherRestrictions?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  healthProfile: HealthProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: HealthProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Set Auth token in headers
  const setAuthHeader = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sb_token') : null;
      if (token) {
        setAuthHeader(token);
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Invalid token or session expired', err);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sb_token');
          }
          setAuthHeader(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, user: userData } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_token', token);
    }
    setAuthHeader(token);
    setUser(userData);
    router.push('/dashboard');
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await axios.post('/api/auth/register', { email, password, name });
    const { token, user: userData } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_token', token);
    }
    setAuthHeader(token);
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sb_token');
    }
    setAuthHeader(null);
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (healthProfile: HealthProfile) => {
    const res = await axios.put('/api/auth/profile', { healthProfile });
    setUser((prev) => prev ? { ...prev, healthProfile: res.data.user.healthProfile } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

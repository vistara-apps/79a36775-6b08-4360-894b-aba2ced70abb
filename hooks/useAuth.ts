import { useState, useEffect, createContext, useContext } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  farcaster_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio?: string;
  skills: string[];
  wallet_address?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (fid: number, walletAddress?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('gigflow_token');
    if (token) {
      apiClient.setToken(token);
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // Clear invalid token
      localStorage.removeItem('gigflow_token');
      apiClient.setToken('');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (fid: number, walletAddress?: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.authenticateWithFarcaster({
        fid,
        walletAddress,
      });

      if (response.success && response.data) {
        const { user, access_token } = response.data;
        setUser(user);
        
        if (access_token) {
          localStorage.setItem('gigflow_token', access_token);
          apiClient.setToken(access_token);
        }
      } else {
        throw new Error(response.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gigflow_token');
    apiClient.setToken('');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.updateUser(userData);
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };
}

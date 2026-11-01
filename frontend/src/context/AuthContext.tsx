import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, Address } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  addresses: Address[];
  fetchAddresses: () => Promise<void>;
  addAddress: (addrData: Partial<Address>) => Promise<boolean>;
  deleteAddress: (id: number) => Promise<boolean>;
  selectedPincode: string;
  setSelectedPincode: (pin: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('shopsphere_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>(
    localStorage.getItem('shopsphere_pincode') || '560034'
  );

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setStoredPincode = (pin: string) => {
    setSelectedPincode(pin);
    localStorage.setItem('shopsphere_pincode', pin);
  };

  const fetchProfile = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.user);
        await fetchAddresses();
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Session expired or invalid token');
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/auth/addresses');
      if (res.data.success) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const addAddress = async (addrData: Partial<Address>): Promise<boolean> => {
    try {
      const res = await api.post('/auth/addresses', addrData);
      if (res.data.success) {
        await fetchAddresses();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding address:', err);
      return false;
    }
  };

  const deleteAddress = async (id: number): Promise<boolean> => {
    try {
      const res = await api.delete(`/auth/addresses/${id}`);
      if (res.data.success) {
        await fetchAddresses();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting address:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('shopsphere_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        closeAuthModal();
        return { success: true, message: 'Welcome back!' };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      if (res.data.success) {
        localStorage.setItem('shopsphere_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        closeAuthModal();
        return { success: true, message: 'Account created successfully!' };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('shopsphere_token');
    setToken(null);
    setUser(null);
    setAddresses([]);
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateUser,
        addresses,
        fetchAddresses,
        addAddress,
        deleteAddress,
        selectedPincode,
        setSelectedPincode: setStoredPincode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


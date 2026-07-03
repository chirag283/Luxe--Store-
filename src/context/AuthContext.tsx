/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const activeSession = localStorage.getItem('active_user');
    return activeSession ? JSON.parse(activeSession) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Artificial latency for loading state demonstration
    await new Promise((resolve) => setTimeout(resolve, 600));

    const storedUsersJson = localStorage.getItem('registered_users') || '[]';
    const users = JSON.parse(storedUsersJson);

    const foundUser = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userProfile: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone || '',
        address: foundUser.address || '',
        createdAt: foundUser.createdAt,
      };
      localStorage.setItem('active_user', JSON.stringify(userProfile));
      setUser(userProfile);
      return true;
    }

    // Standard fallback fallback demo account
    if (email.toLowerCase() === 'user@example.com' && password === 'password') {
      const demoUser: User = {
        id: 'demo-123',
        name: 'John Doe',
        email: 'user@example.com',
        phone: '+1 (555) 019-2834',
        address: '123 Luxury Avenue, Suite 400, New York, NY 10001',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('active_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return true;
    }

    throw new Error('Invalid email or password');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const storedUsersJson = localStorage.getItem('registered_users') || '[]';
    const users = JSON.parse(storedUsersJson);

    const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists || email.toLowerCase() === 'user@example.com') {
      throw new Error('An account with this email already exists.');
    }

    const newUserRecord = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      name,
      email: email.toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
      phone: '',
      address: '',
    };

    users.push(newUserRecord);
    localStorage.setItem('registered_users', JSON.stringify(users));

    // Auto login
    const userProfile: User = {
      id: newUserRecord.id,
      name: newUserRecord.name,
      email: newUserRecord.email,
      phone: '',
      address: '',
      createdAt: newUserRecord.createdAt,
    };
    localStorage.setItem('active_user', JSON.stringify(userProfile));
    setUser(userProfile);

    return true;
  };

  const logout = () => {
    localStorage.removeItem('active_user');
    setUser(null);
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedUsersJson = localStorage.getItem('registered_users') || '[]';
    const users = JSON.parse(storedUsersJson);

    const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase()) || 
                   email.toLowerCase() === 'user@example.com';
    
    if (!exists) {
      throw new Error('No account found with this email address.');
    }
    return true;
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('active_user', JSON.stringify(newUser));

    // Update in registered_users as well
    const storedUsersJson = localStorage.getItem('registered_users') || '[]';
    const users = JSON.parse(storedUsersJson);
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      localStorage.setItem('registered_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
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

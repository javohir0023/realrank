"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// User interface - single source of truth
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "realrate_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Save user to localStorage
  const saveUser = useCallback((userData: User | null) => {
    if (userData) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setUser(userData);
  }, []);

  // Register function
  const register = useCallback(
    async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      // Validation
      if (!name.trim()) {
        return { success: false, error: "Name is required" };
      }
      if (!email.trim()) {
        return { success: false, error: "Email is required" };
      }
      if (!password) {
        return { success: false, error: "Password is required" };
      }

      // Password validation
      if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
      }
      if (!/[A-Z]/.test(password)) {
        return { success: false, error: "Password must contain at least one uppercase letter" };
      }
      if (!/[!@#$%^&*]/.test(password)) {
        return { success: false, error: "Password must contain at least one special character (!@#$%^&*)" };
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: "Invalid email format" };
      }

      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem("realrate_users") || "[]");
      if (existingUsers.find((u: User) => u.email === email)) {
        return { success: false, error: "Email already registered" };
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
      };

      // Save user to "database"
      existingUsers.push({ ...newUser, password });
      localStorage.setItem("realrate_users", JSON.stringify(existingUsers));

      // Set current user
      saveUser(newUser);

      return { success: true };
    },
    [saveUser]
  );

  // Login function
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!email.trim()) {
        return { success: false, error: "Email is required" };
      }
      if (!password) {
        return { success: false, error: "Password is required" };
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find user in "database"
      const existingUsers = JSON.parse(localStorage.getItem("realrate_users") || "[]");
      const foundUser = existingUsers.find(
        (u: User & { password: string }) =>
          u.email === email.toLowerCase().trim() && u.password === password
      );

      if (!foundUser) {
        return { success: false, error: "Invalid email or password" };
      }

      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = foundUser;
      saveUser(userWithoutPassword);

      return { success: true };
    },
    [saveUser]
  );

  // Logout function
  const logout = useCallback(() => {
    saveUser(null);
  }, [saveUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

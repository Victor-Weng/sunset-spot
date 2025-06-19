import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock demo user for testing
const DEMO_USER: User = {
  id: "demo-user-id",
  email: "demo@spot.com",
  username: "demo",
  displayName: "Demo User",
  bio: "Nature enthusiast and photographer 🌲📸",
  profilePhoto: "",
  isPrivate: false,
  followersCount: 1247,
  followingCount: 389,
  postsCount: 52,
  createdAt: new Date("2023-01-01").toISOString(),
  updatedAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and then set demo user
    const timer = setTimeout(() => {
      setUser(DEMO_USER);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate login - always succeeds with demo user
      setUser(DEMO_USER);
      return {};
    } catch (error) {
      return { error: "Login simulation - this always succeeds" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    try {
      setIsLoading(true);
      // Simulate registration - always succeeds with demo user
      setUser({ ...DEMO_USER, email, username, displayName });
      return {};
    } catch (error) {
      return { error: "Registration simulation - this always succeeds" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // For demo purposes, just reset to demo user instead of logging out
      setUser(DEMO_USER);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return { error: "No user found" };

      // Update the demo user with new data
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setUser(updatedUser);

      return {};
    } catch (error) {
      return { error: "Profile update simulation - this always succeeds" };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

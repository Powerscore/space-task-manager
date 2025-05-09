"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === "/login" || pathname === "/signup";
      /*
      if (!user && !isAuthPage && pathname !== "/") {
        router.push("/login")
      } else if (user && isAuthPage) {
        router.push("/dashboard")
      }
        */
    }
  }, [user, loading, pathname, router]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      const mockUser = {
        id: "user-1",
        name: "Astronaut",
        email,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      router.push("/dashboard");

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful registration
      const mockUser = {
        id: "user-" + Date.now(),
        name,
        email,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      router.push("/dashboard");

      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again with different credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");

    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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

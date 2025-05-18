import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getCurrentUser,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut
} from 'aws-amplify/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if someone is signed in
  useEffect(() => {
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser({ id: u.username, name: u.username, email: u.username });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function signIn(email, password) {
    setLoading(true);
    try {
      await authSignIn({ username: email, password });
      const u = await getCurrentUser();
      setUser({ id: u.username, name: u.username, email: u.username });
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function signUp(name, email, password) {
    setLoading(true);
    try {
      await authSignUp({
        username: email,
        password,
        options: { userAttributes: { name, email } }
      });
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    try {
      await authSignOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
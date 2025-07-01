
/**
 * ─────────────────────────────────────────
 * 🔐 AUTH CONTEXT: Manages user authentication state
 * ─────────────────────────────────────────
 * 
 * Purpose: Centralized auth state management with Supabase
 * Dependencies: @supabase/supabase-js
 * 
 * Features:
 * - Email/password authentication with verification
 * - Auto-sync user profiles on signup
 * - Persistent session management
 * - User preference syncing (theme, background)
 * 
 * Usage: Wrap app with <AuthProvider> and use useAuth() hook
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUserPreferences: (theme: string, background: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ─────────────────────────────────────────
    // 🔄 AUTH STATE LISTENER: Handle auth changes
    // ─────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─────────────────────────────────────────
  // 📧 SIGN UP: Email verification required
  // ─────────────────────────────────────────
  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  // ─────────────────────────────────────────
  // 🔑 SIGN IN: Standard email/password login
  // ─────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // ─────────────────────────────────────────
  // 🚪 SIGN OUT: Clear session and redirect
  // ─────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // ─────────────────────────────────────────
  // ⚙️ UPDATE PREFERENCES: Save theme & background
  // ─────────────────────────────────────────
  const updateUserPreferences = async (theme: string, background: string) => {
    if (!user) return;
    
    await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        selected_theme: theme,
        selected_background: background,
        updated_at: new Date().toISOString()
      });
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserPreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

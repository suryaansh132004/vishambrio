'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<{ error: any; emailChangePending?: boolean }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Rider',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Listen to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Rider',
          email: session.user.email || '',
        });

        // Sync email_verified status into our public.users table
        const isEmailConfirmed = !!session.user.email_confirmed_at;
        await supabase
          .from('users')
          .update({ email_verified: isEmailConfirmed })
          .eq('id', session.user.id);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signup = async (email: string, password: string, name: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    // data.user exists even when email confirmation is pending (session is null).
    // Only attempt the phone update if the trigger has had time to create the row,
    // which is guaranteed once email is confirmed — but we try optimistically here
    // and silently ignore if the row isn't ready yet.
    if (!error && data.user && phone) {
      await supabase
        .from('users')
        .update({ phone: phone.trim() })
        .eq('id', data.user.id);
    }

    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: { name?: string; email?: string }) => {
    try {
      const authUpdates: { data?: { name: string }; email?: string } = {};
      if (updates.name) authUpdates.data = { name: updates.name };
      if (updates.email) authUpdates.email = updates.email;

      const { error } = await supabase.auth.updateUser(authUpdates);
      if (error) return { error };

      // Sync name to public.users — treat a failed write as an error
      if (updates.name && user?.id) {
        const { error: dbError } = await supabase
          .from('users')
          .update({ name: updates.name })
          .eq('id', user.id);
        if (dbError) return { error: dbError };
        setUser((prev) => prev ? { ...prev, name: updates.name! } : prev);
      }

      return { error: null, emailChangePending: !!updates.email };
    } catch (e: any) {
      return { error: e };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

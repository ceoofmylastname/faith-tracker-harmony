import React, { createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from './auth/useAuthState';
import { signUpUser, signInUser, signOutUser } from './auth/authOperations';
import { AuthContextType } from './auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { user, loading } = useAuthState();

  const signUp = async (email: string, password: string, name?: string) => {
    await signUpUser(email, password, toast, name);
  };

  const signIn = async (email: string, password: string) => {
    await signInUser(email, password, toast);
  };

  const signOut = async () => {
    await signOutUser(toast);
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
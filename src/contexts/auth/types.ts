import { User } from '@supabase/supabase-js';

export interface AuthToast {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}
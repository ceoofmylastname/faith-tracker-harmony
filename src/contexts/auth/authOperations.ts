import { supabase } from '@/lib/supabase';
import { AuthToast } from './types';

export const signUpUser = async (
  email: string, 
  password: string, 
  showToast: (props: AuthToast) => void,
  name?: string
) => {
  try {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });

    if (error) throw error;

    if (user) {
      showToast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    }
  } catch (error: any) {
    showToast({
      variant: "destructive",
      title: "Error signing up",
      description: error.message,
    });
    throw error;
  }
};

export const signInUser = async (
  email: string, 
  password: string,
  showToast: (props: AuthToast) => void
) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    showToast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
  } catch (error: any) {
    showToast({
      variant: "destructive",
      title: "Error signing in",
      description: error.message,
    });
    throw error;
  }
};

export const signOutUser = async (showToast: (props: AuthToast) => void) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    showToast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  } catch (error: any) {
    showToast({
      variant: "destructive",
      title: "Error signing out",
      description: error.message,
    });
    throw error;
  }
};
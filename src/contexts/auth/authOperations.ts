import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/ui/use-toast';

export const signUpUser = async (
  email: string, 
  password: string, 
  name?: string,
  toast: (props: Toast) => void
) => {
  try {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      if (error.message.includes('User already registered')) {
        toast({
          variant: "destructive",
          title: "Account Already Exists",
          description: "This email is already registered. Please sign in instead.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
      throw error;
    }

    if (user && name) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id);

      if (profileError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save profile information",
        });
        throw profileError;
      }
    }
    
    toast({
      title: "Success!",
      description: "Please check your email for verification link",
    });
    
    return user;
  } catch (error: any) {
    throw error;
  }
};

export const signInUser = async (
  email: string, 
  password: string,
  toast: (props: Toast) => void
) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
    
    toast({
      title: "Welcome back!",
      description: "Successfully signed in",
    });
  } catch (error: any) {
    throw error;
  }
};

export const signOutUser = async (toast: (props: Toast) => void) => {
  try {
    localStorage.removeItem('supabase.auth.token');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
      throw error;
    }
    
    toast({
      title: "Goodbye!",
      description: "Successfully signed out",
    });

    window.location.reload();
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw error;
  }
};
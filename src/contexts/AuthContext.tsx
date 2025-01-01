import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            variant: "destructive",
            title: "Account Already Exists",
            description: "This email is already registered. Please sign in instead.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          })
        }
        throw error
      }

      if (user && name) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ name })
          .eq('id', user.id)

        if (profileError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to save profile information",
          })
          throw profileError
        }
      }
      
      toast({
        title: "Success!",
        description: "Please check your email for verification link",
      })
    } catch (error: any) {
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        })
        throw error
      }
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      })
    } catch (error: any) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      // First clear any local storage data
      localStorage.removeItem('supabase.auth.token')
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message,
        })
        throw error
      }
      
      // Clear user state
      setUser(null)
      
      // Show success message
      toast({
        title: "Goodbye!",
        description: "Successfully signed out",
      })

      // Force reload the page to clear any remaining state
      window.location.reload()
    } catch (error: any) {
      console.error('Sign out error:', error)
      // Even if there's an error, we should try to clear the user state
      setUser(null)
      throw error
    }
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useToast } from '@/components/ui/use-toast'

interface AuthContextType {
  user: User | null
  signUp: (email: string, password: string) => Promise<void>
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
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        // Check if the error is due to existing user
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
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        })
        throw error
      }
      toast({
        title: "Goodbye!",
        description: "Successfully signed out",
      })
    } catch (error: any) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
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
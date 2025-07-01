"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from './firebase'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const createUserProfile = async (firebaseUser: User) => {
    try {
      console.log("Creating user profile for:", firebaseUser.uid, firebaseUser.email)
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: firebaseUser.uid,
          email: firebaseUser.email || ''
        })
        .select()

      console.log("Insert result:", { data, error })

      if (error) {
        if (error.code === '23505') { // Duplicate key error - user already exists
          console.log('User profile already exists, skipping creation')
          return
        } else {
          // Log other errors individually to avoid serialization issues
          console.error('Supabase error creating user profile:')
          console.error('Error code:', error.code)
          console.error('Error message:', error.message)
          console.error('Error details:', error.details)
          console.error('Error hint:', error.hint)
          throw error
        }
      } else {
        console.log('User profile created successfully:', data)
      }
    } catch (error) {
      // Only log errors that aren't duplicate key errors
      if (error instanceof Error && !error.message.includes('23505')) {
        console.error('Error creating user profile:', error.message)
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Create user profile in Supabase if user exists
        await createUserProfile(user)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 
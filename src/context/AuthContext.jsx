import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    
    if (error) throw error
    
    // Profile is now created automatically by database trigger
    // No need for manual insertion
    
    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Password reset - Step 1: Send password reset email with token
  const sendPasswordResetOTP = async (email) => {
    // Use resetPasswordForEmail which is designed for password reset
    // This sends a recovery token (can be displayed as OTP if email template configured)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return data
  }

  // Password reset - Step 2: Verify token and reset password
  const verifyOtpAndResetPassword = async (email, token, newPassword) => {
    // For password reset, we verify with type 'recovery'
    // This is the correct type for resetPasswordForEmail tokens
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery' // Use 'recovery' type for password reset
    })
    
    if (error) throw error
    
    // After successful verification, session is created with permission to update password
    // Now update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (updateError) throw updateError
    
    return data
  }

  // Update password (legacy method, kept for compatibility)
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  }

  // Sign in with OTP (magic link alternative)
  const signInWithOTP = async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
    return data
  }

  const value = {
    signUp,
    signIn,
    signOut,
    sendPasswordResetOTP,
    verifyOtpAndResetPassword,
    updatePassword,
    signInWithOTP,
    user,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

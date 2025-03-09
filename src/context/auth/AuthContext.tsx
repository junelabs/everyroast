import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AuthContextProps } from './types';
import { fetchProfile, signUpUser, signInUser, signOutUser, updateUserProfile } from './authUtils';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('[AuthProvider] Initializing');

  useEffect(() => {
    let isMounted = true;
    console.log('[AuthProvider] Setting up auth state listener');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      console.log('[AuthProvider] Initial session:', session ? 'Exists' : 'None');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('[AuthProvider] User exists in session, fetching profile');
        fetchUserProfile(session.user.id);
      } else {
        console.log('[AuthProvider] No user in session, setting isLoading=false');
        setIsLoading(false);
        setAuthInitialized(true);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('[AuthProvider] Auth state changed:', event, session ? 'Session exists' : 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('[AuthProvider] User exists after state change, fetching profile');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('[AuthProvider] No user after state change, clearing profile');
          setProfile(null);
          setIsLoading(false);
          setAuthInitialized(true);
        }

        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    return () => {
      console.log('[AuthProvider] Cleaning up auth state listener');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('[AuthProvider] Starting profile fetch for user:', userId);
      setIsLoading(true);
      const data = await fetchProfile(userId);
      console.log('[AuthProvider] Profile fetch result:', data);
      setProfile(data);
    } catch (error) {
      console.error('[AuthProvider] Error fetching profile:', error);
      setProfile(null);
    } finally {
      console.log('[AuthProvider] Profile fetch complete, setting isLoading=false');
      setIsLoading(false);
      setAuthInitialized(true);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { full_name?: string, username?: string }) => {
    try {
      setIsLoading(true);
      await signUpUser(email, password, metadata);
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInUser(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to EveryRoast!",
      });
      
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid login credentials.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await signOutUser();
      
      // Clear the local state
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // No need to navigate here as we'll do it in the component
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('User not authenticated');
      
      await updateUserProfile(user.id, updates);
      
      // Refetch the profile to get the updated data
      await fetchUserProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    authInitialized,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  console.log('[AuthProvider] Current auth state:', {
    hasSession: !!session,
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading,
    authInitialized
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth was called outside of AuthProvider! Check component hierarchy.');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

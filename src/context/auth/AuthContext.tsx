
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AuthContextProps, Profile } from './types';
import { fetchProfile, signUpUser, signInUser, signOutUser, updateUserProfile } from './authUtils';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('[AuthProvider] Initializing');

  useEffect(() => {
    let isMounted = true;
    console.log('[AuthProvider] Setting up auth state listener');
    
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        if (error) {
          console.error('[AuthProvider] Error getting session:', error);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        const { session } = data;
        console.log('[AuthProvider] Initial session:', session ? 'Exists' : 'None');
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          console.log('[AuthProvider] User exists in session, fetching profile');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('[AuthProvider] No user in session, setting isLoading=false');
          setIsLoading(false);
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error('[AuthProvider] Error initializing auth:', error);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('[AuthProvider] Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider] User signed out, clearing state');
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          setAuthInitialized(true);
          navigate('/login');
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('[AuthProvider] User signed in or token refreshed:', event);
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
      console.log('[AuthProvider] Signing out user');
      setIsLoading(true);
      await signOutUser();
      
      // Note: The onAuthStateChange event will handle state clearing and navigation
      console.log('[AuthProvider] Signout called successfully');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out from your account.",
      });
    } catch (error: any) {
      console.error("[AuthProvider] Error during sign out:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
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

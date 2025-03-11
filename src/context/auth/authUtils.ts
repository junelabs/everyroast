
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('[authUtils] Fetching profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[authUtils] Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('[authUtils] Error fetching profile:', error);
    return null;
  }
};

export const signUpUser = async (
  email: string, 
  password: string, 
  metadata?: { full_name?: string, username?: string }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  if (error) throw error;
  return data;
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  console.log('[authUtils] Signing out user');
  try {
    // Get current session to check if it exists before attempting to sign out
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.log('[authUtils] No active session found, sign out not needed');
      return; // Return early if no session exists
    }
    
    // Force signout ignoring errors to ensure client-side session is cleared
    await supabase.auth.signOut({ scope: 'local' });
    console.log('[authUtils] Sign out successful');
  } catch (error) {
    console.error('[authUtils] Caught exception during sign out:', error);
    // We don't throw the error here to ensure the UI state is always updated
    // even if the backend signout fails
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<Profile>) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
};

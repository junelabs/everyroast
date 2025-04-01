
import { supabase } from "@/integrations/supabase/client";

export interface RoasterSubmission {
  id: string;
  name: string;
  city: string;
  state: string;
  website?: string | null;
  instagram?: string | null;
  user_id?: string | null;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Fetch all submissions for a user
export const fetchUserSubmissions = async (): Promise<RoasterSubmission[]> => {
  try {
    const { data, error } = await supabase
      .from('roaster_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as RoasterSubmission[];
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return [];
  }
};

// Create a new roaster submission
export const createRoasterSubmission = async (
  submission: Omit<RoasterSubmission, 'id' | 'created_at' | 'status'>
): Promise<RoasterSubmission | null> => {
  try {
    const { data, error } = await supabase
      .from('roaster_submissions')
      .insert(submission)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as RoasterSubmission;
  } catch (error) {
    console.error('Error creating roaster submission:', error);
    return null;
  }
};

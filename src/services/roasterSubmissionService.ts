
import { supabase } from "@/integrations/supabase/client";

export interface RoasterSubmission {
  id: string;
  name: string;
  city: string;
  state: string;
  website?: string | null;
  instagram?: string | null;
  email?: string | null;
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
    console.log("Creating submission with data:", submission);
    
    // Prepare submission data without explicitly setting user_id to null
    // This is important for anonymous submissions with RLS
    const submissionData = {
      name: submission.name,
      city: submission.city,
      state: submission.state,
      website: submission.website || null,
      instagram: submission.instagram || null,
      email: submission.email || null,
    };
    
    // Only add user_id if it exists and is not null
    if (submission.user_id) {
      Object.assign(submissionData, { user_id: submission.user_id });
    }

    console.log("Final submission data being sent to Supabase:", submissionData);
    
    const { data, error } = await supabase
      .from('roaster_submissions')
      .insert(submissionData)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error during submission:', error);
      throw error;
    }
    
    console.log("Submission successful, returned data:", data);
    return data as RoasterSubmission;
  } catch (error) {
    console.error('Error creating roaster submission:', error);
    throw error; // Re-throw the error to handle it in the component
  }
};

// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ekneavyneozehordnmuq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbmVhdnluZW96ZWhvcmRubXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzMyOTUsImV4cCI6MjA1Njk0OTI5NX0.ZkAO4c-okopJ3s73QpV7zK8t0uhJM2UhYQCz0zV8wP8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
import { createClient } from '@supabase/supabase-js';

// Correctly accessing the Vite-prefixed environment variables
const supabaseUrl = 'https://rvdzlpbdyrotuncjylae.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZHpscGJkeXJvdHVuY2p5bGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NzIxNDksImV4cCI6MjA2NjI0ODE0OX0.QC_N99EgDkyUuzQLUkbXjwXOG98vw_5FcKytCRFJzUA';

// Log to check if the environment variables are loaded
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);

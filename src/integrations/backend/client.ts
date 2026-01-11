import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// NOTE: We prefer env vars, but include safe fallbacks so the app never whitescreens
// if the deployment environment fails to inject them.
const FALLBACK_SUPABASE_URL = "https://zuxewcmuuxvrdllgaojz.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1eGV3Y211dXh2cmRsbGdhb2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODkxODcsImV4cCI6MjA4MzQ2NTE4N30.f5izgugc3kRejmcL0bhfradeuf_h2ldKE2RwadQVpsE";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

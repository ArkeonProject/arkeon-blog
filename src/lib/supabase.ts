import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Interface for global variables during build time (Node.js)
interface GlobalNodeProcess {
  process?: {
    env?: Record<string, string | undefined>;
  };
}

// Robust environment variable access for both Vite (client) and Node.js (prerender/server)
const getEnv = (key: string): string | undefined => {
  // Vite client-side
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Node.js server-side (prerender) - Safe cast to avoid 'any'
  const nodeEnv = (globalThis as unknown as GlobalNodeProcess).process?.env;
  if (nodeEnv && nodeEnv[key]) {
    return nodeEnv[key];
  }
  
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || "";
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || "";

// Only initialize if both are present to prevent crash during build time if env is partially missing
// We use a cast through 'unknown' to avoid the 'any' linter error while satisfying consumer types.
// If accessed when null (due to missing env vars), it will naturally throw which is preferred over a build crash.
export const supabase = (supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null) as unknown as SupabaseClient;

if (!supabase) {
  // In production, this would be an error, but during build time we just warn
  console.warn("Supabase client initialized as null. Check environment variables.");
}
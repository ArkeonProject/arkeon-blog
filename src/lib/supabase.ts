import { createClient } from '@supabase/supabase-js'

// Robust environment variable access for both Vite (client) and Node.js (prerender/server)
const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process.env && (globalThis as any).process.env[key]) {
    return (globalThis as any).process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || "";
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || "";

// Only initialize if both are present to prevent crash during build time if env is partially missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : (null as any);

if (!supabase) {
  console.warn("Supabase client initialized as null. Check environment variables.");
}
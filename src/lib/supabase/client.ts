"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for the ESGen tool.
 *
 * The site ships as a static export (no server), so all auth and data access
 * runs client-side against Supabase. The anon key is public by design; Row
 * Level Security (see supabase/schema.sql) is what actually protects each
 * workspace's data.
 *
 * When the env vars are absent (e.g. before the user has wired up their own
 * project) `getSupabase()` returns null and the UI shows a setup notice rather
 * than crashing.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) {
    client = createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

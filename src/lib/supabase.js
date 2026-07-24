import { createClient } from '@supabase/supabase-js';

// .env.local 에 값이 없으면 Supabase 기능(방명록/RSVP)은 자동으로 비활성화된다.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseReady = Boolean(url && anonKey);

export const supabase = isSupabaseReady ? createClient(url, anonKey) : null;

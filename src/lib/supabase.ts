import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Space Heritage Explorer] Supabase environment variables missing. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Client-safe Supabase instance with public anon permissions only
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

/**
 * Helper to construct public CDN URL for equipment images
 */
export function getEquipmentImageUrl(storagePath: string): string {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/equipment-images/${encodeURIComponent(storagePath).replace(/%2F/g, '/')}`;
}

/**
 * Helper to construct public URL for 3D GLB models.
 * Prioritizes verified local public assets to guarantee 100% offline & runtime reliability.
 */
export function getModel3DUrl(storagePath: string): string {
  if (!storagePath) return '';
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  const cleanPath = storagePath.replace(/^\/?(models\/)?/, '');
  return `/models/${cleanPath}`;
}

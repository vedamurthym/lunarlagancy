import { supabase, isSupabaseConfigured, getEquipmentImageUrl, getModel3DUrl } from '@/lib/supabase';
import type { EquipmentRecord, EquipmentCategory, Model3D, EquipmentImage } from '@/types';

/**
 * In-memory client cache to avoid repeated queries when navigating
 * between equipment detail pages and planets.
 */
const equipmentCache = new Map<string, EquipmentRecord>();
let equipmentListCache: EquipmentRecord[] | null = null;

export async function getEquipmentList(): Promise<{ data: EquipmentRecord[] | null; error: Error | null }> {
  if (equipmentListCache) {
    return { data: equipmentListCache, error: null };
  }

  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('id, slug, name, category, equipment_type, target_body, short_description, model_3d_id, models_3d(*)')
      .order('category', { ascending: true });

    if (error) throw error;
    equipmentListCache = data as unknown as EquipmentRecord[];
    return { data: equipmentListCache, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getEquipmentById(id: string): Promise<{ data: EquipmentRecord | null; error: Error | null }> {
  // Check memory cache first
  if (equipmentCache.has(id)) {
    return { data: equipmentCache.get(id)!, error: null };
  }

  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*, models_3d(*), equipment_images(*), sources(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    const record = data as unknown as EquipmentRecord;

    // Sort equipment images by display_order and resolve public CDN storage URLs
    if (record.equipment_images && Array.isArray(record.equipment_images)) {
      record.equipment_images.sort(
        (a: EquipmentImage, b: EquipmentImage) => (a.display_order ?? 0) - (b.display_order ?? 0)
      );
      record.equipment_images.forEach((img: EquipmentImage) => {
        if (img.storage_path && !img.storage_path.startsWith('http')) {
          img.storage_path = getEquipmentImageUrl(img.storage_path);
        }
      });
      record.images = record.equipment_images;
    }

    // Resolve public CDN URL for the 3D model if present
    if (record.models_3d && record.models_3d.storage_path) {
      if (!record.models_3d.storage_path.startsWith('http')) {
        record.models_3d.storage_path = getModel3DUrl(record.models_3d.storage_path);
      }
    }

    // Cache the resolved record
    equipmentCache.set(id, record);

    return { data: record, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getEquipmentByCategory(
  category: EquipmentCategory
): Promise<{ data: EquipmentRecord[] | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('id, slug, name, category, equipment_type, target_body, short_description, model_3d_id, models_3d(*)')
      .eq('category', category);

    if (error) throw error;
    return { data: data as unknown as EquipmentRecord[], error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getModel3DById(modelId: string): Promise<{ data: Model3D | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  try {
    const { data, error } = await supabase
      .from('models_3d')
      .select('*')
      .eq('id', modelId)
      .single();

    if (error) throw error;
    return { data: data as Model3D, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

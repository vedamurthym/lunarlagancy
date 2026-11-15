/**
 * Space Heritage Explorer — TypeScript Type Definitions
 */

export type Destination = 'moon' | 'mars' | 'deep-space' | 'home';

export type EquipmentCategory = 'Moon' | 'Mars' | 'Deep Space';

export type ModelFormat = 'glb' | 'gltf';

export interface Model3D {
  id: string;
  name: string;
  storage_path: string;
  format: ModelFormat;
  description?: string;
  source_attribution?: string;
  is_shared_asset: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ImagePurpose =
  | 'hero'
  | 'technical_diagram'
  | 'surface_view'
  | 'science_sample'
  | 'memorial'
  | 'context_map'
  | 'orbit_view';

export interface EquipmentImage {
  id: string;
  equipment_id: string;
  title: string;
  storage_path: string;
  caption: string;
  description?: string;
  source_url?: string;
  nasa_photo_id?: string;
  purpose: ImagePurpose;
  display_order: number;
}

export interface EquipmentSource {
  source_id: string;
  title: string;
  url: string;
  publishing_organization: string;
  source_type: string;
  publication_date?: string;
  topics_supported: string[];
}

export interface EquipmentRecord {
  id: string;
  slug: string;
  name: string;
  alternate_designations?: string[];
  category: EquipmentCategory;
  equipment_type: string;
  target_body: string;
  short_description: string;
  model_3d_id?: string | null;
  models_3d?: Model3D | null;
  topics?: Record<string, unknown>;
  verification_status?: Record<string, unknown>;
  images?: EquipmentImage[];
  equipment_images?: EquipmentImage[];
  sources?: EquipmentSource[];
  created_at?: string;
  updated_at?: string;
}

export interface NavItem {
  label: string;
  path: string;
  description: string;
  badge?: string;
}

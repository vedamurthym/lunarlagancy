# Step 3.3: Supabase Data Structure Recommendation
## Space Heritage Explorer Project

**Date:** 2026-11-14  
**Target Architecture:** Supabase (PostgreSQL 15+, PostgREST, Supabase Storage, Row Level Security)  
**Frontend Client:** React + TypeScript + Vite + TailwindCSS + Three.js (`@react-three/fiber`)  

---

## 1. Executive Recommendation: Hybrid Relational + JSONB Architecture

For the Space Heritage Explorer project, we recommend a **Hybrid Relational + JSONB Architecture**.

In this architecture:
- Core metadata, foreign keys, media assets, categories, and 3D models are **fully normalized into relational PostgreSQL tables**.
- The deep, highly variable seven-topic narrative content is stored as **structured JSONB** within a `topics` column in the primary `equipment` table.

---

## 2. Architectural Comparison: Pure Relational vs. Pure JSON vs. Hybrid

| Evaluation Criteria | Pure Relational (15+ Tables) | Pure Document (1 Monolithic Table) | **Recommended: Hybrid Relational + JSONB** |
| :--- | :--- | :--- | :--- |
| **Schema Flexibility** | **Poor:** Every variation between vehicles (e.g. ion thrusters vs. rotor RPM vs. lunar rover wheels) requires sparse columns or deep joining tables. | **High:** Everything is stored in one document. | **Optimal:** Core relational fields are strongly typed; rich variable narratives remain flexible without schema migrations. |
| **Query Performance for Filters** | **High:** Native indexes on `category`, `status`, `target_body`. | **Moderate:** Requires functional GIN expression indexes for simple filters. | **Highest:** Fast B-tree indexes on `category`, `equipment_type`, `slug`; instant queries for UI lists. |
| **Media Asset Reusability (Shared 3D Models)** | **High:** Separate table for models. | **Poor:** Duplicates model metadata inside both Spirit and Opportunity documents. | **Optimal:** Dedicated `models_3d` table referenced via foreign key (`model_3d_id`), perfectly handling the 4-model / 6-record Mars requirement. |
| **Supabase PostgREST & React API Fit** | **Complex:** Deep multi-level joins required to fetch one complete equipment page (`select=*,topics(*,instruments(*),timeline(*))`). | **Simple:** Fetches entire JSON blob. | **Clean & Intuitive:** Single query (`supabase.from('equipment').select('*, model:models_3d(*), images(*)')`) returns a complete, typed TypeScript object. |
| **PostgreSQL Full-Text Search** | **Moderate:** Requires multi-table tsvector joins. | **High:** Native GIN indexing on JSONB. | **High:** PostgreSQL `to_tsvector('english', topics)` creates lightning-fast full-text search across all 91 topic sections. |

---

## 3. Recommended Supabase PostgreSQL Schema DDL

The following schema illustrates how the JSON schema maps directly to Supabase tables:

```sql
-- 1. Create Enums for Domain Categories and Equipment Types
CREATE TYPE equipment_category AS ENUM ('Moon', 'Mars', 'Deep Space');
CREATE TYPE model_format AS ENUM ('glb', 'gltf');
CREATE TYPE image_purpose AS ENUM ('hero', 'technical_diagram', 'surface_view', 'science_sample', 'memorial');

-- 2. Shared 3D Models Table (Handles 4 Mars models across 6 records)
CREATE TABLE public.models_3d (
    id VARCHAR(64) PRIMARY KEY, -- e.g., 'model_mars_mer_rover'
    name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL, -- Path inside Supabase Storage bucket '3d-models'
    format model_format NOT NULL DEFAULT 'glb',
    description TEXT,
    source_attribution TEXT,
    is_shared_asset BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Primary Equipment Table (Core Metadata + Structured JSONB Topics)
CREATE TABLE public.equipment (
    id VARCHAR(64) PRIMARY KEY, -- e.g., 'eq_moon_surveyor3'
    slug VARCHAR(128) UNIQUE NOT NULL, -- e.g., 'surveyor-3'
    name VARCHAR(255) NOT NULL,
    alternate_designations TEXT[] DEFAULT '{}',
    category equipment_category NOT NULL,
    equipment_type VARCHAR(128) NOT NULL,
    target_body VARCHAR(128) NOT NULL,
    short_description TEXT NOT NULL,
    
    -- Foreign Key to 3D Model Asset (Nullable until collected)
    model_3d_id VARCHAR(64) REFERENCES public.models_3d(id) ON DELETE SET NULL,
    
    -- Structured JSONB containing the Seven Mandatory Topics
    topics JSONB NOT NULL,
    
    -- Verification and Pipeline Metadata
    verification_status JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- 4. Sources Table (Authoritative Provenance Catalog)
CREATE TABLE public.sources (
    id VARCHAR(64) PRIMARY KEY, -- e.g., 'src_surveyor3_ntrs_final_report'
    equipment_id VARCHAR(64) NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    publishing_organization VARCHAR(255) NOT NULL,
    source_type VARCHAR(128) NOT NULL,
    publication_date DATE,
    topics_supported TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Media Images Table (Photographs and Diagrams)
CREATE TABLE public.equipment_images (
    id VARCHAR(64) PRIMARY KEY,
    equipment_id VARCHAR(64) NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL, -- Path inside Supabase Storage bucket 'equipment-images'
    caption TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    nasa_photo_id VARCHAR(128),
    purpose image_purpose NOT NULL DEFAULT 'surface_view',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for Blazing-Fast Frontend Navigation & Search
CREATE INDEX idx_equipment_category ON public.equipment(category);
CREATE INDEX idx_equipment_slug ON public.equipment(slug);
CREATE INDEX idx_equipment_model_id ON public.equipment(model_3d_id);
CREATE INDEX idx_equipment_topics_gin ON public.equipment USING GIN (topics);
CREATE INDEX idx_sources_equipment_id ON public.sources(equipment_id);
CREATE INDEX idx_images_equipment_id ON public.equipment_images(equipment_id);

-- 7. Full-Text Search Index over the Entire Seven-Topic Content
CREATE INDEX idx_equipment_fts ON public.equipment 
USING GIN (to_tsvector('english', short_description || ' ' || (topics::text)));
```

---

## 4. How the Structure Handles the Mars 3D Model Requirement

A mandatory requirement is that **six Mars records share only four unique 3D model assets**:
1. `model_mars_ingenuity` (Ingenuity)
2. `model_mars_mer_rover` (**Shared by Spirit and Opportunity**)
3. `model_mars_sojourner` (Sojourner Rover & Pathfinder)
4. `model_mars_viking_lander` (**Shared by Viking 1 and Viking 2**)

### Relational Implementation:
- In the `models_3d` table, we insert exactly **four records**:
  ```sql
  INSERT INTO public.models_3d (id, name, storage_path, format, is_shared_asset) VALUES
  ('model_mars_ingenuity', 'Ingenuity Mars Helicopter', 'mars/ingenuity.glb', 'glb', false),
  ('model_mars_mer_rover', 'Mars Exploration Rover (MER)', 'mars/mer_rover.glb', 'glb', true),
  ('model_mars_sojourner', 'Sojourner Microrover', 'mars/sojourner.glb', 'glb', false),
  ('model_mars_viking_lander', 'Viking Mars Lander', 'mars/viking_lander.glb', 'glb', true);
  ```
- In the `equipment` table:
  - Spirit (`eq_mars_spirit`): sets `model_3d_id = 'model_mars_mer_rover'`.
  - Opportunity (`eq_mars_opportunity`): sets `model_3d_id = 'model_mars_mer_rover'`.
  - Viking 1 (`eq_mars_viking1`): sets `model_3d_id = 'model_mars_viking_lander'`.
  - Viking 2 (`eq_mars_viking2`): sets `model_3d_id = 'model_mars_viking_lander'`.

*Benefits:* Zero asset duplication, bandwidth efficiency, and shared material/lighting shaders on the React frontend.

---

## 5. Supabase Storage Integration Workflow

When media is collected in future steps, binary files will be stored in two dedicated Supabase Storage buckets:

1. **Bucket: `equipment-images` (Public CDN)**
   - Folders: `moon/`, `mars/`, `deep-space/`
   - File Naming: `<equipment_slug>/<purpose>_<nasa_id>.<ext>`
   - Database Field: `storage_path` in `equipment_images` stores `moon/surveyor-3/surface_as12_48_7134.jpg`.
   - Frontend Access:
     ```typescript
     const { data } = supabase.storage
       .from('equipment-images')
       .getPublicUrl('moon/surveyor-3/surface_as12_48_7134.jpg');
     ```

2. **Bucket: `3d-models` (Public CDN / Gzip/Brotli Optimized)**
   - Folders: `models/`
   - File Naming: `<model_id>.glb` (e.g. `models/model_mars_mer_rover.glb`)
   - Frontend Access with Three.js (`@react-three/drei`):
     ```typescript
     import { useGLTF } from '@react-three/drei';

     export function SpacecraftViewer({ modelPath }: { modelPath: string }) {
       const { scene } = useGLTF(modelPath);
       return <primitive object={scene} />;
     }
     ```

---

## 6. React + TypeScript Client Data Fetching Pattern

With PostgREST, a single typed API call retrieves the complete equipment view with all foreign-key relationships:

```typescript
// Define TypeScript interfaces matching the JSON Schema
export interface EquipmentRecord {
  id: string;
  slug: string;
  name: string;
  category: 'Moon' | 'Mars' | 'Deep Space';
  equipment_type: string;
  short_description: string;
  topics: SevenTopics;
  model_3d: Model3D | null;
  images: EquipmentImage[];
  sources: SourceReference[];
  verification_status: VerificationStatus;
}

// Single clean query via Supabase Client
export async function getEquipmentBySlug(slug: string): Promise<EquipmentRecord> {
  const { data, error } = await supabase
    .from('equipment')
    .select(`
      *,
      model_3d:models_3d(*),
      images:equipment_images(*),
      sources(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as EquipmentRecord;
}
```

This guarantees optimal frontend performance, zero client-side data massaging, and instant compatibility with future interactive features.

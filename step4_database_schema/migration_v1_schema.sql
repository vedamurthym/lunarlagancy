-- ============================================================================
-- Space Heritage Explorer — Supabase Database Migration (v1.0.0)
-- Step 4.2.1: Production Database Schema & Security Setup
-- Target: PostgreSQL 15+ / Supabase
-- ============================================================================

-- 0. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CUSTOM ENUMS
-- ============================================================================
CREATE TYPE equipment_category AS ENUM (
    'Moon', 
    'Mars', 
    'Deep Space'
);

CREATE TYPE model_format AS ENUM (
    'glb', 
    'gltf'
);

CREATE TYPE image_purpose AS ENUM (
    'hero', 
    'technical_diagram', 
    'surface_view', 
    'science_sample', 
    'memorial',
    'context_map',
    'orbit_view'
);

-- ============================================================================
-- 2. SHARED 3D MODELS TABLE
-- ============================================================================
-- Houses unique 3D visual models. Allows multiple equipment to share one model
-- (e.g. Spirit & Opportunity share 'model_mars_mer_rover'; Viking 1 & 2 share 'model_mars_viking_lander').
CREATE TABLE public.models_3d (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'model_mars_mer_rover'
    name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL, -- Relative path in Supabase Storage bucket '3d-models'
    format model_format NOT NULL DEFAULT 'glb',
    description TEXT,
    source_attribution TEXT,
    is_shared_asset BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. PRIMARY EQUIPMENT TABLE
-- ============================================================================
-- Central catalog table storing metadata, foreign keys, and the complete 7-topic JSONB tree.
CREATE TABLE public.equipment (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'eq_mars_spirit'
    slug VARCHAR(128) UNIQUE NOT NULL, -- e.g. 'spirit'
    name VARCHAR(255) NOT NULL,
    alternate_designations TEXT[] DEFAULT '{}',
    category equipment_category NOT NULL,
    equipment_type VARCHAR(128) NOT NULL,
    target_body VARCHAR(128) NOT NULL,
    short_description TEXT NOT NULL,
    
    -- Foreign Key referencing shared 3D model asset (nullable until assets are provisioned)
    model_3d_id VARCHAR(64) REFERENCES public.models_3d(id) ON DELETE SET NULL,
    
    -- Structured JSONB containing the Seven Mandatory Topics (immutable schema)
    topics JSONB NOT NULL,
    
    -- Verification and Pipeline Metadata
    verification_status JSONB NOT NULL,
    schema_version VARCHAR(32) DEFAULT '1.0.0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ============================================================================
-- 4. SOURCES TABLE (PROVENANCE & CITATIONS)
-- ============================================================================
-- Normalized source registry. Relates directly to equipment records and matches
-- topic-level 'source_refs' via (equipment_id, source_id).
CREATE TABLE public.sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id VARCHAR(64) NOT NULL, -- e.g. 'src_spirit_science_nasa', matched by topics.source_refs
    equipment_id VARCHAR(64) NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    publishing_organization VARCHAR(255) NOT NULL,
    source_type VARCHAR(128) NOT NULL,
    publication_date DATE,
    topics_supported TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique per equipment to avoid primary key collision across shared source URLs
    CONSTRAINT uq_equipment_source UNIQUE (equipment_id, source_id)
);

-- ============================================================================
-- 5. EQUIPMENT IMAGES TABLE (GALLERY & DIAGRAMS)
-- ============================================================================
-- Media table holding photographs, diagrams, and historical views for Supabase Storage CDN.
CREATE TABLE public.equipment_images (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'img_spirit_hero_01'
    equipment_id VARCHAR(64) NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL, -- Relative path in Supabase Storage bucket 'equipment-images'
    caption TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    nasa_photo_id VARCHAR(128),
    purpose image_purpose NOT NULL DEFAULT 'surface_view',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. AUTOMATIC UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_equipment_updated_at
BEFORE UPDATE ON public.equipment
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_models_3d_updated_at
BEFORE UPDATE ON public.models_3d
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 7. PERFORMANCE & FULL-TEXT SEARCH INDEXES
-- ============================================================================
CREATE INDEX idx_equipment_category ON public.equipment(category);
CREATE INDEX idx_equipment_slug ON public.equipment(slug);
CREATE INDEX idx_equipment_model_id ON public.equipment(model_3d_id);
CREATE INDEX idx_equipment_topics_gin ON public.equipment USING GIN (topics);
CREATE INDEX idx_sources_equipment_id ON public.sources(equipment_id);
CREATE INDEX idx_sources_source_id ON public.sources(source_id);
CREATE INDEX idx_images_equipment_id ON public.equipment_images(equipment_id);
CREATE INDEX idx_images_purpose ON public.equipment_images(purpose);

-- PostgreSQL GIN Full-Text Search index across short_description and all 7 topics
CREATE INDEX idx_equipment_fts ON public.equipment 
USING GIN (to_tsvector('english', short_description || ' ' || (topics::text)));

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS across all tables
ALTER TABLE public.models_3d ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_images ENABLE ROW LEVEL SECURITY;

-- 8.1 Public Read-Only Access (SELECT permitted for anon and authenticated users)
CREATE POLICY "Public read-only access for models_3d" 
ON public.models_3d FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Public read-only access for equipment" 
ON public.equipment FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Public read-only access for sources" 
ON public.sources FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Public read-only access for equipment_images" 
ON public.equipment_images FOR SELECT 
TO public 
USING (true);

-- 8.2 Explicit Grants (Explicitly grant SELECT only to anon and authenticated)
GRANT SELECT ON public.models_3d TO anon, authenticated;
GRANT SELECT ON public.equipment TO anon, authenticated;
GRANT SELECT ON public.sources TO anon, authenticated;
GRANT SELECT ON public.equipment_images TO anon, authenticated;

-- ============================================================================
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION & POLICIES (REFERENCE DDL)
-- ============================================================================
-- Insert public buckets if using Supabase SQL management
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('equipment-images', 'equipment-images', true),
    ('3d-models', '3d-models', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Access
CREATE POLICY "Public Access for Equipment Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'equipment-images');

CREATE POLICY "Public Access for 3D Models"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = '3d-models');

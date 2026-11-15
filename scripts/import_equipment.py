"""
Space Heritage Explorer — Supabase Server-Side Data Importer
Step 4: Secure Data Ingestion Script

Reads credentials from environment variables (.env):
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY as fallback)

Usage:
  python scripts/import_equipment.py --test-connection   # Only tests connection to Supabase REST API & checks tables
  python scripts/import_equipment.py --dry-run           # Validates and parses all 13 JSON records without sending HTTP requests
  python scripts/import_equipment.py --execute           # Executes the actual upsert into Supabase (Requires approval)
"""

import os
import sys
import json
import glob
import argparse
from typing import Dict, Any, List, Optional
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

# Active key preference: service_role key is required to bypass RLS during server-side import
ACTIVE_KEY = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
IS_SERVICE_ROLE = bool(SUPABASE_SERVICE_ROLE_KEY)


def get_headers() -> Dict[str, str]:
    if not ACTIVE_KEY:
        raise ValueError("Missing Supabase API key. Configure SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in .env")
    return {
        "apikey": ACTIVE_KEY,
        "Authorization": f"Bearer {ACTIVE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal"
    }


def test_connection() -> bool:
    """Verifies that the Supabase REST endpoint is reachable and table schemas exist."""
    print("=" * 60)
    print("SUPABASE CONNECTION DIAGNOSTIC")
    print("=" * 60)
    print(f"Supabase URL: {SUPABASE_URL or '[NOT CONFIGURED]'}")
    
    if not SUPABASE_URL:
        print("[ERROR] SUPABASE_URL is missing in .env")
        return False

    if not ACTIVE_KEY:
        print("[ERROR] Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_ANON_KEY is set in .env")
        return False

    if IS_SERVICE_ROLE:
        print("[AUTH] Using SUPABASE_SERVICE_ROLE_KEY (Full server-side administrative access, RLS bypass)")
    else:
        print("[AUTH] Using SUPABASE_ANON_KEY (Public publishable key - RLS applies)")
        print("       [NOTICE] For database inserts, the secret service_role key is recommended")
        print("                to ensure write operations are not blocked by SELECT-only RLS policies.")

    headers = {
        "apikey": ACTIVE_KEY,
        "Authorization": f"Bearer {ACTIVE_KEY}",
    }

    # Test REST API root
    rest_url = f"{SUPABASE_URL}/rest/v1/"
    try:
        response = requests.get(rest_url, headers=headers, timeout=10)
        if response.status_code in [200, 404]:
            print(f"[SUCCESS] Supabase REST API endpoint reachable (HTTP {response.status_code})")
        else:
            print(f"[WARNING] REST API returned unexpected status HTTP {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Failed to reach Supabase REST endpoint: {e}")
        return False

    # Check table availability
    tables = ["models_3d", "equipment", "sources", "equipment_images"]
    all_ok = True
    print("\nChecking migrated database tables:")
    for table in tables:
        t_url = f"{SUPABASE_URL}/rest/v1/{table}?select=id&limit=1"
        try:
            res = requests.get(t_url, headers=headers, timeout=10)
            if res.status_code == 200:
                print(f"  - public.{table:18} [FOUND & ACCESSIBLE]")
            elif res.status_code == 401:
                print(f"  - public.{table:18} [AUTH FAILED - Check API Key]")
                all_ok = False
            elif res.status_code == 404:
                print(f"  - public.{table:18} [NOT FOUND - Has migration been run?]")
                all_ok = False
            else:
                print(f"  - public.{table:18} [HTTP {res.status_code}: {res.text[:80]}]")
                all_ok = False
        except requests.exceptions.RequestException as e:
            print(f"  - public.{table:18} [CONNECTION ERROR: {e}]")
            all_ok = False

    print("=" * 60)
    return all_ok


def load_all_json_records(base_dir: str = "step3_4_json_conversion") -> List[Dict[str, Any]]:
    """Loads and returns all 13 validated equipment JSON records."""
    pattern = os.path.join(base_dir, "*", "*.json")
    files = sorted(glob.glob(pattern))
    records = []
    for fpath in files:
        with open(fpath, "r", encoding="utf-8") as f:
            data = json.load(f)
            records.append(data)
    return records


# Predefined shared Mars 3D models to seed into models_3d table
INITIAL_3D_MODELS = [
    {
        "id": "model_mars_ingenuity",
        "name": "Ingenuity Mars Helicopter",
        "storage_path": "models/model_mars_ingenuity.glb",
        "format": "glb",
        "description": "Autonomous twin-rotor scout helicopter",
        "source_attribution": "NASA / JPL-Caltech",
        "is_shared_asset": False
    },
    {
        "id": "model_mars_mer_rover",
        "name": "Mars Exploration Rover (MER)",
        "storage_path": "models/model_mars_mer_rover.glb",
        "format": "glb",
        "description": "Six-wheeled robotic field geologist shared by Spirit and Opportunity",
        "source_attribution": "NASA / JPL-Caltech",
        "is_shared_asset": True
    },
    {
        "id": "model_mars_sojourner",
        "name": "Sojourner Rover & Pathfinder Lander",
        "storage_path": "models/model_mars_sojourner.glb",
        "format": "glb",
        "description": "First successful Mars microrover and tetrahedral lander base",
        "source_attribution": "NASA / JPL-Caltech",
        "is_shared_asset": False
    },
    {
        "id": "model_mars_viking_lander",
        "name": "Viking Mars Lander",
        "storage_path": "models/model_mars_viking_lander.glb",
        "format": "glb",
        "description": "Nuclear-powered three-legged surface research laboratory shared by Viking 1 and Viking 2",
        "source_attribution": "NASA / Langley / JPL",
        "is_shared_asset": True
    }
]


def map_equipment_row(record: Dict[str, Any]) -> Dict[str, Any]:
    """Maps a validated JSON record to the public.equipment table row."""
    # Map shared 3D model foreign key for Mars records
    model_3d_id = None
    rec_id = record["id"]
    if rec_id == "eq_mars_ingenuity":
        model_3d_id = "model_mars_ingenuity"
    elif rec_id in ["eq_mars_spirit", "eq_mars_opportunity"]:
        model_3d_id = "model_mars_mer_rover"
    elif rec_id == "eq_mars_sojourner_pathfinder":
        model_3d_id = "model_mars_sojourner"
    elif rec_id in ["eq_mars_viking1", "eq_mars_viking2"]:
        model_3d_id = "model_mars_viking_lander"

    return {
        "id": record["id"],
        "slug": record["slug"],
        "name": record["name"],
        "alternate_designations": record.get("alternate_designations", []),
        "category": record["category"],
        "equipment_type": record["equipment_type"],
        "target_body": record["target_body"],
        "short_description": record["short_description"],
        "model_3d_id": model_3d_id,
        "topics": record["topics"],
        "verification_status": record["verification_status"],
        "schema_version": record.get("metadata", {}).get("schema_version", "1.0.0")
    }


def map_sources_rows(record: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Maps sources from a JSON record to public.sources table rows."""
    eq_id = record["id"]
    rows = []
    for src in record.get("sources", []):
        rows.append({
            "source_id": src["source_id"],
            "equipment_id": eq_id,
            "title": src["title"],
            "url": src["url"],
            "publishing_organization": src["publishing_organization"],
            "source_type": src["source_type"],
            "publication_date": src.get("publication_date"),
            "topics_supported": src.get("topics_supported", [])
        })
    return rows


def dry_run() -> None:
    """Parses and validates all 13 records against table mappings without sending network requests."""
    print("=" * 60)
    print("DRY RUN: PARSING 13 EQUIPMENT RECORDS FOR SUPABASE IMPORT")
    print("=" * 60)
    records = load_all_json_records()
    print(f"Loaded {len(records)} JSON equipment records.")

    total_sources = 0
    categories = {}

    for rec in records:
        eq_row = map_equipment_row(rec)
        sources_rows = map_sources_rows(rec)
        total_sources += len(sources_rows)
        cat = eq_row["category"]
        categories[cat] = categories.get(cat, 0) + 1

        print(f"  [OK] {eq_row['id']} ({eq_row['name']}) -> {len(sources_rows)} sources, Model FK: {eq_row['model_3d_id']}")

    print("\nSummary:")
    print(f"  - Total Equipment Records: {len(records)} {categories}")
    print(f"  - Total Pre-seeded 3D Models: {len(INITIAL_3D_MODELS)}")
    print(f"  - Total Normalized Sources: {total_sources}")
    print("\n[INFO] Dry run complete. No network requests were made.")
    print("=" * 60)


def execute_import() -> None:
    """Performs the actual upsert into Supabase."""
    if not IS_SERVICE_ROLE:
        print("[WARNING] SUPABASE_SERVICE_ROLE_KEY is not configured.")
        print("          If Row Level Security (RLS) is active without INSERT policies for anon,")
        print("          write requests may be rejected by Supabase.")
        confirm = input("Attempt import with current key anyway? (y/N): ").strip().lower()
        if confirm != 'y':
            print("Import cancelled.")
            return

    headers = get_headers()
    records = load_all_json_records()

    print(f"Starting import of {len(records)} equipment records to {SUPABASE_URL}...")

    # 1. Upsert 3D models
    print("\n1. Upserting shared 3D model assets...")
    res = requests.post(f"{SUPABASE_URL}/rest/v1/models_3d?on_conflict=id", headers=headers, json=INITIAL_3D_MODELS)
    if res.status_code in [200, 201]:
        print(f"   [SUCCESS] Seeded {len(INITIAL_3D_MODELS)} models into public.models_3d")
    else:
        print(f"   [FAILED] models_3d upsert failed (HTTP {res.status_code}): {res.text}")

    # 2. Upsert equipment and sources
    print("\n2. Upserting equipment and normalized sources...")
    for rec in records:
        eq_row = map_equipment_row(rec)
        res = requests.post(f"{SUPABASE_URL}/rest/v1/equipment?on_conflict=id", headers=headers, json=eq_row)
        if res.status_code in [200, 201]:
            print(f"   [SUCCESS] Upserted equipment: {eq_row['id']}")
        else:
            print(f"   [FAILED] Failed to upsert equipment {eq_row['id']} (HTTP {res.status_code}): {res.text}")
            continue

        src_rows = map_sources_rows(rec)
        if src_rows:
            res_src = requests.post(f"{SUPABASE_URL}/rest/v1/sources?on_conflict=equipment_id,source_id", headers=headers, json=src_rows)
            if res_src.status_code in [200, 201]:
                print(f"             + Linked {len(src_rows)} sources")
            else:
                print(f"             - Sources link failed (HTTP {res_src.status_code}): {res_src.text}")

    print("\n[COMPLETE] Import process finished.")


def main():
    parser = argparse.ArgumentParser(description="Space Heritage Explorer Supabase Importer")
    parser.add_argument("--test-connection", action="store_true", help="Test Supabase REST API connection and check tables")
    parser.add_argument("--dry-run", action="store_true", help="Parse and validate local JSON records without importing")
    parser.add_argument("--execute", action="store_true", help="Execute the actual import to Supabase")

    args = parser.parse_args()

    if args.test_connection:
        test_connection()
    elif args.dry_run:
        dry_run()
    elif args.execute:
        execute_import()
    else:
        print("Space Heritage Explorer Supabase Importer")
        print("------------------------------------------")
        print("No operation specified. Choose one of:")
        print("  python scripts/import_equipment.py --test-connection")
        print("  python scripts/import_equipment.py --dry-run")
        print("  python scripts/import_equipment.py --execute")


if __name__ == "__main__":
    main()

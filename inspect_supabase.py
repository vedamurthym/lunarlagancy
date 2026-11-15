import os
import requests
from dotenv import load_dotenv

load_dotenv("LunarLagancy/.env")
url = os.getenv("SUPABASE_URL", "").rstrip("/")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
headers = {"apikey": key, "Authorization": f"Bearer {key}"}

print("=== 1. STORAGE BUCKETS ===")
r = requests.get(f"{url}/storage/v1/bucket", headers=headers)
print("Status:", r.status_code)
if r.status_code == 200:
    for b in r.json():
        print(f"  Bucket: {b['id']} | name: {b['name']} | public: {b.get('public')}")
else:
    print(r.text)

print("\n=== 2. OBJECTS IN 3D-MODELS BUCKET (IF EXISTS) ===")
r_objs = requests.post(
    f"{url}/storage/v1/object/list/3d-models",
    headers=headers,
    json={"prefix": "", "limit": 100}
)
print("Status:", r_objs.status_code)
if r_objs.status_code == 200:
    for obj in r_objs.json():
        print(f"  {obj['name']}")
else:
    print(r_objs.text)

print("\n=== 3. EQUIPMENT RECORDS ===")
r2 = requests.get(f"{url}/rest/v1/equipment?select=id,slug,name,category,model_3d_id", headers=headers)
print("Status:", r2.status_code)
if r2.status_code == 200:
    records = r2.json()
    print(f"Total equipment: {len(records)}")
    for eq in sorted(records, key=lambda x: (x.get('category', ''), x.get('id', ''))):
        print(f"  [{eq.get('category')}] {eq.get('id')} -> {eq.get('name')} (model_3d_id: {eq.get('model_3d_id')})")
else:
    print(r2.text)

print("\n=== 4. MODELS_3D TABLE ===")
r3 = requests.get(f"{url}/rest/v1/models_3d?select=*", headers=headers)
print("Status:", r3.status_code)
if r3.status_code == 200:
    models = r3.json()
    print(f"Total models in DB: {len(models)}")
    for m in models:
        print(f"  {m}")
else:
    print(r3.text)

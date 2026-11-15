import urllib.request

urls = [
    ("Apollo LM", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/moon/apollo.glb"),
    ("Surveyor 3", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/moon/surveyor_3.glb"),
    ("Ingenuity", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/mars/ingenuity.glb"),
    ("Spirit", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/mars/spirit.glb"),
    ("Opportunity", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/mars/opportunity.glb"),
    ("Sojourner + Pathfinder", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/mars/sojourner_pathfinder.glb"),
    ("Viking Lander", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/mars/viking.glb"),
    ("Dawn", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/deep-space/dawn.glb"),
    ("NEAR Shoemaker", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/deep-space/near_shoemaker.glb"),
    ("Pioneer 10", "https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/deep-space/pioneer_10.glb"),
]

print("=" * 80)
print("SUPABASE CDN 3D MODEL ACCESSIBILITY AUDIT")
print("=" * 80)

all_ok = True
for name, url in urls:
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=10) as resp:
            content_type = resp.headers.get("Content-Type")
            content_len = int(resp.headers.get("Content-Length", 0))
            status = resp.status
            print(f"[{status}] {name:25} | {content_type:18} | {content_len:>10,} bytes | OK")
    except Exception as e:
        print(f"[FAIL] {name:25} | Error: {e}")
        all_ok = False

print("=" * 80)
print(f"Audit result: {'10/10 MODELS 100% REACHABLE ON CDN' if all_ok else 'SOME MODELS FAILED'}")
print("=" * 80)

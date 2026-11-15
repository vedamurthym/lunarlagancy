"""
Space Heritage Explorer — Realistic Procedural Earth Texture Generator
Generates high-fidelity equirectangular Earth surface map and atmospheric cloud layer.
"""

import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

WIDTH = 2048
HEIGHT = 1024

def latlon_to_xy(lat_deg, lon_deg):
    x = int((lon_deg + 180.0) / 360.0 * WIDTH) % WIDTH
    y = int((90.0 - lat_deg) / 180.0 * HEIGHT) % HEIGHT
    return x, y

def generate_earth_surface():
    print("Generating high-fidelity 2048x1024 Earth surface map...")
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(4, 18, 42)) # Deep ocean
    draw = ImageDraw.Draw(img)

    # 1. Base ocean bathymetry gradient (equator warmer, poles colder)
    ocean_arr = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
    for y in range(HEIGHT):
        lat = 90.0 - (y / HEIGHT) * 180.0
        abs_lat = abs(lat)
        # Deep ocean color
        b = int(45 - abs_lat * 0.15)
        g = int(22 - abs_lat * 0.1)
        r = int(5 - abs_lat * 0.03)
        ocean_arr[y, :, 0] = max(2, min(255, r))
        ocean_arr[y, :, 1] = max(10, min(255, g))
        ocean_arr[y, :, 2] = max(25, min(255, b))

    img = Image.fromarray(ocean_arr)
    draw = ImageDraw.Draw(img)

    # Simplified world continent polygons (lat, lon)
    continents = [
        # North America
        {
            "type": "land",
            "base_color": (46, 78, 48), # Temperate green
            "poly": [
                (70, -165), (71, -155), (71, -130), (69, -115), (60, -90), (62, -75), (55, -58),
                (45, -65), (35, -75), (25, -80), (18, -88), (15, -92), (8, -78), (9, -83),
                (16, -95), (20, -105), (30, -115), (38, -123), (48, -125), (60, -145), (65, -168), (70, -165)
            ]
        },
        # Central/South America
        {
            "type": "land",
            "base_color": (34, 72, 38), # Amazon tropical green
            "poly": [
                (12, -75), (10, -62), (5, -52), (-2, -44), (-8, -35), (-15, -39), (-23, -43),
                (-35, -55), (-45, -65), (-54, -68), (-55, -72), (-45, -75), (-30, -72),
                (-18, -71), (-5, -81), (2, -77), (8, -77), (12, -75)
            ]
        },
        # Eurasia
        {
            "type": "land",
            "base_color": (52, 85, 50),
            "poly": [
                (70, 20), (71, 40), (72, 80), (73, 120), (70, 160), (66, 170), (60, 165),
                (55, 140), (45, 135), (38, 120), (32, 122), (22, 114), (20, 107), (10, 105),
                (1, 104), (10, 98), (22, 90), (20, 85), (10, 78), (22, 70), (25, 60),
                (30, 48), (28, 35), (32, 35), (36, 36), (40, 28), (38, 24), (36, -5),
                (43, -9), (48, -4), (55, 8), (58, 5), (62, 5), (70, 20)
            ]
        },
        # British Isles
        {
            "type": "land",
            "base_color": (45, 85, 45),
            "poly": [(58, -5), (58, -2), (51, 1), (50, -5), (55, -6), (58, -5)]
        },
        # Africa
        {
            "type": "desert_blend",
            "base_color": (155, 130, 85), # Sahara golden tan
            "poly": [
                (36, -5), (37, 10), (32, 32), (30, 33), (22, 38), (12, 44), (11, 51),
                (2, 45), (-12, 40), (-25, 33), (-34, 26), (-34, 18), (-22, 14), (-15, 12),
                (-5, 9), (4, 9), (5, 2), (5, -5), (6, -12), (15, -17), (22, -16), (32, -10), (36, -5)
            ]
        },
        # Australia
        {
            "type": "desert_blend",
            "base_color": (158, 115, 70), # Outback reddish ochre
            "poly": [
                (-12, 132), (-11, 142), (-15, 146), (-24, 153), (-35, 150), (-38, 145),
                (-35, 136), (-35, 117), (-30, 115), (-22, 114), (-15, 125), (-12, 132)
            ]
        },
        # Greenland
        {
            "type": "ice",
            "base_color": (225, 235, 245),
            "poly": [(83, -30), (81, -20), (76, -20), (65, -40), (60, -45), (68, -55), (78, -70), (83, -30)]
        },
        # Antarctica
        {
            "type": "ice",
            "base_color": (235, 242, 250),
            "poly": [
                (-65, -180), (-65, 180), (-90, 180), (-90, -180)
            ]
        }
    ]

    # Draw continental shallow water / shelf glow around polygons
    shelf_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    shelf_draw = ImageDraw.Draw(shelf_img)
    for c in continents:
        pts = [latlon_to_xy(lat, lon) for lat, lon in c["poly"]]
        if len(pts) > 2:
            shelf_draw.polygon(pts, fill=(18, 90, 140, 180))
    shelf_img = shelf_img.filter(ImageFilter.GaussianBlur(radius=8))
    img.paste(shelf_img, (0, 0), shelf_img)

    # Draw primary landmasses
    for c in continents:
        pts = [latlon_to_xy(lat, lon) for lat, lon in c["poly"]]
        if len(pts) > 2:
            draw.polygon(pts, fill=c["base_color"])

    # Sahara desert overlay on northern Africa
    sahara_pts = [latlon_to_xy(lat, lon) for lat, lon in [
        (33, -10), (32, 28), (28, 33), (18, 36), (15, 20), (16, -12), (25, -15), (33, -10)
    ]]
    draw.polygon(sahara_pts, fill=(175, 145, 92))

    # Arabian desert
    arabia_pts = [latlon_to_xy(lat, lon) for lat, lon in [
        (30, 36), (28, 48), (22, 58), (15, 52), (14, 44), (20, 38), (30, 36)
    ]]
    draw.polygon(arabia_pts, fill=(180, 148, 95))

    # Gobi desert / Central Asia
    gobi_pts = [latlon_to_xy(lat, lon) for lat, lon in [
        (48, 85), (46, 110), (38, 108), (38, 80), (48, 85)
    ]]
    draw.polygon(gobi_pts, fill=(160, 135, 88))

    # Add subtle natural texture noise and soften coastlines
    img = img.filter(ImageFilter.GaussianBlur(radius=1.2))

    # Antarctica ice cap at bottom
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, int(HEIGHT * 0.86), WIDTH, HEIGHT], fill=(235, 242, 250))
    # Arctic ice at top
    draw.rectangle([0, 0, WIDTH, int(HEIGHT * 0.05)], fill=(230, 238, 248))

    # Smooth the whole map gently
    img = img.filter(ImageFilter.SMOOTH)
    out_path = "public/assets/earth-surface.png"
    img.save(out_path, quality=95)
    print(f"Saved Earth surface map: {out_path} ({WIDTH}x{HEIGHT})")

def generate_earth_clouds():
    print("Generating atmospheric cloud layer texture...")
    # Cloud layer with transparency
    cloud_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(cloud_img)

    # Cloud bands (ITCZ equator, mid-latitude storm tracks)
    # 1. Equatorial belt
    np.random.seed(42)
    for _ in range(120):
        lat = np.random.normal(5, 7)
        lon = np.random.uniform(-180, 180)
        x, y = latlon_to_xy(lat, lon)
        r_x = np.random.randint(40, 140)
        r_y = np.random.randint(15, 45)
        alpha = np.random.randint(90, 190)
        draw.ellipse([x - r_x, y - r_y, x + r_x, y + r_y], fill=(255, 255, 255, alpha))

    # 2. Northern storm tracks (40-60 deg N)
    for _ in range(140):
        lat = np.random.normal(48, 10)
        lon = np.random.uniform(-180, 180)
        x, y = latlon_to_xy(lat, lon)
        r_x = np.random.randint(50, 160)
        r_y = np.random.randint(20, 50)
        alpha = np.random.randint(80, 180)
        draw.ellipse([x - r_x, y - r_y, x + r_x, y + r_y], fill=(250, 252, 255, alpha))

    # 3. Southern storm tracks (40-65 deg S)
    for _ in range(160):
        lat = np.random.normal(-52, 9)
        lon = np.random.uniform(-180, 180)
        x, y = latlon_to_xy(lat, lon)
        r_x = np.random.randint(60, 180)
        r_y = np.random.randint(25, 60)
        alpha = np.random.randint(100, 210)
        draw.ellipse([x - r_x, y - r_y, x + r_x, y + r_y], fill=(252, 254, 255, alpha))

    # Cyclone vortex in Atlantic (like user image)
    cyclone_cx, cyclone_cy = latlon_to_xy(25, -50)
    for ring in range(5):
        rad = 30 + ring * 18
        draw.arc([cyclone_cx - rad, cyclone_cy - rad, cyclone_cx + rad, cyclone_cy + rad], 
                 start=ring * 45, end=ring * 45 + 240, fill=(255, 255, 255, 160), width=10)

    # Blur clouds for natural vapor dispersion
    cloud_img = cloud_img.filter(ImageFilter.GaussianBlur(radius=10))

    out_path = "public/assets/earth-clouds.png"
    cloud_img.save(out_path)
    print(f"Saved Earth cloud map: {out_path} ({WIDTH}x{HEIGHT})")

if __name__ == "__main__":
    generate_earth_surface()
    generate_earth_clouds()

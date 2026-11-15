import struct, json, os

def analyze_glb(filepath):
    """Parse GLB header and extract glTF JSON chunk for analysis."""
    result = {}
    fsize = os.path.getsize(filepath)
    result['file_size_bytes'] = fsize
    result['file_size_mb'] = round(fsize / (1024*1024), 2)
    
    with open(filepath, 'rb') as f:
        magic = f.read(4)
        if magic != b'glTF':
            result['error'] = 'Not a valid GLB file'
            return result
        
        version = struct.unpack('<I', f.read(4))[0]
        total_length = struct.unpack('<I', f.read(4))[0]
        result['glb_version'] = version
        result['glb_total_length'] = total_length
        
        chunk0_length = struct.unpack('<I', f.read(4))[0]
        chunk0_type = struct.unpack('<I', f.read(4))[0]
        
        if chunk0_type != 0x4E4F534A:
            result['error'] = 'First chunk is not JSON'
            return result
        
        json_data = f.read(chunk0_length)
        result['json_chunk_size'] = chunk0_length
        
        remaining = total_length - 12 - 8 - chunk0_length
        if remaining > 8:
            chunk1_length = struct.unpack('<I', f.read(4))[0]
            chunk1_type = struct.unpack('<I', f.read(4))[0]
            result['binary_chunk_size'] = chunk1_length
        else:
            result['binary_chunk_size'] = 0
        
        gltf = json.loads(json_data)
        
        asset = gltf.get('asset', {})
        result['generator'] = asset.get('generator', 'Unknown')
        result['gltf_version'] = asset.get('version', 'Unknown')
        result['copyright'] = asset.get('copyright', None)
        
        result['scene_count'] = len(gltf.get('scenes', []))
        result['node_count'] = len(gltf.get('nodes', []))
        result['mesh_count'] = len(gltf.get('meshes', []))
        result['material_count'] = len(gltf.get('materials', []))
        result['texture_count'] = len(gltf.get('textures', []))
        result['image_count'] = len(gltf.get('images', []))
        result['animation_count'] = len(gltf.get('animations', []))
        result['accessor_count'] = len(gltf.get('accessors', []))
        result['buffer_count'] = len(gltf.get('buffers', []))
        result['sampler_count'] = len(gltf.get('samplers', []))
        result['skin_count'] = len(gltf.get('skins', []))
        result['camera_count'] = len(gltf.get('cameras', []))
        
        result['extensions_used'] = gltf.get('extensionsUsed', [])
        result['extensions_required'] = gltf.get('extensionsRequired', [])
        
        total_primitives = 0
        total_triangles = 0
        total_vertices = 0
        for mesh in gltf.get('meshes', []):
            prims = mesh.get('primitives', [])
            total_primitives += len(prims)
            for prim in prims:
                indices_idx = prim.get('indices')
                if indices_idx is not None:
                    acc = gltf['accessors'][indices_idx]
                    index_count = acc.get('count', 0)
                    mode = prim.get('mode', 4)
                    if mode == 4:
                        total_triangles += index_count // 3
                    elif mode in (5, 6):
                        total_triangles += max(0, index_count - 2)
                
                attrs = prim.get('attributes', {})
                pos_idx = attrs.get('POSITION')
                if pos_idx is not None:
                    acc = gltf['accessors'][pos_idx]
                    total_vertices += acc.get('count', 0)
        
        result['total_primitives'] = total_primitives
        result['total_triangles'] = total_triangles
        result['total_vertices'] = total_vertices
        
        # Check vertex attributes across all primitives
        attr_types = set()
        for mesh in gltf.get('meshes', []):
            for prim in mesh.get('primitives', []):
                for attr_name in prim.get('attributes', {}):
                    attr_types.add(attr_name)
        result['vertex_attributes'] = sorted(list(attr_types))
        
        # Material details
        mat_details = []
        for i, mat in enumerate(gltf.get('materials', [])):
            md = {}
            md['index'] = i
            md['name'] = mat.get('name', 'Material_' + str(i))
            md['has_pbr'] = 'pbrMetallicRoughness' in mat
            md['alpha_mode'] = mat.get('alphaMode', 'OPAQUE')
            md['double_sided'] = mat.get('doubleSided', False)
            
            pbr = mat.get('pbrMetallicRoughness', {})
            if pbr:
                md['base_color_factor'] = pbr.get('baseColorFactor')
                md['has_base_color_texture'] = 'baseColorTexture' in pbr
                md['metallic_factor'] = pbr.get('metallicFactor', 1.0)
                md['roughness_factor'] = pbr.get('roughnessFactor', 1.0)
                md['has_metallic_roughness_texture'] = 'metallicRoughnessTexture' in pbr
            else:
                md['has_base_color_texture'] = False
                md['metallic_factor'] = '?'
                md['roughness_factor'] = '?'
                md['has_metallic_roughness_texture'] = False
            
            md['has_normal_map'] = 'normalTexture' in mat
            md['has_occlusion_map'] = 'occlusionTexture' in mat
            md['has_emissive_tex'] = 'emissiveTexture' in mat
            md['emissive_factor'] = mat.get('emissiveFactor', [0,0,0])
            
            # Check for extensions on material
            md['extensions'] = list(mat.get('extensions', {}).keys())
            
            mat_details.append(md)
        result['material_details'] = mat_details
        
        # Image details with sizes
        img_details = []
        for i, img in enumerate(gltf.get('images', [])):
            id_entry = {}
            id_entry['index'] = i
            id_entry['name'] = img.get('name', 'Image_' + str(i))
            id_entry['mimeType'] = img.get('mimeType', 'unknown')
            bv_idx = img.get('bufferView')
            if bv_idx is not None:
                bv = gltf['bufferViews'][bv_idx]
                id_entry['size_bytes'] = bv.get('byteLength', 0)
            else:
                id_entry['size_bytes'] = 0
            id_entry['uri'] = img.get('uri', None)
            img_details.append(id_entry)
        result['image_details'] = img_details
        
        # Mesh names
        result['mesh_names'] = [m.get('name', 'Mesh_' + str(i)) for i, m in enumerate(gltf.get('meshes', []))]
        
        # Root nodes
        scenes = gltf.get('scenes', [])
        if scenes:
            root_nodes = scenes[0].get('nodes', [])
            result['root_node_count'] = len(root_nodes)
            root_names = []
            for ni in root_nodes:
                node = gltf['nodes'][ni]
                root_names.append(node.get('name', 'Node_' + str(ni)))
            result['root_node_names'] = root_names
        
        # Bounding box from POSITION accessors
        mins = [float('inf'), float('inf'), float('inf')]
        maxs = [float('-inf'), float('-inf'), float('-inf')]
        for mesh in gltf.get('meshes', []):
            for prim in mesh.get('primitives', []):
                pos_idx = prim.get('attributes', {}).get('POSITION')
                if pos_idx is not None:
                    acc = gltf['accessors'][pos_idx]
                    amin = acc.get('min', [0,0,0])
                    amax = acc.get('max', [0,0,0])
                    for j in range(3):
                        if amin[j] < mins[j]: mins[j] = amin[j]
                        if amax[j] > maxs[j]: maxs[j] = amax[j]
        
        if mins[0] != float('inf'):
            dims = [round(maxs[j] - mins[j], 4) for j in range(3)]
            result['bounding_box_min'] = [round(x, 4) for x in mins]
            result['bounding_box_max'] = [round(x, 4) for x in maxs]
            result['dimensions_xyz'] = dims
        
        # Store full gltf json for later use
        result['_gltf'] = gltf
    
    return result


models = [
    ('moon/apollo.glb', 'LunarLagancy/3d-models/moon/apollo.glb'),
    ('mars/Ingenuity Mars Helicopter.glb', 'LunarLagancy/3d-models/mars/Ingenuity Mars Helicopter.glb'),
    ('mars/opportunity (1).glb', 'LunarLagancy/3d-models/mars/opportunity (1).glb'),
    ('mars/sprit.glb', 'LunarLagancy/3d-models/mars/sprit.glb'),
    ('mars/Viking.glb', 'LunarLagancy/3d-models/mars/Viking.glb'),
    ('deep-space/Dawn.glb', 'LunarLagancy/3d-models/deep-space/Dawn.glb'),
    ('deep-space/NEAR Shoemaker.glb', 'LunarLagancy/3d-models/deep-space/NEAR Shoemaker.glb'),
    ('deep-space/Pioneer 10.glb', 'LunarLagancy/3d-models/deep-space/Pioneer 10.glb'),
]

for label, path in models:
    print('=' * 80)
    print('MODEL: ' + label)
    print('=' * 80)
    info = analyze_glb(path)
    for k, v in info.items():
        if k == '_gltf':
            continue
        if k == 'material_details':
            print('  Materials (' + str(len(v)) + '):')
            for m in v:
                line = '    [' + str(m['index']) + '] ' + m['name']
                line += ': PBR=' + str(m['has_pbr'])
                line += ', baseColorTex=' + str(m.get('has_base_color_texture', False))
                line += ', metallic=' + str(m.get('metallic_factor', '?'))
                line += ', roughness=' + str(m.get('roughness_factor', '?'))
                line += ', normalMap=' + str(m['has_normal_map'])
                line += ', AO=' + str(m['has_occlusion_map'])
                line += ', emissiveTex=' + str(m.get('has_emissive_tex', False))
                if m.get('extensions'):
                    line += ', ext=' + str(m['extensions'])
                if m.get('alpha_mode') != 'OPAQUE':
                    line += ', alpha=' + m['alpha_mode']
                if m.get('double_sided'):
                    line += ', doubleSided'
                print(line)
        elif k == 'image_details':
            print('  Images (' + str(len(v)) + '):')
            for im in v:
                sz = im.get('size_bytes', 0)
                sz_str = str(round(sz/1024, 1)) + 'KB' if sz > 0 else 'external'
                print('    [' + str(im['index']) + '] ' + im['name'] + ': ' + im['mimeType'] + ' (' + sz_str + ')')
        elif k == 'mesh_names':
            if len(v) <= 30:
                print('  mesh_names: ' + str(v))
            else:
                print('  mesh_names (' + str(len(v)) + '): ' + str(v[:15]) + ' ... ' + str(v[-5:]))
        else:
            print('  ' + str(k) + ': ' + str(v))
    print()

import React from 'react';
import { createRoot } from 'react-dom/client';
import { useGLTF } from '@react-three/drei';
import '@/lib/assetManager';
import '@/styles/index.css';
import App from '@/App';

// Configure local Draco decoder path for robust offline/sandboxed GLB decompression
useGLTF.setDecoderPath('/draco/gltf/');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element with id "root"');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

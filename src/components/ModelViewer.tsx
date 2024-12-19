'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Download } from 'lucide-react';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
  onPublish?: () => void;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();
  
  useEffect(() => {
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Get the largest dimension for scaling
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.2 / maxDim; // Adjusted scale for new canvas size
    
    // Apply scale and center the model
    scene.scale.multiplyScalar(scale);
    scene.position.copy(center.multiplyScalar(-scale));
    
    // Calculate optimal camera position
    const distance = maxDim * 1.8; // Adjusted distance for new canvas size
    camera.position.set(distance, distance * 0.8, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    // Enhance materials and lighting
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          
          materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.needsUpdate = true;
              material.side = THREE.DoubleSide;
              material.roughness = 0.5;
              material.metalness = 0.4;
              material.envMapIntensity = 1.0;
            }
          });
        }
      }
    });
  }, [scene, camera]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.0}
        castShadow
      />
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.6}
      />
      <Center scale={1.6}>
        <primitive object={scene} />
      </Center>
    </>
  );
}

export default function ModelViewer({ modelUrl, className = '', onPublish }: ModelViewerProps) {
  const processModelUrl = (url: string) => {
    return url.startsWith('/api/proxy') ? url : `/api/proxy?url=${encodeURIComponent(url)}`;
  };

  const handleDownload = async (format: 'glb' | 'obj' | 'fbx') => {
    try {
      const url = modelUrl.replace('.glb', `.${format}`);
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `model.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading model:', error);
    }
  };

  return (
    <div className="model-viewer-wrapper">
      <style jsx>{`
        .model-viewer-wrapper {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        .model-viewer-container {
          width: 585px;
          height: 585px;
          position: relative;
          background-color: var(--background-secondary);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--border);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .model-viewer-container :global(canvas) {
          display: block !important;
          width: 500px !important;
          height: 500px !important;
          outline: none;
          margin: auto;
          margin-top: 30px;
          border-radius: 8px;
          background-color: var(--background);
        }

        .publish-button {
          width: 100%;
          max-width: 500px;
          padding: 12px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .publish-button:hover {
          opacity: 0.9;
        }

        .download-options {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .download-button {
          padding: 8px 16px;
          background-color: var(--background-secondary);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--foreground);
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .download-button:hover {
          background-color: var(--background);
          border-color: var(--border-hover);
        }
      `}</style>
      
      <div className="model-viewer-container">
        <Canvas
          camera={{ 
            position: [0, 0, 4],
            fov: 42,
            near: 0.1,
            far: 1000
          }}
          style={{
            display: 'block',
            width: '468px',
            height: '468px'
          }}
        >
          <ambientLight intensity={0.8} />
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.25} 
            penumbra={1} 
            intensity={1.2} 
            castShadow
          />
          <pointLight position={[-5, -5, -5]} intensity={0.8} />
          <directionalLight 
            position={[0, 5, 5]} 
            intensity={1.0}
            castShadow
          />
          
          <Center scale={1.6}>
            <Model url={processModelUrl(modelUrl)} />
          </Center>
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            minDistance={2.5}
            maxDistance={7}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            target={new THREE.Vector3(0, 0, 0)}
          />
        </Canvas>
      </div>

      

      
    </div>
  );
} 
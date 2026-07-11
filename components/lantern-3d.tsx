'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stage, Float, OrbitControls, ContactShadows, Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GOLD_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#FFD700",
  metalness: 0.9,
  roughness: 0.2,
  envMapIntensity: 1,
});

const GLOW_MATERIAL = new THREE.MeshBasicMaterial({
  color: "#ffaa00",
  transparent: true,
  opacity: 0.8,
});

class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('ThreeJS/Canvas failed to render:', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

// Helper for square-aligned shapes (pyramids/square prisms)
const SquarePrism = ({ width, height, depth, material, ...props }: any) => (
  <mesh {...props} material={material || GOLD_MATERIAL}>
    <boxGeometry args={[width, height, depth]} />
  </mesh>
);

const SquarePyramid = ({ topSize, bottomSize, height, material, ...props }: any) => (
  <mesh {...props} rotation={[0, Math.PI / 4, 0]} material={material || GOLD_MATERIAL}>
    <cylinderGeometry args={[topSize, bottomSize, height, 4]} />
  </mesh>
);

// Step 1: The Chapeau (Hat) - Using GLB
function LanternChapeauGLB({ material, ...props }: any) {
  const { scene } = useGLTF('/media/moroccan_lantern.glb');

  // Clone and override material immediately
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child: any) => {
      if (child.isMesh && material) {
        child.material = material;
      }
    });
    return clone;
  }, [scene, material]);

  return <primitive object={clonedScene} {...props} />;
}

function RamadanDecoGLB({ material, ...props }: any) {
  const { scene } = useGLTF('/ramadon-deco.glb');

  // Clone and override material immediately
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child: any) => {
      if (child.isMesh && material) {
        child.material = material;
      }
    });
    return clone;
  }, [scene, material]);

  return <primitive object={clonedScene} {...props} />;
}

function NewDecoGLB({ material, ...props }: any) {
  const { scene } = useGLTF('/media/images/media/source/untitled_3.gltf');

  // Clone and override material immediately
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child: any) => {
      if (child.isMesh && material) {
        child.material = material;
      }
    });
    return clone;
  }, [scene, material]);

  return <primitive object={clonedScene} {...props} />;
}

function HangingChain({ material, x = 0, yStart = 4.0, yEnd = 1.8, scale = 1, children, decoration = false }: any) {
  const linkScale = scale * 1.5;
  const linkSpacing = 0.14 * linkScale;
  const chainLength = Math.abs(yStart - yEnd);
  const count = Math.ceil(chainLength / linkSpacing);

  return (
    <group position={[x, yStart, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} position={[0, -i * linkSpacing, 0]}>
          <mesh
            rotation={[0, i % 2 === 0 ? 0 : Math.PI / 2, 0]}
            material={material || GOLD_MATERIAL}
          >
            <torusGeometry args={[0.055 * linkScale, 0.018 * linkScale, 8, 16]} />
          </mesh>
          {decoration && i % 3 === 0 && i > 0 && (
            <mesh position={[0, 0, 0]} material={material || GOLD_MATERIAL}>
              <sphereGeometry args={[0.045 * linkScale, 16, 16]} />
            </mesh>
          )}
        </group>
      ))}
      {children && (
        <group position={[0, -count * linkSpacing, 0]}>
          {children}
        </group>
      )}
    </group>
  );
}

function ProceduralLantern({ model = 'all', ...props }: { model: LanternModelType } & any) {
  const lanternRef = useRef<THREE.Group>(null);
  const decoRef = useRef<THREE.Group>(null);
  const newDecoRef = useRef<THREE.Group>(null);

  const metalMaterial = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#FFD700",
      metalness: 0.9,
      roughness: 0.2,
      envMapIntensity: 1
    });
  }, []);

  // useFrame(() => {
  //   if (lanternRef.current) {
  //     lanternRef.current.rotation.y += 0.005;
  //   }
  // });

  return (
    <group {...props}>
{/* {(model === 'all' || model === 'lantern') && (
        <HangingChain
          material={metalMaterial}
          x={0}
          yStart={2.5}
          yEnd={0}
          decoration={true}
        >
          <group ref={lanternRef}>
            <LanternChapeauGLB position={[0, 0, 0]} scale={0.7} material={metalMaterial} />
          </group>
        </HangingChain>
      )} */}

      {/* {(model === 'all' || model === 'ramadan') && (
        <HangingChain
          material={metalMaterial}
          x={model === 'all' ? 1.4 : 0}
          yStart={2.5}
          yEnd={0}
        >
          <group ref={decoRef}>
            <mesh position={[0, -0.1, 0]} rotation={[0, Math.PI / 2, 0]} material={metalMaterial}>
              <torusGeometry args={[0.06, 0.015, 8, 16]} />
            </mesh>
            <RamadanDecoGLB
              position={[0, -0.8, 0]}
              scale={0.3}
              material={metalMaterial}
              rotation={[0, 0, 0]}
            />
          </group>
        </HangingChain>
      )}

      {(model === 'all' || model === 'new') && (
        <HangingChain
          material={metalMaterial}
          x={model === 'all' ? -1.4 : 0}
          yStart={2.5}
          yEnd={0}
        >
          <group ref={newDecoRef}>
            <mesh position={[0, -0.05, 0]} rotation={[0, Math.PI / 2, 0]} material={metalMaterial}>
              <torusGeometry args={[0.06, 0.015, 8, 16]} />
            </mesh>
            <NewDecoGLB
              position={[0, -0.4, 0]}
              scale={model === 'new' ? 0.8 : 1.0}
              material={metalMaterial}
              rotation={[0, 0, 0]}
            />
            {model === 'new' && (
              <Sparkles
                count={15}
                scale={[2.5, 2.5, 2.5]}
                size={3.5}
                speed={0.4}
                opacity={0.8}
                color="#FFD700"
                position={[0, -0.5, 0]}
              />
            )}
          </group>
        </HangingChain>
      )} */}
      <ambientLight intensity={0.5} color="#ffd700" />
      <Sparkles
        count={60}
        scale={5}
        size={3}
        speed={0.4}
        opacity={0.8}
        color="#FFD700"
      />
    </group>
  );
}

export type LanternModelType = 'all' | 'lantern' | 'ramadan' | 'new';

interface Lantern3DProps {
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
  model?: LanternModelType;
}

export function Lantern3D({ className = "h-[300px] w-full", interactive = true, model = 'all' }: Lantern3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use static image fallbacks for mobile/low-end devices or when WebGL fails
  const fallbackImage = model === 'lantern' 
    ? '/media/static-lantern.jpg' 
    : model === 'ramadan' 
      ? '/lantern.png' 
      : '/media/logo.png';

  const fallbackUI = (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={fallbackImage} 
        alt="Decorative Item" 
        className="w-1/2 h-auto opacity-80 object-contain pointer-events-none"
        style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' }}
      />
    </div>
  );

  return (
    <div ref={containerRef} className={className}>
      <ThreeErrorBoundary fallback={fallbackUI}>
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6.5], fov: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#C5A572" />
          <pointLight position={[-10, -10, 10]} intensity={1} color="#C5A572" />
          <Suspense fallback={null}>
            <Float
              speed={1.5}
              rotationIntensity={0.2}
              floatIntensity={0.5}
            >
              <ProceduralLantern model={model} />
            </Float>
          </Suspense>

          {interactive && (
            <OrbitControls
              enableZoom={false}
              enableRotate={interactive}
              enablePan={false}
              autoRotate={false}
              makeDefault
            />
          )}
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}

export function ParticleGlow({ className = "absolute inset-0 w-full h-full pointer-events-none" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={className} style={{ background: 'transparent' }}>
      <ThreeErrorBoundary fallback={null}>
        <Canvas
          eventSource={containerRef.current || undefined}
          eventPrefix="client"
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ alpha: true, preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={0.5} />
          <React.Suspense fallback={null}>
            <Sparkles
              count={40}
              scale={[25, 3, 8]}
              size={3}
              speed={0.3}
              opacity={0.4}
              color="#FFD700"
              position={[0, 2.5, 0]}
            />
          </React.Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}

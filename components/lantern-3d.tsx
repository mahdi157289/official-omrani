'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  const { scene } = useGLTF('/ramadon deco.glb');

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
  const { scene } = useGLTF('/media/images/media/source/Untitled 3.gltf');

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
  const { scene } = useGLTF('/media/moroccan_lantern.glb');

  const metalMaterial = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#C5A059",
      metalness: 0.9,
      roughness: 0.35,
      emissive: "#000000",
      envMapIntensity: 1.2
    });
  }, []);

  React.useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = metalMaterial;
      }
    });
  }, [scene, metalMaterial]);

  useFrame(() => {
    if (lanternRef.current) {
      lanternRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group {...props}>
      {(model === 'all' || model === 'lantern') && (
        <HangingChain
          material={metalMaterial}
          x={0}
          yStart={4.0}
          yEnd={2.1}
          decoration={true}
        >
          <group ref={lanternRef}>
            <LanternChapeauGLB position={[0, 0, 0]} scale={1.0} />
          </group>
        </HangingChain>
      )}

      {(model === 'all' || model === 'ramadan') && (
        <HangingChain
          material={metalMaterial}
          x={model === 'all' ? 1.4 : 0}
          yStart={4.0}
          yEnd={-0.5}
        >
          <group ref={decoRef}>
            <mesh position={[0, -0.1, 0]} rotation={[0, Math.PI / 2, 0]} material={metalMaterial}>
              <torusGeometry args={[0.06, 0.015, 8, 16]} />
            </mesh>
            <RamadanDecoGLB
              position={[0, -1.5, 0]}
              scale={0.08}
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
          yStart={3.0}
          yEnd={model === 'new' ? 0.9 : 0.5}
        >
          <group ref={newDecoRef}>
            <mesh position={[0, -0.05, 0]} rotation={[0, Math.PI / 2, 0]} material={metalMaterial}>
              <torusGeometry args={[0.06, 0.015, 8, 16]} />
            </mesh>
            <NewDecoGLB
              position={[0, -0.6, 0]}
              scale={model === 'new' ? 2.0 : 2.8}
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
      )}
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

export function Lantern3D({ className = "h-[600px] w-full", interactive = true, model = 'all' }: Lantern3DProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={className} />;

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        key={`canvas-${model}`}
        eventSource={containerRef.current || undefined}
        eventPrefix="client"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
      >
        <React.Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} adjustCamera={false} shadows={false}>
            <Float
              speed={1.5}
              rotationIntensity={model === 'lantern' || model === 'all' ? 0.2 : 0}
              floatIntensity={0.2}
              floatingRange={[-0.05, 0.05]}
            >
              <ProceduralLantern model={model} />
            </Float>
          </Stage>
        </React.Suspense>

        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={2.5}
          far={4}
          resolution={256}
          color="#000000"
        />

        {interactive && (
          <OrbitControls
            enableZoom={interactive}
            enableRotate={interactive}
            enablePan={interactive}
            autoRotate={false}
            makeDefault
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>
    </div>
  );
}

export function ParticleGlow({ className = "absolute inset-0 w-full h-full pointer-events-none" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        eventSource={containerRef.current || undefined}
        eventPrefix="client"
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <React.Suspense fallback={null}>
          <Sparkles
            count={60}
            scale={[25, 3, 8]}
            size={5}
            speed={0.3}
            opacity={0.6}
            color="#FFD700"
            position={[0, 2.5, 0]}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

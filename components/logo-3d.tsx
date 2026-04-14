'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Enable THREE.js caching globally for 3D assets acceleration
if (typeof window !== 'undefined') {
  THREE.Cache.enabled = true;
}

interface Logo3DProps {
  className?: string;
  isRotating?: boolean;
}

class Logo3DErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Avoid crashing the whole app if WebGL/canvas init fails in a given environment.
    console.error('Logo3D failed to render; falling back to 2D logo:', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function canUseWebGL(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true } as any) ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

// Component to render the logo planes once texture is loaded
function LogoPlanes() {
  const logoTexture = useTexture('/media/logo.png');
  
  useEffect(() => {
    if (logoTexture) {
      logoTexture.anisotropy = 16;
      logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
      logoTexture.magFilter = THREE.LinearFilter;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);

  if (!logoTexture) return null;

  return (
    <>
      {/* Front logo on the coin face (+Z in the post-tilt coordinate space) */}
      <mesh position={[0, 0, 0.13]}>
        <circleGeometry args={[1.95, 64]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent
          toneMapped={false}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Back logo */}
      <mesh position={[0, 0, -0.13]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[1.95, 64]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent
          toneMapped={false}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// Coin body, logo and rings - renders immediately
function CoinBody({ spinRef, meshRef, isRotating }: { 
  spinRef: React.RefObject<THREE.Group | null>;
  meshRef: React.RefObject<THREE.Mesh | null>;
  isRotating: boolean;
}) {
  // Rotate around Y to show the 3D coin spin (faces are aligned to ±Z)
  useFrame((state, delta) => {
    if (spinRef.current && isRotating) {
      spinRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <>
      {/* Coin body - Renders INSTANTLY because it doesn't wait for textures */}
      {/* Optimization: 32 segments instead of 64, meshPhongMaterial for faster shader compilation */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.25, 32]} />
        <meshPhongMaterial
          color="#D4AF37"
          emissive="#403010"
          specular="#FFFFFF"
          shininess={100}
        />
      </mesh>

      {/* Logos are wrapped in Suspense so the coin body shows immediately while the logo image loads */}
      <Suspense fallback={null}>
        <LogoPlanes />
      </Suspense>

      {/* Optional decorative rings - Optimized geometry */}
      <mesh position={[0, 0, 0.126]}>
        <ringGeometry args={[1.7, 1.8, 32]} />
        <meshPhongMaterial color="#A07937" emissive="#201505" shininess={60} />
      </mesh>
      <mesh position={[0, 0, -0.126]} rotation={[0, Math.PI, 0]}>
        <ringGeometry args={[1.7, 1.8, 32]} />
        <meshPhongMaterial color="#A07937" emissive="#201505" shininess={60} />
      </mesh>
    </>
  );
}

function CoinModel({ isRotating = false }: { isRotating?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const spinRef = useRef<THREE.Group>(null);

  return (
    // Spin group: coin + logo rotate together (logo planes remain in XY, coin is rotated at the cylinder mesh)
    <group ref={spinRef}>
      <CoinBody spinRef={spinRef} meshRef={meshRef} isRotating={isRotating} />
    </group>
  );
}

export function Logo3D({ className = 'w-full h-full', isRotating = false }: Logo3DProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerReady, setContainerReady] = useState(false);
  const [webglOk, setWebglOk] = useState<boolean>(true);
  const startTime = useRef<number>(0);

  // Remove the hydration 'mounted' gate entirely for the Canvas shell.
  // Instead, provide a background-matched div during SSR which will be instantly replaced by the Canvas.
  useEffect(() => {
    startTime.current = performance.now();
    setMounted(true);
    setWebglOk(canUseWebGL());
    setContainerReady(true);
  }, []);

  if (!webglOk) {
    return <div className={`${className} bg-[#00353F]`} />;
  }

  const handleCanvasCreated = (state: any) => {
    // ENGINE LEVEL: Force shader pre-compilation (Warming)
    // This tells the GPU to prepare the shaders before the first frame, eliminating start-up stutter.
    const { gl, scene, camera } = state;
    gl.compile(scene, camera);
    
    const renderTime = performance.now() - startTime.current;
    console.log(`[Zero-Wait Logs] 3D Engine Initialized & Warmed in: ${renderTime.toFixed(2)}ms`);
  };

  return (
    <div ref={containerRef} className={className}>
      <Logo3DErrorBoundary fallback={<div className={`${className} bg-[#00353F]`} />}>
        <Canvas
          dpr={[1, 2]}
          eventSource={containerRef.current || undefined}
          eventPrefix="client"
          onCreated={handleCanvasCreated}
          gl={{
            alpha: true,
            antialias: false, // Performance: Disable antialias as DPR handles it.
            stencil: false,
            depth: true,
            powerPreference: 'high-performance',
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={40} />
          <ambientLight intensity={1.2} color="#ffffff" />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFF9E3" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#D4AF37" />

          <Suspense fallback={null}>
            <Float
              speed={2}
              rotationIntensity={0}
              floatIntensity={0.5}
              floatingRange={[-0.1, 0.1]}
            >
              <CoinModel isRotating={isRotating} />
            </Float>
          </Suspense>
        </Canvas>
      </Logo3DErrorBoundary>
    </div>
  );
}

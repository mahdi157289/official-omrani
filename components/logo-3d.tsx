'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Enable THREE.js caching globally for 3D assets acceleration
if (typeof window !== 'undefined') {
  THREE.Cache.enabled = true;
}

// [STEP 3] STATIC GEOMETRY: Move definitions outside the component so they are allocated 
// ONCE by the engine compiler, not on every React render.
const COIN_GEOMETRY = new THREE.CylinderGeometry(2, 2, 0.25, 64);
const RING_GEOMETRY = new THREE.RingGeometry(1.7, 1.8, 64);
const LOGO_GEOMETRY = new THREE.CircleGeometry(1.95, 64);

// [STEP 1] TEXTURE PRELOADING: Pre-warm the texture cache at the module level
// so the engine doesn't have to wait for the first render to start downloading.
useTexture.preload('/media/logo.png');

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
      <mesh position={[0, 0, 0.13]} geometry={LOGO_GEOMETRY}>
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
      <mesh position={[0, 0, -0.13]} rotation={[0, Math.PI, 0]} geometry={LOGO_GEOMETRY}>
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
    // Never rotate!
  });

  return (
    <>
      {/* Coin body - Renders INSTANTLY because it doesn't wait for textures */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} geometry={COIN_GEOMETRY}>
        <meshStandardMaterial
          color="#C5A572"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1}
        />
      </mesh>

      {/* Logos are wrapped in Suspense so the coin body shows immediately while the logo image loads */}
      <Suspense fallback={null}>
        <LogoPlanes />
      </Suspense>

      {/* Optional decorative rings */}
      <mesh position={[0, 0, 0.126]} geometry={RING_GEOMETRY}>
        <meshStandardMaterial color="#A07937" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.126]} rotation={[0, Math.PI, 0]} geometry={RING_GEOMETRY}>
        <meshStandardMaterial color="#A07937" metalness={0.8} roughness={0.2} />
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglOk, setWebglOk] = useState<boolean>(true);
  const startTime = useRef<number>(0);

  // [STEP 1] IMMEDIATE START: Use useLayoutEffect for faster sync if on client, 
  // and remove the artificial 'mounted' state check in the return.
  useEffect(() => {
    startTime.current = performance.now();
    setWebglOk(canUseWebGL());
  }, []);

  // [STEP 1] Bypassing Hydration Latency: 
  // We check for window directly instead of waiting for useEffect to set a state.
  // This allows the 3D Canvas to mount during the first hydration pass.
  if (typeof window === 'undefined') {
    return (
      <div 
        className={`${className} flex items-center justify-center`} 
        style={{ backgroundColor: '#00353F' }}
      />
    );
  }

  if (!webglOk) {
    return <div className={`${className} bg-[#00353F]`} />;
  }

  const handleCanvasCreated = (state: any) => {
    // [STEP 3] SHADER WARMING: 
    // Manually trigger shader compilation before the first draw frame.
    const { gl, scene, camera } = state;
    gl.compile(scene, camera);
    
    const renderTime = performance.now() - startTime.current;
    console.log(`[Zero-Wait Logs] 3D Coin Engine Initialized & Rendered in: ${renderTime.toFixed(2)}ms`);
  };

  const fallbackUI = (
    <div className={`${className} flex items-center justify-center`} style={{ backgroundColor: '#00353F' }}>
      <img 
        src="/media/logo.png" 
        alt="Omranis Logo" 
        className="w-1/2 h-auto opacity-80 object-contain pointer-events-none"
        style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' }}
      />
    </div>
  );

  return (
    <div ref={containerRef} className={className}>
      <Logo3DErrorBoundary fallback={fallbackUI}>
        <Canvas
          shadows={false}
          dpr={[1, 2]}
          eventSource={containerRef.current || undefined}
          eventPrefix="client"
          onCreated={handleCanvasCreated}
          gl={{
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={38} />
          <ambientLight intensity={0.8} color="#ffffff" />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} color="#FFF9E3" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#C5A572" />
          <directionalLight position={[0, 5, 5]} intensity={0.5} color="#FFF9E3" />

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


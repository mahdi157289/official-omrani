'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

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

// Coin body, logo and rings - renders immediately
function CoinBody({ spinRef, meshRef, isRotating }: { 
  spinRef: React.RefObject<THREE.Group>;
  meshRef: React.RefObject<THREE.Mesh>;
  isRotating: boolean;
}) {
  // Rotate around Y to show the 3D coin spin (faces are aligned to ±Z)
  useFrame((state, delta) => {
    if (spinRef.current && isRotating) {
      spinRef.current.rotation.y += delta * 1.5;
    }
  });

  // Simple logo texture on a flat circle
  const logoTexture = useTexture('/media/logo.png');
  if (logoTexture) {
    logoTexture.anisotropy = 16;
    logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
    logoTexture.magFilter = THREE.LinearFilter;
    logoTexture.needsUpdate = true;
  }
  return (
    <>
      {/* Coin body */}
      {/* Cylinder is Y-up by default; rotate it so faces are along ±Z */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.25, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1}
        />
      </mesh>

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

      {/* Optional decorative rings */}
      <mesh position={[0, 0, 0.126]}>
        <ringGeometry args={[1.7, 1.8, 64]} />
        <meshStandardMaterial color="#A07937" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.126]} rotation={[0, Math.PI, 0]}>
        <ringGeometry args={[1.7, 1.8, 64]} />
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
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerReady, setContainerReady] = useState(false);
  const [webglOk, setWebglOk] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setWebglOk(canUseWebGL());
    // Ensure container ref is set before rendering Canvas
    if (containerRef.current) {
      setContainerReady(true);
    } else {
      // Use a small delay to ensure ref is attached
      const timer = setTimeout(() => {
        if (containerRef.current) {
          setContainerReady(true);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // #region agent log
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const browserInfo = typeof navigator !== 'undefined' ? {
        userAgent: navigator.userAgent?.substring?.(0, 100),
        vendor: (navigator as any).vendor,
      } : {};
      fetch('http://127.0.0.1:7242/ingest/29c793d4-1785-44a7-95ca-8aefed5f088b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'logo-3d.tsx:useEffect',
          message: 'Logo3D client readiness',
          data: {
            mounted,
            containerReady,
            webglOk,
            containerRefCurrent: containerRef.current !== null,
            hasWindow: typeof window !== 'undefined',
            ...browserInfo,
          },
          timestamp: Date.now(),
          hypothesisId: 'D',
          runId: 'post-fix',
        }),
      }).catch(() => {});
    }
    // #endregion
  }, [mounted, containerReady, webglOk]);

  // #region agent log
  const containerElement = containerRef.current;
  // (telemetry moved to useEffect below to avoid side-effects during render)
  // #endregion

  if (!mounted || !containerReady) {
    return <div ref={containerRef} className={`${className} flex items-center justify-center bg-transparent`} />;
  }

  const fallback2D = (
    <div className={`${className} flex items-center justify-center`} aria-label="Logo">
      {/* Use 2D logo if WebGL is unavailable/blocked */}
      <img
        src="/media/logo.png"
        alt="Logo"
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );

  if (!webglOk) {
    return fallback2D;
  }

  return (
    <div ref={containerRef} className={className}>
      <Logo3DErrorBoundary fallback={fallback2D}>
        <Canvas
          shadows
          dpr={[1, 2]}
          eventSource={containerRef.current || undefined}
          eventPrefix="client"
          gl={{
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={40} />
          <ambientLight intensity={0.8} color="#ffffff" />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} color="#FFF9E3" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#D4AF37" />
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

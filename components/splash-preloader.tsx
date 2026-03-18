'use client';

import { useEffect, useState } from 'react';
import { getSessionId } from '@/lib/session-manager';

/**
 * Splash Preloader
 * Preloads critical resources during splash screen with smart timeout
 */

interface PreloadStatus {
  products: 'pending' | 'loading' | 'loaded' | 'failed' | 'skipped';
  packages: 'pending' | 'loading' | 'loaded' | 'failed' | 'skipped';
  images: 'pending' | 'loading' | 'loaded' | 'failed' | 'skipped';
  models3d: 'pending' | 'loading' | 'loaded' | 'failed' | 'skipped';
}

const CRITICAL_TIMEOUT = 2000; // 2 seconds for critical resources
const TOTAL_TIMEOUT = 4000; // 4 seconds total (splash duration)

export function useSplashPreloader() {
  const [status, setStatus] = useState<PreloadStatus>({
    products: 'pending',
    packages: 'pending',
    images: 'pending',
    models3d: 'pending',
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const sessionId = getSessionId().sessionId;
    const startTime = Date.now();

    // Critical resources (must load within 2s)
    const criticalResources: Array<keyof PreloadStatus> = ['products', 'packages'];

    // Non-critical resources (can be skipped if timeout)
    const nonCriticalResources: Array<keyof PreloadStatus> = ['images', 'models3d'];

    // Preload critical resources
    const preloadCritical = async () => {
      const criticalStart = Date.now();

      try {
        // Preload products and packages in parallel
        const response = await fetch('/api/cache/preload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session-id': sessionId,
          },
          body: JSON.stringify({
            resources: ['products', 'packages'],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setStatus((prev) => ({
            ...prev,
            products: data.results?.products?.cached ? 'loaded' : 'loaded',
            packages: data.results?.packages?.cached ? 'loaded' : 'loaded',
          }));
        } else {
          setStatus((prev) => ({
            ...prev,
            products: 'failed',
            packages: 'failed',
          }));
        }
      } catch (error) {
        console.warn('Critical preload failed:', error);
        setStatus((prev) => ({
          ...prev,
          products: 'failed',
          packages: 'failed',
        }));
      }

      const criticalTime = Date.now() - criticalStart;
      if (criticalTime > CRITICAL_TIMEOUT) {
        console.warn('Critical resources took too long:', criticalTime);
      }
    };

    // Preload non-critical resources (with timeout)
    const preloadNonCritical = async () => {
      const nonCriticalStart = Date.now();
      const timeout = TOTAL_TIMEOUT - (Date.now() - startTime);

      if (timeout <= 0) {
        setStatus((prev) => ({
          ...prev,
          images: 'skipped',
          models3d: 'skipped',
        }));
        return;
      }

      try {
        // Preload hero image
        const imagePromise = new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setStatus((prev) => ({ ...prev, images: 'loaded' }));
            resolve();
          };
          img.onerror = () => {
            setStatus((prev) => ({ ...prev, images: 'failed' }));
            resolve();
          };
          img.src = '/media/images/background-image.jpg';
        });

        // Preload 3D models (just mark as loading, actual load happens in components)
        const models3dPromise = Promise.resolve().then(() => {
          setStatus((prev) => ({ ...prev, models3d: 'loaded' }));
        });

        // Race against timeout
        await Promise.race([
          Promise.all([imagePromise, models3dPromise]),
          new Promise<void>((resolve) =>
            setTimeout(() => {
              setStatus((prev) => ({
                ...prev,
                images: prev.images === 'pending' ? 'skipped' : prev.images,
                models3d: prev.models3d === 'pending' ? 'skipped' : prev.models3d,
              }));
              resolve();
            }, timeout)
          ),
        ]);
      } catch (error) {
        console.warn('Non-critical preload failed:', error);
        setStatus((prev) => ({
          ...prev,
          images: 'failed',
          models3d: 'failed',
        }));
      }
    };

    // Start preloading
    preloadCritical().then(() => {
      // After critical resources, start non-critical
      preloadNonCritical();
    });

    // Overall timeout
    const overallTimeout = setTimeout(() => {
      setIsComplete(true);
    }, TOTAL_TIMEOUT);

    return () => {
      clearTimeout(overallTimeout);
    };
  }, []);

  return { status, isComplete };
}

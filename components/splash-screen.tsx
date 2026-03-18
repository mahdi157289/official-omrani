'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo3D } from './logo-3d';
import { useUI } from './providers/ui-provider';
import { useSplashPreloader } from './splash-preloader';

export function SplashScreen() {
    const { introFinished, setIntroFinished } = useUI();
    const [show, setShow] = useState(true);
    const { status, isComplete } = useSplashPreloader();

    useEffect(() => {
        // If the intro has already played during this session, don't show it again
        if (introFinished) {
            setShow(false);
            return;
        }

        // Wait for preloader to complete or timeout after 4s
        const timer = setTimeout(() => {
            setShow(false);
            // Give a small delay for the exit animation before marking as finished
            setTimeout(() => setIntroFinished(true), 1000);
        }, 4000);

        // Also exit early if preloader completes
        if (isComplete) {
            const earlyExit = setTimeout(() => {
                setShow(false);
                setTimeout(() => setIntroFinished(true), 1000);
            }, 500); // Small delay to ensure smooth transition

            return () => {
                clearTimeout(timer);
                clearTimeout(earlyExit);
            };
        }

        return () => clearTimeout(timer);
    }, [setIntroFinished, introFinished, isComplete, status]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Animated Logo Container - Golden Coin */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                duration: 4
                            }}
                            className="w-64 h-64 md:w-[320px] md:h-[320px] relative z-50 mb-8"
                        >
                            <Logo3D isRotating={true} />
                        </motion.div>

                        {/* Loading text or brand name with glare effect */}
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0, duration: 0 }}
                            className="text-center relative z-10 glare-effect"
                            dir="rtl"
                        >
                            <div className="relative inline-block overflow-hidden">
                                <motion.h1
                                    initial={{ clipPath: 'inset(0 0 0 100%)' }}
                                    animate={{ clipPath: 'inset(0 0 0 0%)' }}
                                    transition={{
                                        delay: 0,
                                        duration: 4,
                                        ease: "circOut"
                                    }}
                                    className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#E7C15F] via-[#FBF08E] to-[#A07B37] px-6 py-2"
                                    style={{
                                        textShadow: '0 0 30px rgba(251, 240, 142, 0.3)',
                                        fontFamily: 'var(--font-amiri), serif',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    مقروض العمراني ...
                                </motion.h1>

                                {/* A subtle sparkle line following the reveal edge */}
                                <motion.div
                                    initial={{ left: "100%" }}
                                    animate={{ left: "0%" }}
                                    transition={{ delay: 0, duration: 4, ease: "circOut" }}
                                    className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#FBF08E] to-transparent shadow-[0_0_15px_#FBF08E] opacity-60"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

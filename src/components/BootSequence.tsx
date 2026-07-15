import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { ClassifiedHUD } from './ui/ClassifiedHUD';
import './BootSequence.css';

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Parallax Logic (2D HUD Layer) ---
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates (-1 to 1)
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX.set(nx);
      mouseY.set(ny);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Very subtle translation for logo (moves slightly opposite to mouse to simulate depth)
  const logoX = useTransform(mouseX, [-1, 1], [-10, 10]);
  const logoY = useTransform(mouseY, [-1, 1], [10, -10]);

  // --- Boot Choreography ---
  useEffect(() => {
    // 0: Black screen (initial)
    const t1 = setTimeout(() => setPhase(1), 1000); // 1: Tiny transmission
    const t2 = setTimeout(() => setPhase(2), 2500); // 2: Transmission fades, Space reveals
    const t3 = setTimeout(() => setPhase(3), 5000); // 3: Logo materializes
    const t4 = setTimeout(() => setPhase(4), 7000); // 4: HUD + Button activates

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  const handleEnterCommand = () => {
    if (phase !== 4) return;
    setPhase(5); // 5: Authentication
    setTimeout(() => setPhase(6), 1500); // 6: Warp sequence
    setTimeout(() => {
      onComplete(); // Trigger 3D camera to sweep to CommandCenter
    }, 2500);
  };

  return (
    <div className="boot-sequence-container" ref={containerRef}>
      
      {/* 0. Initial Black Overlay (Fades out to reveal Space) */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div 
            className="black-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* 1. Tiny Quantum Transmission */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            className="transmission-text"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            ESTABLISHING QUANTUM LINK...
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Classified HUD (Loads after Logo) */}
      {phase >= 4 && phase < 6 && (
        <ClassifiedHUD />
      )}

      {/* 3 & 4. Logo and Button with Parallax */}
      <AnimatePresence>
        {phase >= 3 && phase < 6 && (
          <motion.div 
            className="logo-container"
            style={{ x: logoX, y: logoY }}
            initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(30px)', scale: 1.5 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Breathing Logo */}
            <motion.h1 
              className="cosmos-logo"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              COSMOS GRID
            </motion.h1>
            <h2 className="cosmos-subtitle">INTERSTELLAR TRANSIT AUTHORITY</h2>
            
            {/* Enter Command Button */}
            <AnimatePresence>
              {phase === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'relative' }}
                >
                  <motion.button 
                    className="enter-command-btn"
                    onClick={handleEnterCommand}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ENTER COMMAND
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 5. Authentication Status */}
            {phase === 5 && (
              <motion.div 
                className="auth-status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                COMMANDER VERIFIED // INITIALIZING WARP
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Warp Overlay */}
      <AnimatePresence>
        {phase === 6 && (
          <motion.div 
            className="warp-overlay"
            initial={{ opacity: 0, filter: 'blur(0px)' }}
            animate={{ opacity: 1, filter: 'blur(50px)' }}
            transition={{ duration: 1, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

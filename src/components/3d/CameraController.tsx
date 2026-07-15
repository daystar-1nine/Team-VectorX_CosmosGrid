import { useAppStore } from '../../store';
import { CameraControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CameraController() {
  const controlsRef = useRef<CameraControls>(null);
  const activeModule = useAppStore((state) => state.activeModule);
  
  // Parallax state
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!controlsRef.current) return;
    
    const controls = controlsRef.current;
    // Spring physics for cinematic momentum
    controls.smoothTime = 1.2;
    controls.draggingDampingFactor = 0.05;
    controls.azimuthRotateSpeed = 0.5;
    controls.polarRotateSpeed = 0.5;

    // Base coordinates
    let targetX = 0, targetY = 20, targetZ = 40;

    switch (activeModule) {
      case 'boot':
        controls.smoothTime = 1.5;
        // Position inside the BootSector
        targetX = 0; targetY = 500; targetZ = 600;
        controls.setLookAt(targetX, targetY, targetZ, 0, 500, 500, true);
        break;
      case 'mission_briefing':
        controls.smoothTime = 0.8;
        controls.setLookAt(0, 5, 20, 0, 0, 0, true);
        break;
      case 'command_center':
        controls.smoothTime = 1.5;
        controls.setLookAt(0, 40, 50, 0, 0, 0, true);
        break;
      case 'classified_dossier':
        controls.setLookAt(-30, 10, 60, -10, 0, 0, true);
        break;
      case 'interactive_galaxy':
      case 'universe':
        controls.smoothTime = 2.5;
        // Cinematic wide-angle sweep
        controls.setLookAt(50, 25, 45, 0, 0, 0, true);
        break;
      default:
        controls.setLookAt(0, 20, 40, 0, 0, 0, true);
    }
  }, [activeModule]);

  // Handle subtle 3D Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Apply parallax on frame loop
  useFrame(() => {
    if (!controlsRef.current || activeModule !== 'boot') return;
    
    // Very subtle movement (1-3% max)
    const parallaxX = mouse.current.x * 2.5; 
    const parallaxY = mouse.current.y * 1.5;
    
    const currentPosition = new THREE.Vector3();
    controlsRef.current.getPosition(currentPosition);
    
    // Smoothly interpolate towards target + parallax offset
    const targetX = 0 + parallaxX;
    const targetY = 500 + parallaxY;
    const targetZ = 600; // Keep Z stable

    controlsRef.current.setLookAt(
      THREE.MathUtils.lerp(currentPosition.x, targetX, 0.05),
      THREE.MathUtils.lerp(currentPosition.y, targetY, 0.05),
      targetZ,
      0, 500, 500,
      false // don't animate with controls, let lerp handle it
    );
  });

  return (
    <CameraControls 
      ref={controlsRef}
      maxPolarAngle={Math.PI / 1.8}
      minPolarAngle={Math.PI / 4}
      minDistance={10}
      maxDistance={150}
      makeDefault
    />
  );
}

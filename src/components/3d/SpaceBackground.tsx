import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SpaceBackground() {
  const starsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Generate dense distant starfield
  const [starPositions, starColors] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spherically distributed distant stars
      const r = 300 + Math.random() * 200;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Color variety (blueish to reddish)
      const mix = Math.random();
      const c = new THREE.Color().lerpColors(
        new THREE.Color('#88bbff'),
        new THREE.Color('#ffccaa'),
        mix
      );
      
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return [positions, colors];
  }, []);

  // Generate closer, slow moving space dust
  const dustPositions = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Cylinder distribution around the galaxy
      const r = 20 + Math.random() * 80;
      const theta = 2 * Math.PI * Math.random();
      const y = (Math.random() - 0.5) * 40;
      
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(theta);
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.001; // Very slow distant rotation
    }
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.01; // Faster closer dust
    }
  });

  return (
    <group>
      {/* Distant Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.8} 
          sizeAttenuation={true} 
          vertexColors={true} 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Volumetric Space Dust Layer */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={1.5} 
          color="#00E5FF"
          sizeAttenuation={true} 
          transparent 
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Soft Nebula Ambient Light */}
      <ambientLight intensity={0.2} color="#00E5FF" />
    </group>
  );
}

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DeepSpaceEnvironment() {
  const starsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Distant subtle stars
  const [starPositions, starColors] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const r = 800 + Math.random() * 400; // Very far away
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const mix = Math.random();
      const c = new THREE.Color().lerpColors(
        new THREE.Color('#4466aa'),
        new THREE.Color('#88aaff'),
        mix
      );
      
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return [positions, colors];
  }, []);

  // Ambient cosmic dust
  const dustPositions = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.0002; // Practically static
    }
    if (dustRef.current) {
      // Slow ambient drift
      dustRef.current.rotation.y += delta * 0.001;
      dustRef.current.rotation.z += delta * 0.0005;
    }
  });

  return (
    <group>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.6} 
          sizeAttenuation={true} 
          vertexColors={true} 
          transparent 
          opacity={0.4} // Very faint
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={1.0} 
          color="#00E5FF"
          sizeAttenuation={true} 
          transparent 
          opacity={0.05} // Almost invisible fog
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

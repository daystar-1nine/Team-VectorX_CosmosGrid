import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpacecraftFleetProps {
  count?: number;
  orbitRadius: number;
  baseSpeed?: number;
  color?: string;
  spread?: number; // How far they can deviate from exact orbit
}

export function SpacecraftFleet({ count = 200, orbitRadius, baseSpeed = 0.5, color = '#FFFFFF', spread = 0.4 }: SpacecraftFleetProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-calculate random properties for each ship
  const ships = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      speedMulti: 0.5 + Math.random() * 1.5,
      yOffset: (Math.random() - 0.5) * spread,
      rOffset: (Math.random() - 0.5) * spread,
      scale: 0.05 + Math.random() * 0.08
    }));
  }, [count, spread]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    ships.forEach((ship, i) => {
      // Move ship along orbit
      ship.angle += delta * baseSpeed * ship.speedMulti * 0.1;

      const r = orbitRadius + ship.rOffset;
      const x = Math.cos(ship.angle) * r;
      const z = Math.sin(ship.angle) * r;

      dummy.position.set(x, ship.yOffset, z);
      
      // Face forward along the tangent of the circle
      const targetX = Math.cos(ship.angle + 0.1) * r;
      const targetZ = Math.sin(ship.angle + 0.1) * r;
      dummy.lookAt(targetX, ship.yOffset, targetZ);
      
      dummy.scale.set(ship.scale, ship.scale, ship.scale * 2.5); // Make them elongated like ships
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

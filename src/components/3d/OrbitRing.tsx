import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitRingProps {
  radius: number;
  color?: string;
  rotationSpeed?: number;
  trafficLevel?: 'normal' | 'busy' | 'heavy' | 'critical' | 'corrupted';
}

const ringVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uDensity;
  
  varying vec2 vUv;
  
  void main() {
    // Basic ring base
    float baseAlpha = 0.1;
    
    // Moving dashes (Traffic)
    float dashPattern = fract(vUv.x * uDensity - uTime * uSpeed);
    float dash = smoothstep(0.4, 0.6, dashPattern) * smoothstep(0.9, 0.7, dashPattern);
    
    // Fade out edges of the torus slightly
    float edgeFade = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    
    float finalAlpha = (baseAlpha + dash * 0.8) * edgeFade;
    
    // Glitch effect for corrupted
    if (uSpeed < 0.0) {
        if (fract(sin(dot(vUv.xy + uTime, vec2(12.9898,78.233))) * 43758.5453) > 0.95) {
            finalAlpha = 1.0;
        }
    }

    gl_FragColor = vec4(uColor, finalAlpha);
  }
`;

export function OrbitRing({ radius, color, rotationSpeed = 0.02, trafficLevel = 'normal' }: OrbitRingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Parse traffic colors
  let laneColor = color || '#00E5FF';
  let density = 20.0;
  let flowSpeed = 1.0;

  switch (trafficLevel) {
    case 'busy': laneColor = '#FFD700'; density = 40.0; flowSpeed = 1.5; break;
    case 'heavy': laneColor = '#FF8C00'; density = 80.0; flowSpeed = 0.5; break; // Heavy traffic moves slower
    case 'critical': laneColor = '#FF0000'; density = 100.0; flowSpeed = 0.1; break;
    case 'corrupted': laneColor = '#8A2BE2'; density = 50.0; flowSpeed = -2.0; break;
  }

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.05, 16, 200]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={ringVertexShader}
        fragmentShader={ringFragmentShader}
        uniforms={{
          uColor: { value: new THREE.Color(laneColor) },
          uTime: { value: 0 },
          uSpeed: { value: flowSpeed },
          uDensity: { value: density }
        }}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

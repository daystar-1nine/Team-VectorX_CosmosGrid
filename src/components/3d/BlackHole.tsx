import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlackHoleProps {
  position: [number, number, number];
  size: number;
}

// Accretion Disk Shader
const diskVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const diskFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    // Polar coordinates for spinning disk
    vec2 centered = vUv - 0.5;
    float dist = length(centered);
    float angle = atan(centered.y, centered.x);
    
    // Mask out the inner hole and outer edge
    float innerMask = smoothstep(0.15, 0.3, dist);
    float outerMask = smoothstep(0.5, 0.4, dist);
    
    // Noise for fiery accretion disk
    float n1 = snoise(vec2(dist * 10.0, angle * 4.0 - uTime * 2.0));
    float n2 = snoise(vec2(dist * 20.0, angle * 10.0 - uTime * 4.0));
    
    float noiseMix = (n1 + n2 * 0.5) * 0.5 + 0.5;
    
    // Doppler beaming (brighter on one side due to relativistic speeds)
    float doppler = sin(angle - 0.5) * 0.5 + 0.5;
    
    vec3 colorBase = vec3(1.0, 0.4, 0.1); // Fiery orange
    vec3 colorHot = vec3(1.0, 0.9, 0.5);  // Superhot yellow/white
    
    vec3 finalColor = mix(colorBase, colorHot, noiseMix * doppler);
    
    float alpha = innerMask * outerMask * noiseMix * doppler;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function BlackHole({ position, size }: BlackHoleProps) {
  const diskRef = useRef<THREE.Mesh>(null);
  const diskMatRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (diskRef.current) {
      // Very slight wobble/rotation
      diskRef.current.rotation.z += 0.005;
    }
    if (diskMatRef.current) {
      diskMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={position}>
      {/* Event Horizon (Pure Black Sphere) */}
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Photon Sphere / Event Horizon Glow */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshBasicMaterial color="#ff4000" transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>

      {/* Accretion Disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <planeGeometry args={[size * 8, size * 8, 32, 32]} />
        <shaderMaterial
          ref={diskMatRef}
          vertexShader={diskVertexShader}
          fragmentShader={diskFragmentShader}
          uniforms={{ uTime: { value: 0 } }}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

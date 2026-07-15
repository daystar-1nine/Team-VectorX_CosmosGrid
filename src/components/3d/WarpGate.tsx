import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WarpGateProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const portalVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  
  // Noise
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
    vec2 centered = vUv - 0.5;
    float dist = length(centered);
    
    // Mask to circle
    float mask = smoothstep(0.5, 0.45, dist);
    if(mask == 0.0) discard;
    
    // Swirling portal effect
    float angle = atan(centered.y, centered.x);
    float noise = snoise(vec2(dist * 5.0 - uTime, angle * 3.0 + uTime * 2.0));
    float noise2 = snoise(vec2(dist * 10.0 + uTime * 0.5, angle * 6.0 - uTime));
    
    float intensity = (noise + noise2) * 0.5 + 0.5;
    
    // Core gets brighter
    float core = smoothstep(0.5, 0.0, dist);
    intensity += core * 2.0;
    
    vec3 color = mix(vec3(0.0, 0.5, 1.0), vec3(0.8, 0.9, 1.0), intensity * core);
    
    gl_FragColor = vec4(color, mask * intensity);
  }
`;

export function WarpGate({ position, rotation, scale }: WarpGateProps) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreMatRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (outerRingRef.current) outerRingRef.current.rotation.z += 0.01;
    if (innerRingRef.current) innerRingRef.current.rotation.z -= 0.02;
    if (coreMatRef.current) coreMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Structural Support Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5, 0.2, 16, 64]} />
        <meshStandardMaterial color="#223344" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rotating Outer Energy Ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.5, 0.1, 16, 64]} />
        <meshBasicMaterial color="#00E5FF" wireframe />
      </mesh>

      {/* Rotating Inner Energy Ring */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.0, 0.15, 16, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>

      {/* Portal Distortion Core */}
      <mesh rotation={[0, 0, 0]}>
        <circleGeometry args={[4.2, 64]} />
        <shaderMaterial
          ref={coreMatRef}
          vertexShader={portalVertexShader}
          fragmentShader={portalFragmentShader}
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

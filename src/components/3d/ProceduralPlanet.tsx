import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralPlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  atmosphereColor: string;
  speed: number;
  hasRings?: boolean;
  type?: 'terrestrial' | 'gas' | 'lava' | 'ice';
}

// Simplex 3D Noise function for shaders
const noiseShader = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
`;

// Planet Surface Shader
const planetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  uniform float uType; // 0: terrestrial, 1: gas, 2: lava
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  ${noiseShader}

  void main() {
    float n = snoise(vec3(vUv.x * 5.0, vUv.y * 5.0, uTime * 0.05));
    float n2 = snoise(vec3(vUv.x * 15.0, vUv.y * 15.0, uTime * 0.1));
    
    vec3 color = mix(uColor1, uColor2, n * 0.5 + 0.5);
    
    // Gas giant banding
    if (uType > 0.5 && uType < 1.5) {
        float band = sin(vUv.y * 20.0 + n * 2.0);
        color = mix(uColor1, uColor2, band * 0.5 + 0.5);
    }
    
    // Lava cracks
    if (uType > 1.5) {
        float crack = smoothstep(0.4, 0.5, abs(n2));
        vec3 magma = vec3(1.0, 0.3, 0.0) * 2.0; // Glow
        color = mix(magma, color, crack);
    }

    // Basic lighting
    vec3 lightDir = normalize(vec3(0.0, 1.0, 1.0)); // Towards center star
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Ambient + Diffuse
    vec3 finalColor = color * (diff * 0.8 + 0.2);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Atmosphere Fresnel Shader
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 uAtmosphereColor;
  
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    // Fresnel effect
    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
    gl_FragColor = vec4(uAtmosphereColor, 1.0) * intensity * 1.5;
  }
`;

// Cloud Shader (Alpha masked noise)
const cloudFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  
  varying vec2 vUv;
  
  ${noiseShader}

  void main() {
    float n = snoise(vec3(vUv.x * 8.0 + uTime * 0.02, vUv.y * 8.0, uTime * 0.01));
    float alpha = smoothstep(0.2, 0.8, n);
    gl_FragColor = vec4(uColor, alpha * 0.6);
  }
`;

export function ProceduralPlanet({ position, size, color, atmosphereColor, speed, type = 'terrestrial', hasRings = false }: ProceduralPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetMatRef = useRef<THREE.ShaderMaterial>(null);
  const cloudMatRef = useRef<THREE.ShaderMaterial>(null);

  const typeFloat = type === 'terrestrial' ? 0.0 : type === 'gas' ? 1.0 : type === 'lava' ? 2.0 : 3.0;
  const c1 = new THREE.Color(color);
  const c2 = new THREE.Color(color).offsetHSL(0, 0, -0.4);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed;
    }
    if (planetMatRef.current) {
      planetMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (cloudMatRef.current) {
      cloudMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Core Planet */}
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial 
          ref={planetMatRef}
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={{
            uColor1: { value: c1 },
            uColor2: { value: c2 },
            uTime: { value: 0 },
            uType: { value: typeFloat }
          }}
        />
      </mesh>

      {/* Clouds (Terrestrial only usually, but let's allow for style) */}
      {type !== 'lava' && (
        <mesh scale={[1.01, 1.01, 1.01]}>
          <sphereGeometry args={[size, 64, 64]} />
          <shaderMaterial 
            ref={cloudMatRef}
            vertexShader={planetVertexShader}
            fragmentShader={cloudFragmentShader}
            uniforms={{
              uColor: { value: new THREE.Color('#ffffff') },
              uTime: { value: 0 }
            }}
            transparent={true}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Outer Atmosphere Glow */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial 
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={{
            uAtmosphereColor: { value: new THREE.Color(atmosphereColor) }
          }}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Optional Procedural Rings */}
      {hasRings && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 2.5, 64]} />
          <meshBasicMaterial color={atmosphereColor} transparent opacity={0.3} side={THREE.DoubleSide} map={null} />
        </mesh>
      )}
    </group>
  );
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex 3D Noise for surface
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
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

  void main() {
    // 3D position for seamless noise
    vec3 spherePos = normalize(vPosition);
    
    // Very slow surface evolution
    float n = snoise(spherePos * 2.5 + uTime * 0.01);
    float n2 = snoise(spherePos * 5.0 - uTime * 0.02);
    float detail = (n + n2 * 0.5) * 0.5 + 0.5;

    // Deep cinematic colors (dark blue/blacks with subtle teal continents)
    vec3 waterColor = vec3(0.02, 0.05, 0.08);
    vec3 landColor = vec3(0.05, 0.1, 0.15);
    vec3 color = mix(waterColor, landColor, smoothstep(0.4, 0.6, detail));

    // Cinematic lighting (Light comes from far right)
    vec3 lightDir = normalize(vec3(1.0, 0.2, 0.5));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Soft shadow transition (terminator line)
    float shadow = smoothstep(-0.2, 0.2, dot(vNormal, lightDir));
    color *= mix(vec3(0.01), vec3(1.0), shadow); // Ambient occlusion in shadow

    // Atmospheric scattering (Fresnel rim)
    float viewAngle = dot(vNormal, vec3(0.0, 0.0, 1.0));
    float rim = 1.0 - max(viewAngle, 0.0);
    rim = smoothstep(0.6, 1.0, rim);
    
    // Only show atmosphere where light hits
    vec3 atmosphereColor = vec3(0.0, 0.5, 1.0);
    color += atmosphereColor * rim * shadow * 1.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function CinematicPlanet({ position, size }: { position: [number, number, number], size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005; // Extremely slow rotation
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={planetVertexShader}
        fragmentShader={planetFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  );
}

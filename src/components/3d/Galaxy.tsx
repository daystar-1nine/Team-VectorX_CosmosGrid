import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const galaxyVertexShader = `
  uniform float uTime;
  uniform float uSize;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  
  varying vec3 vColor;
  
  void main() {
    // Current position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Rotation
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float offsetAngle = (1.0 / distanceToCenter) * uTime * 0.2;
    
    angle += offsetAngle;
    
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
    
    // Add randomness back in after rotation to avoid rigid spinning
    modelPosition.xyz += aRandomness;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    
    // Size attenuation
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);
    
    vColor = color;
  }
`;

const galaxyFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Disc shape with soft edge
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 3.0);
    
    vec3 finalColor = mix(vec3(0.0), vColor, strength);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function Galaxy() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const parameters = {
    count: 150000,
    size: 20,
    radius: 35,
    branches: 5,
    spin: 1.5,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: '#ffffff',
    coreColor: '#ff6030',
    outsideColor: '#002244'
  };

  const [positions, colors, scales, randomness] = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count * 1);
    const randomness = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorCore = new THREE.Color(parameters.coreColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      // Position
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      // Gaussian randomness
      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      // Base position without randomness (randomness added in shader)
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
      positions[i3 + 1] = randomY * 0.4; // Flatter disk
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
      
      randomness[i3] = randomX;
      randomness[i3 + 1] = randomY;
      randomness[i3 + 2] = randomZ;

      // Color based on radius
      const mixedColor = new THREE.Color();
      if (radius < parameters.radius * 0.1) {
        mixedColor.lerpColors(colorCore, colorInside, radius / (parameters.radius * 0.1));
      } else {
        mixedColor.lerpColors(colorInside, colorOutside, (radius - parameters.radius * 0.1) / (parameters.radius * 0.9));
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      // Scale
      scales[i] = Math.random();
    }

    return [positions, colors, scales, randomness];
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
        />
        <bufferAttribute
          attach="attributes-aRandomness"
          args={[randomness, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        transparent={true}
        uniforms={{
          uTime: { value: 0 },
          uSize: { value: parameters.size * 1.5 } // Pixel ratio adjusted later if needed
        }}
        vertexShader={galaxyVertexShader}
        fragmentShader={galaxyFragmentShader}
      />
    </points>
  );
}

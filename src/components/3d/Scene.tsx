import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraController } from './CameraController';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { SpaceBackground } from './SpaceBackground';
import { Galaxy } from './Galaxy';
import { ProceduralPlanet } from './ProceduralPlanet';
import { OrbitRing } from './OrbitRing';
import { WarpGate } from './WarpGate';
import { BlackHole } from './BlackHole';
import { SpacecraftFleet } from './SpacecraftFleet';
import { CinematicPlanet } from './CinematicPlanet';
import { DeepSpaceEnvironment } from './DeepSpaceEnvironment';
import { Suspense } from 'react';
import { Vignette, ChromaticAberration } from '@react-three/postprocessing';

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 20, 40], fov: 45 }}
      dpr={[1, 2]} // Optimize pixel ratio
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#040712']} />
      <ambientLight intensity={0.1} />
      
      {/* Central Star Light */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#5CC8FF" distance={100} />
      
      <Suspense fallback={null}>
        <SpaceBackground />
        <Galaxy />
        
        {/* Boot Sequence Sector (Distant from Command Center) */}
        <group position={[0, 500, 500]}>
          <DeepSpaceEnvironment />
          {/* Planet on the far left, massive scale */}
          <CinematicPlanet position={[-180, 0, -100]} size={120} />
          {/* Subtle light for planet atmosphere */}
          <directionalLight position={[1, 0.2, 0.5]} intensity={1.5} color="#e0f7ff" />
          <ambientLight intensity={0.02} color="#00E5FF" />
        </group>

        {/* Core Sector Entities */}
        <group position={[0, 0, 0]}>
          {/* Terrestrial Planet */}
          <ProceduralPlanet position={[15, 0, 10]} size={2} color="#1A2B4C" atmosphereColor="#00E5FF" speed={0.1} type="terrestrial" />
          <OrbitRing radius={18} trafficLevel="normal" />
          <SpacecraftFleet count={150} orbitRadius={18} color="#00E5FF" />
          
          {/* Gas Giant */}
          <ProceduralPlanet position={[-25, 5, -15]} size={3.5} color="#FF9900" atmosphereColor="#FFDD00" speed={0.05} type="gas" hasRings />
          <OrbitRing radius={29} rotationSpeed={-0.05} trafficLevel="busy" />
          <SpacecraftFleet count={300} orbitRadius={29} baseSpeed={1.5} color="#FFD700" />
          
          {/* Lava Planet */}
          <ProceduralPlanet position={[5, -10, -25]} size={1.8} color="#4A1C1C" atmosphereColor="#FF0000" speed={0.02} type="lava" />
          <OrbitRing radius={25.6} rotationSpeed={0.03} trafficLevel="critical" />
          
          {/* Supermassive Black Hole */}
          <BlackHole position={[40, -10, -30]} size={4} />
          <OrbitRing radius={50} rotationSpeed={0.1} trafficLevel="corrupted" />
          
          {/* Warp Gates */}
          <WarpGate position={[8, 2, 20]} rotation={[0, Math.PI / 4, 0]} scale={0.5} />
          <WarpGate position={[-15, -4, 25]} rotation={[0, -Math.PI / 6, 0]} scale={0.8} />
        </group>
      </Suspense>

      {/* Cinematic Post-Processing */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.3} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.8}
        />
        <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

      {/* State-driven Cinematic Camera */}
      <CameraController />
    </Canvas>
  );
}

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Floating gold particles in the void */
export const ParticleField = ({ count = 200 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C6A85B"
        size={0.06}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* Metallic gold-edged cube */
export const MetallicCube = ({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  scale = 1,
  letter,
  feature,
  showFeature = false,
  opacity = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  letter?: string;
  feature?: { icon: string; label: string };
  showFeature?: boolean;
  opacity?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Dark core */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Gold wireframe edges */}
      <mesh>
        <boxGeometry args={[0.92, 0.92, 0.92]} />
        <meshStandardMaterial
          color="#C6A85B"
          wireframe
          transparent
          opacity={opacity * 0.9}
          emissive="#C6A85B"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Letter or feature text (rendered as HTML overlay handled separately) */}
    </group>
  );
};

/* Dice shell — semi-transparent container */
export const DiceShell = ({ opacity = 0.3 }: { opacity?: number }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <mesh ref={ref} scale={3}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#111"
        transparent
        opacity={opacity}
        metalness={0.9}
        roughness={0.1}
        side={THREE.DoubleSide}
      />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="#C6A85B" transparent opacity={0.8} />
      </lineSegments>
    </mesh>
  );
};

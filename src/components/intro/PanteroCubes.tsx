import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#C6A85B";
const LETTERS = ["P", "A", "N", "T", "E", "R", "O"];
const FEATURES = [
  { label: "AI Study" },
  { label: "Mining" },
  { label: "Market" },
  { label: "Social" },
  { label: "Store" },
  { label: "Themes" },
  { label: "Quotes" },
];

interface CubeGroupProps {
  phase: "emerge" | "brand" | "features" | "dissolve";
  elapsed: number; // seconds into this phase
}

const SingleCube = ({
  targetPos,
  index,
  phase,
  elapsed,
}: {
  targetPos: [number, number, number];
  index: number;
  phase: string;
  elapsed: number;
}) => {
  const ref = useRef<THREE.Group>(null);
  const startAngle = (index / 7) * Math.PI * 2;

  useFrame(() => {
    if (!ref.current) return;
    const g = ref.current;

    if (phase === "emerge") {
      // Cubes roll outward from center
      const t = Math.min(elapsed / 1.2, 1);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const dist = ease * 3;
      g.position.x = Math.cos(startAngle) * dist * 0.5;
      g.position.y = Math.sin(startAngle) * dist * 0.3;
      g.position.z = -2 + ease * 4;
      g.rotation.x = (1 - ease) * Math.PI * 2;
      g.rotation.y = (1 - ease) * Math.PI;
      const s = 0.1 + ease * 0.9;
      g.scale.setScalar(s);
    } else if (phase === "brand") {
      // Snap into line
      const t = Math.min(elapsed / 0.6, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      g.position.lerp(new THREE.Vector3(...targetPos), ease * 0.15);
      g.rotation.x *= 0.92;
      g.rotation.y *= 0.92;
      // Impact vibration
      if (t > 0.8 && t < 0.95) {
        g.position.y += Math.sin(elapsed * 60) * 0.02;
      }
    } else if (phase === "features") {
      // Subtle float
      g.position.y = targetPos[1] + Math.sin(elapsed * 2 + index) * 0.05;
      g.rotation.y = Math.sin(elapsed * 1.5 + index * 0.5) * 0.1;
    } else if (phase === "dissolve") {
      const t = Math.min(elapsed / 1.0, 1);
      const s = 1 - t;
      g.scale.setScalar(Math.max(s, 0));
      g.position.z += 0.05;
      g.rotation.y += 0.05;
    }
  });

  const showLetter = phase === "brand" || phase === "features";
  const showFeature = phase === "features";
  const letter = LETTERS[index];
  const feature = FEATURES[index];

  return (
    <group ref={ref}>
      {/* Dark core */}
      <mesh>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* Gold edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.87, 0.87, 0.87)]} />
        <lineBasicMaterial color={GOLD} linewidth={2} />
      </lineSegments>
      {/* Gold wireframe glow */}
      <mesh>
        <boxGeometry args={[0.88, 0.88, 0.88]} />
        <meshStandardMaterial
          color={GOLD}
          wireframe
          transparent
          opacity={0.15}
          emissive={GOLD}
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Letter */}
      {showLetter && (
        <Text
          position={[0, showFeature ? 0.15 : 0, 0.44]}
          fontSize={showFeature ? 0.22 : 0.4}
          color={GOLD}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.ttf"
        >
          {letter}
        </Text>
      )}
      {/* Feature label */}
      {showFeature && (
        <Text
          position={[0, -0.15, 0.44]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.7}
        >
          {feature.label}
        </Text>
      )}
    </group>
  );
};

const CubeGroup = ({ phase, elapsed }: CubeGroupProps) => {
  const positions = useMemo<[number, number, number][]>(
    () =>
      LETTERS.map((_, i) => {
        const x = (i - 3) * 1.1;
        return [x, 0, 2] as [number, number, number];
      }),
    []
  );

  return (
    <group>
      {LETTERS.map((_, i) => (
        <SingleCube
          key={i}
          index={i}
          targetPos={positions[i]}
          phase={phase}
          elapsed={elapsed}
        />
      ))}
    </group>
  );
};

export default CubeGroup;

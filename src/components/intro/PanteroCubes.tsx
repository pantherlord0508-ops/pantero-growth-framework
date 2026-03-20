import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#C6A85B";

const HALF = 0.425; // half of 0.85
const EDGE_THICKNESS = 0.035;
const EDGE_LEN = 0.85;

// 12 edges of a cube: 4 along each axis
const CUBE_EDGES: { pos: [number, number, number]; rot: [number, number, number]; size: [number, number, number] }[] = [
  // 4 edges along X axis (top/bottom, front/back)
  { pos: [0, HALF, HALF], rot: [0, 0, 0], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [0, -HALF, HALF], rot: [0, 0, 0], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [0, HALF, -HALF], rot: [0, 0, 0], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [0, -HALF, -HALF], rot: [0, 0, 0], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  // 4 edges along Y axis
  { pos: [HALF, 0, HALF], rot: [0, 0, Math.PI / 2], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [-HALF, 0, HALF], rot: [0, 0, Math.PI / 2], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [HALF, 0, -HALF], rot: [0, 0, Math.PI / 2], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [-HALF, 0, -HALF], rot: [0, 0, Math.PI / 2], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  // 4 edges along Z axis
  { pos: [HALF, HALF, 0], rot: [Math.PI / 2, 0, 0], size: [EDGE_THICKNESS, EDGE_THICKNESS, EDGE_LEN] },
  { pos: [-HALF, HALF, 0], rot: [Math.PI / 2, 0, 0], size: [EDGE_THICKNESS, EDGE_THICKNESS, EDGE_LEN] },
  { pos: [HALF, -HALF, 0], rot: [Math.PI / 2, 0, 0], size: [EDGE_THICKNESS, EDGE_THICKNESS, EDGE_LEN] },
  { pos: [-HALF, -HALF, 0], rot: [Math.PI / 2, 0, 0], size: [EDGE_THICKNESS, EDGE_THICKNESS, EDGE_LEN] },
];

// 8 corners
const CUBE_CORNERS: [number, number, number][] = [
  [HALF, HALF, HALF], [-HALF, HALF, HALF], [HALF, -HALF, HALF], [-HALF, -HALF, HALF],
  [HALF, HALF, -HALF], [-HALF, HALF, -HALF], [HALF, -HALF, -HALF], [-HALF, -HALF, -HALF],
];
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
      {/* 6-face cube with individual face materials for real 3D depth */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        {/* Each face gets its own material: front, back, top, bottom, right, left */}
        {[...Array(6)].map((_, faceIdx) => (
          <meshPhysicalMaterial
            key={faceIdx}
            attach={`material-${faceIdx}`}
            color="#0a0a0a"
            metalness={0.92}
            roughness={0.08}
            reflectivity={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            envMapIntensity={1.5}
          />
        ))}
      </mesh>

      {/* Beveled gold edge frame — 12 edges via thin boxes */}
      {CUBE_EDGES.map((edge, eIdx) => (
        <mesh key={`edge-${eIdx}`} position={edge.pos} rotation={edge.rot}>
          <boxGeometry args={edge.size} />
          <meshPhysicalMaterial
            color={GOLD}
            metalness={0.95}
            roughness={0.15}
            emissive={GOLD}
            emissiveIntensity={0.35}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}

      {/* Corner accent spheres for premium feel */}
      {CUBE_CORNERS.map((corner, cIdx) => (
        <mesh key={`corner-${cIdx}`} position={corner}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshPhysicalMaterial
            color={GOLD}
            metalness={0.95}
            roughness={0.1}
            emissive={GOLD}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Subtle inner glow plane on front face */}
      <mesh position={[0, 0, 0.426]}>
        <planeGeometry args={[0.75, 0.75]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.04}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Letter on front face */}
      {showLetter && (
        <Text
          position={[0, showFeature ? 0.15 : 0, 0.44]}
          fontSize={showFeature ? 0.22 : 0.4}
          color={GOLD}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
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
          outlineWidth={0.005}
          outlineColor="#000000"
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

import { useRef, useMemo, useEffect } from "react";
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

interface CubeRollConfig {
  startTime: number;
  rollDuration: number;
  startPos: [number, number, number];
  landPos: [number, number, number];
  spinX: number;
  spinY: number;
  spinZ: number;
}

const ROLL_CONFIGS: CubeRollConfig[] = LETTERS.map((_, i) => {
  const startTime = 2 + i * 6;
  const startX = -8 + Math.random() * 2;
  const startZ = 6 + Math.random() * 3;
  const landX = (i - 3) * 1.3;
  const landZ = (Math.random() - 0.5) * 1.5;

  return {
    startTime,
    rollDuration: 3.5,
    startPos: [startX, 0.425, startZ] as [number, number, number],
    landPos: [landX, 0.425, landZ] as [number, number, number],
    spinX: (Math.random() - 0.5) * 12,
    spinY: (Math.random() - 0.5) * 8,
    spinZ: (Math.random() - 0.5) * 10,
  };
});

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBounce = (t: number) => {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
};

// Shared edge geometry for gold outlines
const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.85, 0.85, 0.85));

const RollingCube = ({
  config,
  index,
  globalElapsed,
}: {
  config: CubeRollConfig;
  index: number;
  globalElapsed: number;
}) => {
  const ref = useRef<THREE.Group>(null);
  const letter = LETTERS[index];
  const feature = FEATURES[index];

  useFrame(() => {
    if (!ref.current) return;
    const g = ref.current;
    const t = globalElapsed - config.startTime;

    if (t < 0) {
      g.visible = false;
      return;
    }

    g.visible = true;

    if (t < config.rollDuration) {
      const progress = t / config.rollDuration;
      const moveEase = easeOutCubic(progress);
      const bounceEase = easeOutBounce(progress);

      g.position.x = THREE.MathUtils.lerp(config.startPos[0], config.landPos[0], moveEase);
      g.position.z = THREE.MathUtils.lerp(config.startPos[2], config.landPos[2], moveEase);
      const bounceHeight = (1 - bounceEase) * 2.5;
      g.position.y = config.landPos[1] + bounceHeight;

      const spinDecay = 1 - easeOutCubic(progress);
      g.rotation.x = t * config.spinX * spinDecay;
      g.rotation.y = t * config.spinY * spinDecay;
      g.rotation.z = t * config.spinZ * spinDecay;

      const scaleT = Math.min(t / 0.3, 1);
      g.scale.setScalar(easeOutCubic(scaleT));
    } else {
      const settleT = t - config.rollDuration;

      g.position.x = config.landPos[0];
      g.position.y = config.landPos[1];
      g.position.z = config.landPos[2];

      // Smoothly rotate to face camera
      const revealProgress = Math.min(settleT / 1.5, 1);
      const revealEase = easeOutCubic(revealProgress);

      g.rotation.x = g.rotation.x * (1 - revealEase * 0.08);
      g.rotation.z = g.rotation.z * (1 - revealEase * 0.08);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, 0, revealEase * 0.06);

      // Gentle idle float
      if (settleT > 2) {
        g.position.y = config.landPos[1] + Math.sin(settleT * 1.2 + index) * 0.02;
        g.rotation.y += Math.sin(settleT * 0.5 + index * 0.7) * 0.002;
      }

      g.scale.setScalar(1);
    }
  });

  const settledTime = globalElapsed - config.startTime - config.rollDuration;
  const isRevealing = settledTime > 0.8;
  const showFeature = settledTime > 2.0;

  return (
    <group ref={ref} visible={false}>
      {/* Solid dark cube body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.85}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={0.9}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Gold edge outlines */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={GOLD} linewidth={1} transparent opacity={0.9} />
      </lineSegments>

      {/* Inner glow on front face */}
      <mesh position={[0, 0, 0.426]}>
        <planeGeometry args={[0.75, 0.75]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={isRevealing ? 0.08 : 0.02}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Letter on front face */}
      {isRevealing && (
        <Text
          position={[0, showFeature ? 0.15 : 0, 0.44]}
          fontSize={showFeature ? 0.22 : 0.38}
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

interface CubeGroupProps {
  phase: "emerge" | "brand" | "features" | "dissolve";
  elapsed: number;
  onRevealedCube?: (index: number | null) => void;
}

const CubeGroup = ({ phase, elapsed, onRevealedCube }: CubeGroupProps) => {
  const dissolveRef = useRef<THREE.Group>(null);
  const lastRevealed = useRef<number | null>(null);

  // Track which cube is currently revealed and notify parent
  useEffect(() => {
    let revealed: number | null = null;
    for (let i = ROLL_CONFIGS.length - 1; i >= 0; i--) {
      const config = ROLL_CONFIGS[i];
      const settledTime = elapsed - config.startTime - config.rollDuration;
      if (settledTime > 0.8) {
        revealed = i;
        break;
      }
    }
    if (revealed !== lastRevealed.current) {
      lastRevealed.current = revealed;
      onRevealedCube?.(revealed);
    }
  });

  useFrame(() => {
    if (!dissolveRef.current) return;
    if (phase === "dissolve") {
      const s = Math.max(1 - elapsed / 1.5, 0);
      dissolveRef.current.scale.setScalar(s);
      dissolveRef.current.position.y = elapsed * 0.5;
    } else {
      dissolveRef.current.scale.setScalar(1);
      dissolveRef.current.position.y = 0;
    }
  });

  return (
    <group ref={dissolveRef}>
      {ROLL_CONFIGS.map((config, i) => (
        <RollingCube
          key={i}
          config={config}
          index={i}
          globalElapsed={elapsed}
        />
      ))}
    </group>
  );
};

export default CubeGroup;

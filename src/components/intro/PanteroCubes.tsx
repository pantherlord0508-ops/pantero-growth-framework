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

const HALF = 0.425;
const EDGE_THICKNESS = 0.035;
const EDGE_LEN = 0.85;

// 12 edges of a cube
const CUBE_EDGES: { pos: [number, number, number]; rot: [number, number, number]; size: [number, number, number] }[] = [
  { pos: [0, HALF, HALF], rot: [0, 0, 0], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [0, -HALF, HALF], rot: [0, 0, 0], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [0, HALF, -HALF], rot: [0, 0, 0], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [0, -HALF, -HALF], rot: [0, 0, 0], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [HALF, 0, HALF], rot: [0, 0, Math.PI / 2], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [-HALF, 0, HALF], rot: [0, 0, Math.PI / 2], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [HALF, 0, -HALF], rot: [0, 0, Math.PI / 2], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
  { pos: [-HALF, 0, -HALF], rot: [0, 0, Math.PI / 2], size: [EDGE_LEN, EDGE_THICKNESS, EDGE_THICKNESS] },
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

/* Each cube has its own roll timing and trajectory */
interface CubeRollConfig {
  // When this cube starts rolling (seconds into the roll phase)
  startTime: number;
  // Duration of the roll
  rollDuration: number;
  // Start position (off-screen)
  startPos: [number, number, number];
  // Where it lands on the table
  landPos: [number, number, number];
  // Random spin axes
  spinX: number;
  spinY: number;
  spinZ: number;
  // Time to pause and show feature after landing
  revealStart: number;
  revealDuration: number;
}

// Stagger cubes: each one rolls in one at a time
const ROLL_CONFIGS: CubeRollConfig[] = LETTERS.map((_, i) => {
  const startTime = 2 + i * 6; // 2s initial delay, then every 6s
  const angle = (Math.random() - 0.5) * 0.8; // slight random approach angle
  const startX = -8 + Math.random() * 2;
  const startZ = 6 + Math.random() * 3;
  const landX = (i - 3) * 1.3; // spread across the table
  const landZ = (Math.random() - 0.5) * 1.5;

  return {
    startTime,
    rollDuration: 3.5,
    startPos: [startX, 0.425, startZ] as [number, number, number],
    landPos: [landX, 0.425, landZ] as [number, number, number],
    spinX: (Math.random() - 0.5) * 12,
    spinY: (Math.random() - 0.5) * 8,
    spinZ: (Math.random() - 0.5) * 10,
    revealStart: startTime + 3.5,
    revealDuration: 2.5,
  };
});

// Easing functions
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBounce = (t: number) => {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
};

interface CubeGroupProps {
  phase: "emerge" | "brand" | "features" | "dissolve";
  elapsed: number;
}

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
      // Not yet started — hide
      g.visible = false;
      return;
    }

    g.visible = true;

    if (t < config.rollDuration) {
      // ROLLING PHASE — cube tumbles across the surface
      const progress = t / config.rollDuration;
      const moveEase = easeOutCubic(progress);
      const bounceEase = easeOutBounce(progress);

      // Position: lerp from start to land
      g.position.x = THREE.MathUtils.lerp(config.startPos[0], config.landPos[0], moveEase);
      g.position.z = THREE.MathUtils.lerp(config.startPos[2], config.landPos[2], moveEase);

      // Bounce height — starts high, settles to table level
      const bounceHeight = (1 - bounceEase) * 2.5;
      g.position.y = config.landPos[1] + bounceHeight;

      // Spin — decelerating
      const spinDecay = 1 - easeOutCubic(progress);
      g.rotation.x = t * config.spinX * spinDecay;
      g.rotation.y = t * config.spinY * spinDecay;
      g.rotation.z = t * config.spinZ * spinDecay;

      // Scale pop-in
      const scaleT = Math.min(t / 0.3, 1);
      g.scale.setScalar(easeOutCubic(scaleT));
    } else {
      // LANDED — settle on the table
      const settleT = t - config.rollDuration;

      // Damped settle to final position
      g.position.x = config.landPos[0];
      g.position.y = config.landPos[1];
      g.position.z = config.landPos[2];

      // Slowly rotate to face camera (front face forward)
      const revealProgress = Math.min(settleT / 1.5, 1);
      const revealEase = easeOutCubic(revealProgress);

      // Snap rotation to nearest face-forward orientation, then slowly turn to camera
      g.rotation.x = g.rotation.x * (1 - revealEase * 0.08);
      g.rotation.z = g.rotation.z * (1 - revealEase * 0.08);

      // Rotate Y to face camera (0 = front face visible)
      const targetYRot = 0;
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetYRot, revealEase * 0.06);

      // Gentle idle float after fully settled
      if (settleT > 2) {
        g.position.y = config.landPos[1] + Math.sin(settleT * 1.2 + index) * 0.02;
        g.rotation.y += Math.sin(settleT * 0.5 + index * 0.7) * 0.002;
      }

      g.scale.setScalar(1);
    }
  });

  // Determine what to show on the front face
  const settledTime = globalElapsed - config.startTime - config.rollDuration;
  const isRevealing = settledTime > 0.8;
  const showFeature = settledTime > 2.0;

  return (
    <group ref={ref} visible={false}>
      {/* Dark core with premium material */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
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

      {/* Gold beveled edges */}
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

      {/* Corner accent spheres */}
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

const CubeGroup = ({ phase, elapsed }: CubeGroupProps) => {
  // Global elapsed drives everything — cubes roll in sequentially
  const globalElapsed = elapsed;

  // During dissolve, fade all cubes out
  const dissolveRef = useRef<THREE.Group>(null);

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
          globalElapsed={globalElapsed}
        />
      ))}
    </group>
  );
};

export default CubeGroup;

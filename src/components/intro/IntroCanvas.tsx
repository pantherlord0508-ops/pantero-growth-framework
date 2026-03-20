import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ParticleField, DiceShell } from "./PanteroScene";
import CubeGroup from "./PanteroCubes";

const GOLD_COLOR = new THREE.Color("#C6A85B");

type Phase = "dice" | "emerge" | "brand" | "features" | "dissolve" | "exit";

/* Animated camera — elevated angle looking down at the table */
const CameraRig = ({ phase, elapsed }: { phase: Phase; elapsed: number }) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const target = new THREE.Vector3(0, 0, 0);

    switch (phase) {
      case "dice":
        // Above the table, looking down at the surface
        camera.position.lerp(new THREE.Vector3(0, 5, 8), delta * 2);
        target.set(0, 0, 0);
        break;
      case "emerge":
      case "brand":
      case "features": {
        // Slow cinematic orbit around the table as cubes roll in
        const orbitAngle = elapsed * 0.04; // very slow orbit
        const radius = 7 + Math.sin(elapsed * 0.1) * 0.5;
        const height = 4 + Math.sin(elapsed * 0.15) * 0.3;
        const camTarget = new THREE.Vector3(
          Math.sin(orbitAngle) * radius,
          height,
          Math.cos(orbitAngle) * radius
        );
        camera.position.lerp(camTarget, delta * 1.5);
        target.set(0, 0.3, 0);
        break;
      }
      case "dissolve":
      case "exit":
        camera.position.lerp(new THREE.Vector3(0, 2, 10), delta * 1);
        target.set(0, 0, 0);
        break;
    }

    camera.lookAt(target);
  });

  return null;
};

/* Table surface */
const TableSurface = () => (
  <group>
    {/* Dark reflective table surface */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial
        color="#080808"
        metalness={0.6}
        roughness={0.3}
        reflectivity={0.8}
        clearcoat={0.5}
        clearcoatRoughness={0.1}
      />
    </mesh>
    {/* Subtle gold edge glow on the table */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
      <ringGeometry args={[5, 5.05, 64]} />
      <meshBasicMaterial color="#C6A85B" transparent opacity={0.15} />
    </mesh>
  </group>
);

/* Scene lighting — dramatic for dice rolling */
const SceneLighting = () => (
  <>
    <ambientLight intensity={0.1} />
    <directionalLight
      position={[5, 8, 5]}
      intensity={1.2}
      color="#ffffff"
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
    <pointLight position={[0, 4, 0]} intensity={1.5} color="#C6A85B" distance={15} decay={2} />
    <pointLight position={[-4, 3, -2]} intensity={0.6} color="#C6A85B" distance={10} decay={2} />
    <pointLight position={[4, 3, 2]} intensity={0.4} color="#ffffff" distance={10} decay={2} />
    {/* Rim light from behind */}
    <spotLight
      position={[0, 5, -8]}
      angle={0.5}
      penumbra={0.8}
      intensity={0.8}
      color="#C6A85B"
      castShadow={false}
    />
  </>
);

interface IntroCanvasProps {
  phase: Phase;
}

const IntroCanvasContent = ({ phase }: IntroCanvasProps) => {
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const phaseRef = useRef(phase);
  const startTimeRef = useRef(Date.now());
  const totalElapsedRef = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
    startTimeRef.current = Date.now();
    setPhaseElapsed(0);
  }, [phase]);

  useFrame(() => {
    const now = (Date.now() - startTimeRef.current) / 1000;
    setPhaseElapsed(now);
    totalElapsedRef.current += 1 / 60;
  });

  const cubePhase =
    phase === "emerge"
      ? "emerge"
      : phase === "brand"
        ? "brand"
        : phase === "features"
          ? "features"
          : "dissolve";

  return (
    <>
      <CameraRig phase={phase} elapsed={phaseElapsed} />
      <SceneLighting />

      {/* Floating particles in the void */}
      <ParticleField count={phase === "dissolve" || phase === "exit" ? 400 : 200} />

      {/* Table surface */}
      <TableSurface />

      {/* Dice shell — visible only during dice phase */}
      {phase === "dice" && <DiceShell opacity={0.25} />}

      {/* Rolling cubes — visible from emerge onwards */}
      {phase !== "dice" && (
        <CubeGroup phase={cubePhase} elapsed={phaseElapsed} />
      )}
    </>
  );
};

const IntroCanvas = ({ phase }: IntroCanvasProps) => {
  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 5, 8], fov: 50, near: 0.1, far: 100 }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000" }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 12, 30]} />
        <IntroCanvasContent phase={phase} />
      </Canvas>
    </div>
  );
};

export default IntroCanvas;

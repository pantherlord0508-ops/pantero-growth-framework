import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ParticleField } from "./PanteroScene";
import CubeGroup from "./PanteroCubes";

type Phase = "dice" | "emerge" | "brand" | "features" | "dissolve" | "exit";

/* Fixed camera — no orbit, just a static elevated view */
const StaticCamera = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(3, 4, 7);
    camera.lookAt(0, 0.3, 0);
  }, [camera]);

  return null;
};

/* Table surface */
const TableSurface = () => (
  <group>
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
      <ringGeometry args={[5, 5.05, 64]} />
      <meshBasicMaterial color="#C6A85B" transparent opacity={0.15} />
    </mesh>
  </group>
);

/* Scene lighting */
const SceneLighting = () => (
  <>
    <ambientLight intensity={0.15} />
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
  onRevealedCube?: (index: number | null) => void;
}

const IntroCanvasContent = ({ phase, onRevealedCube }: IntroCanvasProps) => {
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const phaseRef = useRef(phase);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    phaseRef.current = phase;
    startTimeRef.current = Date.now();
    setPhaseElapsed(0);
  }, [phase]);

  useFrame(() => {
    const now = (Date.now() - startTimeRef.current) / 1000;
    setPhaseElapsed(now);
  });

  const cubePhase =
    phase === "emerge" ? "emerge"
      : phase === "brand" ? "brand"
        : phase === "features" ? "features"
          : "dissolve";

  return (
    <>
      <StaticCamera />
      <SceneLighting />
      <ParticleField count={phase === "dissolve" || phase === "exit" ? 400 : 200} />
      <TableSurface />
      {phase !== "dice" && (
        <CubeGroup phase={cubePhase} elapsed={phaseElapsed} onRevealedCube={onRevealedCube} />
      )}
    </>
  );
};

const IntroCanvas = ({ phase, onRevealedCube }: IntroCanvasProps) => {
  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [3, 4, 7], fov: 50, near: 0.1, far: 100 }}
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
        <IntroCanvasContent phase={phase} onRevealedCube={onRevealedCube} />
      </Canvas>
    </div>
  );
};

export default IntroCanvas;

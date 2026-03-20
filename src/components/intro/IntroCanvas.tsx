import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ParticleField, DiceShell } from "./PanteroScene";
import CubeGroup from "./PanteroCubes";

const GOLD_COLOR = new THREE.Color("#C6A85B");

type Phase = "dice" | "emerge" | "brand" | "features" | "dissolve" | "exit";

/* Animated camera controller */
const CameraRig = ({ phase }: { phase: Phase }) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const target = new THREE.Vector3();

    switch (phase) {
      case "dice":
        // Inside the dice looking out
        target.set(0, 0, 0);
        camera.position.lerp(new THREE.Vector3(0, 0, 0.5), delta * 2);
        break;
      case "emerge":
        // Pull back to watch cubes emerge
        target.set(0, 0, 2);
        camera.position.lerp(new THREE.Vector3(0, 0.5, 6), delta * 1.5);
        break;
      case "brand":
        // Level view of aligned cubes
        target.set(0, 0, 2);
        camera.position.lerp(new THREE.Vector3(0, 0.2, 5.5), delta * 2);
        break;
      case "features":
        // Slow orbit
        camera.position.lerp(new THREE.Vector3(0, 0.3, 5), delta * 1);
        target.set(0, 0, 2);
        break;
      case "dissolve":
      case "exit":
        // Push forward through particles
        camera.position.z -= delta * 2;
        target.set(0, 0, camera.position.z - 5);
        break;
    }

    camera.lookAt(target);
  });

  return null;
};

/* Scene lighting */
const SceneLighting = () => (
  <>
    <ambientLight intensity={0.15} />
    <directionalLight
      position={[5, 5, 5]}
      intensity={0.8}
      color="#ffffff"
    />
    <pointLight position={[0, 0, 3]} intensity={1.2} color="#C6A85B" distance={10} />
    <pointLight position={[-3, 2, 0]} intensity={0.4} color="#C6A85B" distance={8} />
  </>
);

interface IntroCanvasProps {
  phase: Phase;
}

const IntroCanvasContent = ({ phase }: IntroCanvasProps) => {
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const phaseRef = useRef(phase);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    phaseRef.current = phase;
    startTimeRef.current = Date.now();
    setPhaseElapsed(0);
  }, [phase]);

  useFrame(() => {
    setPhaseElapsed((Date.now() - startTimeRef.current) / 1000);
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
      <CameraRig phase={phase} />
      <SceneLighting />
      <ParticleField count={phase === "dissolve" || phase === "exit" ? 400 : 150} />

      {/* Dice shell — visible only during dice phase */}
      {phase === "dice" && <DiceShell opacity={0.25} />}

      {/* Cubes — visible from emerge onwards */}
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
        camera={{ position: [0, 0, 0.5], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000" }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 25]} />
        <IntroCanvasContent phase={phase} />
      </Canvas>
    </div>
  );
};

export default IntroCanvas;

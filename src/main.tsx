import { StrictMode, useState, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import MainMenu from "./MainMenu.tsx";
import Credits from "./Credits.tsx";
import * as THREE from "three";
import createStore from "zustand";
import { KeyboardControls, Grid, Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import Snowfall from "react-snowfall";
import { Player } from "./assets/HomeScreenPlayer";
import { Physics } from "@react-three/rapier";

const keyboardMap = [
  { name: "p1MoveForward", keys: ["KeyW"] },
  { name: "p1MoveBackward", keys: ["KeyS"] },
  { name: "p1MoveLeft", keys: ["KeyA"] },
  { name: "p1MoveRight", keys: ["KeyD"] },

  { name: "p1RotateLeft", keys: ["KeyV"] },
  { name: "p1RotateRight", keys: ["KeyB"] },

  { name: "p2MoveForward", keys: ["ArrowUp"] },
  { name: "p2MoveBackward", keys: ["ArrowDown"] },
  { name: "p2MoveLeft", keys: ["ArrowLeft"] },
  { name: "p2MoveRight", keys: ["ArrowRight"] },

  { name: "p2RotateLeft", keys: ["Comma"] },
  { name: "p2RotateRight", keys: ["Period"] },
];

function RotateCamera() {
  useFrame((state, deltaTime) => {
    state.camera.rotateZ(deltaTime * 0.2);
  });

  return null;
}

function Main() {
  const [scene, setScene] = useState(0);

  return (
    <StrictMode>
      <KeyboardControls map={keyboardMap}>
        {scene === 0 || scene === 1 ? (
          <>
            <Suspense fallback={null}>
              <Canvas camera={{ position: [0, 10, 0], fov: 50 }}>
                <RotateCamera />

                <ambientLight intensity={0.3} />
                <directionalLight position={[10, 10, 10]} intensity={0.5} />

                <Environment preset="night" background={false} />

                <Grid
                  position={[0, 0, 0]}
                  sectionSize={1}
                  infiniteGrid
                  cellSize={0.5}
                  fadeDistance={10}
                  fadeStrength={1}
                  cellColor="#6f6f6f"
                  sectionColor="#3f3f3f"
                />
                <Physics>
                  <Player />
                </Physics>
              </Canvas>
            </Suspense>
            <Snowfall color="rgba(255, 255, 255, 0.4)" />

            {scene === 0 ? (
              <MainMenu setScene={setScene} />
            ) : (
              <Credits setScene={setScene} />
            )}
          </>
        ) : (
          <App />
        )}
      </KeyboardControls>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Main />);

export const useStore = createStore(() => ({
  scene: new THREE.Scene(),
}));

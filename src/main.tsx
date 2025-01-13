import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as THREE from "three";
import createStore from "zustand";
import { KeyboardControls } from "@react-three/drei";

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KeyboardControls map={keyboardMap}>
      <App />
    </KeyboardControls>
  </StrictMode>
);

export const useStore = createStore(() => ({
  scene: new THREE.Scene(),
}));

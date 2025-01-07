import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as THREE from 'three'
import createStore from 'zustand'
import { Canvas } from "@react-three/fiber";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

export const useStore = createStore((set) => ({
    scene: new THREE.Scene(),
}));

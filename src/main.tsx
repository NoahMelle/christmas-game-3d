import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import MainMenu from "./MainMenu.tsx";
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

enum GameScene {
    Menu,
    Game,
}

function Main() {
    const [scene, setScene] = useState(GameScene.Menu);
    const [playerColors, setPlayerColors] = useState({
        p1: "blue",
        p2: "red",
    });
    const [isCrowdDisabled, setIsCrowdDisabled] = useState(false);

    useEffect(() => {
        if (isCrowdDisabled) {
            localStorage.setItem(
                "crowdDisabled",
                JSON.stringify(isCrowdDisabled)
            );
        }
    }, [isCrowdDisabled]);

    useEffect(() => {
        const crowdDisabledLocalStorage = localStorage.getItem("crowdDisabled");
        if (crowdDisabledLocalStorage) {
            setIsCrowdDisabled(JSON.parse(crowdDisabledLocalStorage));
        }
    }, []);

    return (
        <StrictMode>
            <KeyboardControls map={keyboardMap}>
                {scene != GameScene.Game ? (
                    <MainMenu
                        setScene={setScene}
                        playerColors={playerColors}
                        setPlayerColors={setPlayerColors}
                        isCrowdDisabled={isCrowdDisabled}
                        setIsCrowdDisabled={setIsCrowdDisabled}
                    />
                ) : (
                    <App
                        setScene={setScene}
                        playerColors={playerColors}
                        isCrowdDisabled={isCrowdDisabled}
                    />
                )}
            </KeyboardControls>
        </StrictMode>
    );
}

createRoot(document.getElementById("root")!).render(<Main />);

export const useStore = createStore(() => ({
    scene: new THREE.Scene(),
}));

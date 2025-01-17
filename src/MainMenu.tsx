import { Environment, Grid } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import React, { useState, Suspense } from "react";
import Snowfall from "react-snowfall";
import { Player } from "./assets/HomeScreenPlayer";
import Credits from "./Credits";
import Settings from "./assets/Settings";
import styles from "./menu.module.scss";

export enum MenuState {
    Menu,
    Settings,
    Credits,
}

export interface PlayerColors {
    p1: string;
    p2: string;
}

export default function EmptyScene({
    setScene,
    playerColors,
    setPlayerColors,
}: {
    setScene: React.Dispatch<React.SetStateAction<number>>;
    playerColors: PlayerColors;
    setPlayerColors: React.Dispatch<React.SetStateAction<PlayerColors>>;
}) {
    const [currentMenuState, setCurrentMenuState] = useState(MenuState.Menu);

    return (
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
            <div className={styles.menuContainer}>
                {currentMenuState === MenuState.Menu ? (
                    <Main
                        setScene={setScene}
                        setCurrentMenuState={setCurrentMenuState}
                    />
                ) : (
                    <div className={styles.menuScreen}>
                        {currentMenuState === MenuState.Credits ? (
                            <Credits />
                        ) : currentMenuState === MenuState.Settings ? (
                            <Settings
                                playerColors={playerColors}
                                setPlayerColors={setPlayerColors}
                            />
                        ) : null}
                        <button
                            onClick={() => setCurrentMenuState(MenuState.Menu)}
                            className={styles.menuButton}
                        >
                            Back
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

const Main = ({
    setScene,
    setCurrentMenuState,
}: {
    setScene: React.Dispatch<React.SetStateAction<number>>;
    setCurrentMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}) => {
    return (
        <div className={styles.mainMenu}>
            <h1>GAME NAME</h1>
            <button onClick={() => setScene(1)} className={styles.menuButton}>
                Play
            </button>
            <MenuButton
                label="Settings"
                targetState={MenuState.Settings}
                setCurrentMenuState={setCurrentMenuState}
            />
            <MenuButton
                label={"Credits"}
                targetState={MenuState.Credits}
                setCurrentMenuState={setCurrentMenuState}
            />
        </div>
    );
};

const MenuButton = ({
    label,
    targetState,
    setCurrentMenuState,
}: {
    label: string;
    targetState: MenuState;
    setCurrentMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}) => {
    return (
        <button
            onClick={() => setCurrentMenuState(targetState)}
            className={styles.menuButton}
        >
            {label}
        </button>
    );
};

function RotateCamera() {
    useFrame((state, deltaTime) => {
        state.camera.rotateZ(deltaTime * 0.2);
    });

    return null;
}

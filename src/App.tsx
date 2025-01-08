import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Canvas } from "@react-three/fiber";
import Rink from "./assets/Rink";
import { Puck } from "./assets/Puck";
import Player from "./Player";
import { Vector3 } from "three";

export default function App() {
    const keyboardMap = [
        { name: "p1MoveForward", keys: ["KeyW"] },
        { name: "p1MoveBackward", keys: ["KeyS"] },
        { name: "p1MoveLeft", keys: ["KeyA"] },
        { name: "p1MoveRight", keys: ["KeyD"] },

        { name: "p2MoveForward", keys: ["ArrowUp"] },
        { name: "p2MoveBackward", keys: ["ArrowDown"] },
        { name: "p2MoveLeft", keys: ["ArrowLeft"] },
        { name: "p2MoveRight", keys: ["ArrowRight"] },
    ];

    const startingDistance = 10;

    return (
        <KeyboardControls map={keyboardMap}>
            <Canvas>
                <ambientLight />
                <Physics debug={true}>
                    <Rink />
                    <Player
                        color="red"
                        startingPos={new Vector3(0, 2, startingDistance)}
                        playerNumber={1}
                    />
                                        <Player
                        color="red"
                        startingPos={new Vector3(0, 2, -startingDistance)}
                        playerNumber={2}
                    />
                    <Puck />
                </Physics>
                <OrbitControls />
            </Canvas>
        </KeyboardControls>
    );
}

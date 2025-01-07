import { OrbitControls, KeyboardControls, useGLTF } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Canvas } from "@react-three/fiber";
import Ecctrl from "ecctrl";

export default function App() {
    const keyboardMap = [
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
        { name: "run", keys: ["Shift"] },
        // Optional animation key map
        { name: "action1", keys: ["1"] },
        { name: "action2", keys: ["2"] },
        { name: "action3", keys: ["3"] },
        { name: "action4", keys: ["KeyF"] },
    ];

    return (
        <Canvas>
            <ambientLight />
            <Physics debug={true}>
                <Rink />
                <KeyboardControls map={keyboardMap}>
                    <Ecctrl disableFollowCam={false} position={[0, 5, -10]}>
                        <Player />
                    </Ecctrl>
                </KeyboardControls>
                <Puck />
            </Physics>
            <OrbitControls />
        </Canvas>
    );
}

const Plane = () => {
    return (
        <RigidBody type="fixed">
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
        </RigidBody>
    );
};

const Puck = () => {
    return (
        <RigidBody type="dynamic" colliders="trimesh" mass={0.1} >
            <mesh position={[0, 4, 0]}>
                <sphereGeometry args={[0.3]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>
    );
}

const Player = () => {
    return (
        // <RigidBody>
        <mesh>
            <capsuleGeometry args={[0.3, 0.7, 3]} />
            <meshStandardMaterial color="blue" />
        </mesh>
        // </RigidBody>
    );
};

const Rink = () => {
    return (
        <ModelWithCollision url="/rink.glb" />
    );
}

function ModelWithCollision({ url }: { url: string }) {
    const { scene } = useGLTF(url);

    return (
        <RigidBody type="fixed" colliders="trimesh">
            <primitive object={scene} />
        </RigidBody>
    );
}

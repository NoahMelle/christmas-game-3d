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
            <Physics>
                <Rink />
                <KeyboardControls map={keyboardMap}>
                    <Ecctrl
                        disableFollowCam={false}
                        position={[0, 5, -10]}
                        camCollision
                        floatHeight={0}
                        maxVelLimit={5}
                        friction={0.01}
                    >
                        <Player />
                    </Ecctrl>
                </KeyboardControls>
                <Puck />
            </Physics>
            <OrbitControls />
        </Canvas>
    );
}

const Puck = () => {
    return (
        <RigidBody position={[0, 1, 0]} colliders="trimesh" enabledRotations={[false, false, false]} enabledTranslations={[true, false, true]}>
            <mesh>
                <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>
    );
};

const Player = () => {
    return (
        <mesh>
            <capsuleGeometry args={[0.3, 0.7, 3]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
};

const Rink = () => {
    return <ModelWithCollision url="/rink.glb" />;
};

function ModelWithCollision({ url }: Readonly<{ url: string }>) {
    const { scene } = useGLTF(url);

    return (
        <RigidBody type="fixed" colliders="trimesh" friction={0.01} restitution={0.7} linearDamping={0} angularDamping={0}>
            <primitive object={scene} />
        </RigidBody>
    );
}

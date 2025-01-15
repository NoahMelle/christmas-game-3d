import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { Vector3 } from "three";
import {
    RapierRigidBody,
    RigidBody,
    useRevoluteJoint,
} from "@react-three/rapier";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Stick } from "./Stick";
import { GLTF } from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";

type GLTFResult = GLTF & {
    nodes: {
        Cylinder: THREE.Mesh;
        Icosphere: THREE.Mesh;
        Cube004: THREE.Mesh;
        Cube003: THREE.Mesh;
    };
    materials: {};
};

enum RotationDirection {
    LEFT,
    RIGHT,
    NONE,
}

export function Player({
    color,
    startingPos,
    playerNumber,
    lastPuckReset,
}: {
    color: string;
    startingPos: React.MutableRefObject<Vector3>;
    playerNumber: number;
    lastPuckReset: number;
} & JSX.IntrinsicElements["group"]) {
    const { nodes } = useGLTF(
        "/player.glb"
    ) as unknown as GLTFResult;
    const playerRef = useRef<RapierRigidBody>(null!);
    const stickRef = useRef<RapierRigidBody>(null!);
    const [_, getKeys] = useKeyboardControls();
    const { camera } = useThree();
    const { useCameraRotation } = useControls({ useCameraRotation: true });
    useRevoluteJoint(playerRef, stickRef, [
        [0, 0, 0],
        [0, 0, 0],
        [0, 1, 0],
    ]);
    const [rotationDirection, setRotationDirection] =
        React.useState<RotationDirection>(RotationDirection.NONE);

    const material = new THREE.MeshStandardMaterial({ color: color });

    useFrame((_, dt) => {
        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;
        let rotateLeft = false;
        let rotateRight = false;

        // Get movement keys based on player number
        if (playerNumber === 1) {
            ({
                p1MoveForward: moveForward,
                p1MoveBackward: moveBackward,
                p1MoveLeft: moveLeft,
                p1MoveRight: moveRight,
                p1RotateLeft: rotateLeft,
                p1RotateRight: rotateRight,
            } = getKeys());
        } else if (playerNumber === 2) {
            ({
                p2MoveForward: moveForward,
                p2MoveBackward: moveBackward,
                p2MoveLeft: moveLeft,
                p2MoveRight: moveRight,
                p2RotateLeft: rotateLeft,
                p2RotateRight: rotateRight,
            } = getKeys());
        }

        const quaternion = useCameraRotation
            ? camera.quaternion.clone()
            : new THREE.Quaternion().copy(playerRef.current.rotation());
        const forward = new THREE.Vector3(0, 0, -1)
            .applyQuaternion(quaternion)
            .normalize();
        const right = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(quaternion)
            .normalize();

        let impulse = new THREE.Vector3();
        const impulseStrength = 2 * dt;

        if (moveForward) impulse.add(forward.multiplyScalar(impulseStrength));
        if (moveBackward) impulse.add(forward.multiplyScalar(-impulseStrength));
        if (moveLeft) impulse.add(right.multiplyScalar(-impulseStrength));
        if (moveRight) impulse.add(right.multiplyScalar(impulseStrength));

        // Apply impulse to the player
        if (impulse.length() > 0) {
            playerRef.current?.applyImpulse(
                { x: impulse.x * 10, y: impulse.y * 10, z: impulse.z * 10 },
                true
            );

            // Smooth rotation towards movement direction
            const targetRotation = Math.atan2(-impulse.x, -impulse.z);
            const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                targetRotation
            );

            const currentQuaternion = new THREE.Quaternion().copy(
                playerRef.current.rotation()
            );
            currentQuaternion.slerp(targetQuaternion, 0.1);
            playerRef.current?.setRotation(
                {
                    x: currentQuaternion.x,
                    y: currentQuaternion.y,
                    z: currentQuaternion.z,
                    w: currentQuaternion.w,
                },
                true
            );
        }

        const rotationSpeed = 4;

        const treshhold = 3;

        const yRotationVel = stickRef.current?.angvel().y;

        if (yRotationVel < treshhold && yRotationVel > -treshhold) {
            setRotationDirection(RotationDirection.NONE);
        }

        // Stick rotation
        if (rotateLeft) {
            if (rotationDirection !== RotationDirection.LEFT) {
                stickRef.current?.applyTorqueImpulse(
                    { x: 0, y: -rotationSpeed, z: 0 },
                    true
                );

                setRotationDirection(RotationDirection.LEFT);
            }
        } else if (rotateRight) {
            if (rotationDirection !== RotationDirection.RIGHT) {
                stickRef.current?.applyTorqueImpulse(
                    { x: 0, y: rotationSpeed, z: 0 },
                    true
                );

                setRotationDirection(RotationDirection.RIGHT);
            }
        }
        if (!rotateLeft && !rotateRight) {
            const angVel = stickRef.current?.angvel();
            if (angVel) {
                stickRef.current?.setAngvel(
                    {
                        x: angVel.x * 0.9,
                        y: angVel.y * 0.9,
                        z: angVel.z * 0.9,
                    },
                    true
                );
            }
        }
    });

    useEffect(() => {
        playerRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
        playerRef.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
        playerRef.current?.setTranslation(
            startingPos.current ?? { x: 0, y: 0, z: 0 },
            true
        );
    }, [lastPuckReset]);

    return (
        <group position={startingPos.current ?? new THREE.Vector3()}>
            <RigidBody
                ref={playerRef}
                restitution={0.3}
                friction={0.7}
                linearDamping={0.5}
                colliders="hull"
                enabledRotations={[false, false, false]}
                rotation={[0, degToRad(90), 0]}
            >
                <group name="PlayerBody">
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder.geometry}
                        material={material}
                        position={[0, 0.903, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Icosphere.geometry}
                        material={material}
                        position={[0, 2.567, 0]}
                        scale={0.535}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cube004.geometry}
                        material={material}
                        position={[0.283, -0.285, -0.053]}
                        rotation={[0, -0.11, 0]}
                        scale={[0.027, 0.032, 0.242]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cube003.geometry}
                        material={material}
                        position={[-0.278, -0.285, -0.053]}
                        rotation={[0, 0.187, 0]}
                        scale={[0.027, 0.032, 0.242]}
                    />
                </group>
            </RigidBody>
            <RigidBody ref={stickRef} >
                <Stick />
            </RigidBody>
        </group>
    );
}

useGLTF.preload("/player.glb");

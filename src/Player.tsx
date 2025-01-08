import React, { useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree, Vector3 } from "@react-three/fiber";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useTh } from "leva/dist/declarations/src/styles";
import { useControls } from "leva";

export default function Player({
    color,
    startingPos,
    playerNumber,
}: {
    color: string;
    startingPos: Vector3;
    playerNumber: number;
}) {
    const ref = useRef<RapierRigidBody>(null!);
    const [subscribeKeys, getKeys] = useKeyboardControls();

    const { camera } = useThree();

    const { useCameraRotation } = useControls({
        useCameraRotation: true,
    });

    useFrame((state, dt) => {
        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;

        if (playerNumber === 1) {
            const { p1MoveForward, p1MoveBackward, p1MoveLeft, p1MoveRight } =
                getKeys();

            moveForward = p1MoveForward;
            moveBackward = p1MoveBackward;
            moveLeft = p1MoveLeft;
            moveRight = p1MoveRight;
        } else if (playerNumber === 2) {
            const { p2MoveForward, p2MoveBackward, p2MoveLeft, p2MoveRight } =
                getKeys();

            moveForward = p2MoveForward;
            moveBackward = p2MoveBackward;
            moveLeft = p2MoveLeft;
            moveRight = p2MoveRight;
        }

        // Get the player's rotation (quaternion) and compute the forward and right vectors

        const quaternion = useCameraRotation ? camera.quaternion : ref.current?.rotation();
        const forward = new THREE.Vector3(0, 0, -1)
            .applyQuaternion(quaternion)
            .normalize();
        const right = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(quaternion)
            .normalize();

        let impulse = new THREE.Vector3(0, 0, 0);
        const impulseStrength = 0.5 * dt;

        if (moveForward) impulse.add(forward.multiplyScalar(impulseStrength));
        if (moveBackward) impulse.add(forward.multiplyScalar(-impulseStrength));
        if (moveLeft) impulse.add(right.multiplyScalar(-impulseStrength));
        if (moveRight) impulse.add(right.multiplyScalar(impulseStrength));

        impulse.multiplyScalar(10); // Scale the impulse

        ref.current?.applyImpulse(
            { x: impulse.x, y: impulse.y, z: impulse.z },
            true
        );
    });

    return (
        <RigidBody
            ref={ref}
            position={startingPos}
            restitution={0.3}
            friction={0.7}
            linearDamping={0.5}
            angularDamping={0.5}
            colliders="hull"
            enabledRotations={[false, false, false]}
            rotation={[0, degToRad(90), 0]}
        >
            <mesh>
                <capsuleGeometry args={[0.3, 0.7, 3]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </RigidBody>
    );
}

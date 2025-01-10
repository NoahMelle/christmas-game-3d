import React, { useEffect, useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useControls } from "leva";

export default function Player({
    color,
    startingPos,
    playerNumber,
    lastPuckReset,
}: Readonly<{
    color: string;
    startingPos: React.RefObject<THREE.Vector3>;
    playerNumber: number;
    lastPuckReset: number;
}>) {
    const ref = useRef<RapierRigidBody>(null!);
    const [_, getKeys] = useKeyboardControls();

    const { camera } = useThree();

    const { useCameraRotation } = useControls({
        useCameraRotation: true,
    });

    useFrame((_, dt) => {
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

        const quaternion = useCameraRotation
            ? new THREE.Quaternion(
                  camera.quaternion.x,
                  camera.quaternion.y,
                  camera.quaternion.z,
                  camera.quaternion.w
              )
            : ref.current.rotation();
        const forward = new THREE.Vector3(0, 0, -1)
            .applyQuaternion(quaternion)
            .normalize();
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(quaternion)
            .normalize();
        right.y = 0;
        right.normalize();

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

    useEffect(() => {
        ref.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
        ref.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
        ref.current?.setTranslation(
            {
                x: startingPos.current?.x ?? 0,
                y: startingPos.current?.y ?? 0,
                z: startingPos.current?.z ?? 0,
            },
            true
        );
    }, [lastPuckReset]);

    return (
        <RigidBody
            ref={ref}
            position={startingPos.current ?? new THREE.Vector3()}
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

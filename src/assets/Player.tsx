import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import { Vector3 } from "three";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { useControls } from "leva";
import { Stick } from "./Stick";

type GLTFResult = GLTF & {
  nodes: {
    Cylinder: THREE.Mesh;
    Icosphere: THREE.Mesh;
    Cube004: THREE.Mesh;
    Cube003: THREE.Mesh;
  };
  materials: {};
};

export function Player({
  startingPos,
  playerNumber,
  lastPuckReset,
}: {
  color: string;
  startingPos: React.MutableRefObject<Vector3>;
  playerNumber: number;
  lastPuckReset: number;
} & JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/player.glb") as GLTFResult;

  const playerRef = useRef<RapierRigidBody>(null!);
  const stickRef = useRef<RapierRigidBody>(null!); // Separate ref for the stick
  const [_, getKeys] = useKeyboardControls();
  const [stickRotation, setStickRotation] = useState(0);

  const { camera } = useThree();
  const { useCameraRotation } = useControls({
    useCameraRotation: true,
  });

  useFrame((_, dt) => {
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let rotateLeft = false;
    let rotateRight = false;

    if (playerNumber === 1) {
      const {
        p1MoveForward,
        p1MoveBackward,
        p1MoveLeft,
        p1MoveRight,
        p1RotateLeft,
        p1RotateRight,
      } = getKeys();

      moveForward = p1MoveForward;
      moveBackward = p1MoveBackward;
      moveLeft = p1MoveLeft;
      moveRight = p1MoveRight;
      rotateLeft = p1RotateLeft;
      rotateRight = p1RotateRight;
    } else if (playerNumber === 2) {
      const {
        p2MoveForward,
        p2MoveBackward,
        p2MoveLeft,
        p2MoveRight,
        p2RotateLeft,
        p2RotateRight,
      } = getKeys();

      moveForward = p2MoveForward;
      moveBackward = p2MoveBackward;
      moveLeft = p2MoveLeft;
      moveRight = p2MoveRight;
      rotateLeft = p2RotateLeft;
      rotateRight = p2RotateRight;
    }

    const quaternion = useCameraRotation
      ? new THREE.Quaternion(
          camera.quaternion.x,
          camera.quaternion.y,
          camera.quaternion.z,
          camera.quaternion.w
        )
      : playerRef.current.rotation();
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
    const impulseStrength = 2 * dt;

    if (moveForward) impulse.add(forward.multiplyScalar(impulseStrength));
    if (moveBackward) impulse.add(forward.multiplyScalar(-impulseStrength));
    if (moveLeft) impulse.add(right.multiplyScalar(-impulseStrength));
    if (moveRight) impulse.add(right.multiplyScalar(impulseStrength));

    impulse.multiplyScalar(10); // Scale the impulse

    playerRef.current?.applyImpulse(
      { x: impulse.x, y: impulse.y, z: impulse.z },
      true
    );

    // Rotate player based on movement direction
    if (impulse.length() > 0) {
      const targetRotation = Math.atan2(-impulse.x, -impulse.z);
      const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        targetRotation
      );
      const currentQuaternion = new THREE.Quaternion(
        playerRef.current.rotation().x,
        playerRef.current.rotation().y,
        playerRef.current.rotation().z,
        playerRef.current.rotation().w
      );
      const slerpedQuaternion = new THREE.Quaternion().slerpQuaternions(
        currentQuaternion,
        targetQuaternion,
        0.1 // Adjust the interpolation factor for smoothness
      );
      playerRef.current?.setRotation(
        {
          x: slerpedQuaternion.x,
          y: slerpedQuaternion.y,
          z: slerpedQuaternion.z,
          w: slerpedQuaternion.w,
        },
        true
      );
    }

    // Update stick rotation when rotate keys are pressed
    // const rotationSpeed = 0.1;
    // if (rotateLeft) setStickRotation((prev) => prev + rotationSpeed);
    // if (rotateRight) setStickRotation((prev) => prev - rotationSpeed);

    // // Keep stick positioned relative to the player
    // if (stickRef.current) {
    //   const playerPosition = playerRef.current.translation();
    //   stickRef.current.position.set(
    //     playerPosition.x,
    //     playerPosition.y,
    //     playerPosition.z
    //   );
    //   stickRef.current.rotation.set(0, stickRotation, 0); // Independent rotation
    // }
  });

  useEffect(() => {
    playerRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
    playerRef.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
    playerRef.current?.setTranslation(
      {
        x: startingPos.current?.x ?? 0,
        y: startingPos.current?.y ?? 0,
        z: startingPos.current?.z ?? 0,
      },
      true
    );
  }, [lastPuckReset]);

  return (
    <>
      <RigidBody
        ref={playerRef}
        position={startingPos.current ?? new THREE.Vector3()}
        restitution={0.3}
        friction={0.7}
        linearDamping={0.5}
        colliders="hull"
        enabledRotations={[false, false, false]}
        rotation={[0, degToRad(90), 0]}
      >
        <group name="PlayerBody">
          <mesh
            name="Cylinder"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder.geometry}
            material={nodes.Cylinder.material}
            position={[0, 0.903, 0]}
          />
          <mesh
            name="Icosphere"
            castShadow
            receiveShadow
            geometry={nodes.Icosphere.geometry}
            material={nodes.Icosphere.material}
            position={[0, 2.567, 0]}
            scale={0.535}
          />
          <mesh
            name="Cube004"
            castShadow
            receiveShadow
            geometry={nodes.Cube004.geometry}
            material={nodes.Cube004.material}
            position={[0.283, -0.285, -0.053]}
            rotation={[0, -0.11, 0]}
            scale={[0.027, 0.032, 0.242]}
          />
          <mesh
            name="Cube003"
            castShadow
            receiveShadow
            geometry={nodes.Cube003.geometry}
            material={nodes.Cube003.material}
            position={[-0.278, -0.285, -0.053]}
            rotation={[0, 0.187, 0]}
            scale={[0.027, 0.032, 0.242]}
          />
        </group>
      </RigidBody>
      <RigidBody enabledRotations={[false, false, false]} ref={stickRef}>
        <Stick rotation={[0, stickRotation, 0]} />
      </RigidBody>
    </>
  );
}

useGLTF.preload("/player.glb");

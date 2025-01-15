import * as THREE from "three";
import { useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Cylinder: THREE.Mesh;
    Icosphere: THREE.Mesh;
    Cube004: THREE.Mesh;
    Cube003: THREE.Mesh;
  };
  materials: {};
};

export function Player() {
  const { nodes } = useGLTF("/player.glb") as unknown as GLTFResult;
  const playerRef = useRef<RapierRigidBody>(null!);

  function MovePlayer() {
    useFrame(({ clock }) => {
      if (playerRef.current) {
        const time = clock.getElapsedTime();
        const x = Math.sin(time) * 2.5;
        const z = Math.sin(time * 2) * 1.25;
        playerRef.current.setTranslation({ x, y: 0, z }, true);
      }
    });

    return null;
  }

  return (
    <>
      <group position={new THREE.Vector3(2.5, 0, 0)}>
        <RigidBody
          ref={playerRef}
          enabledTranslations={[true, false, true]}
          enabledRotations={[false, false, false]}
          rotation={[0, degToRad(90), 0]}
        >
          <group name="PlayerBody">
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Cylinder.geometry}
              material={nodes.Cylinder.material}
              material-color={"red"}
              position={[0, 0.903, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Icosphere.geometry}
              material-color={"red"}
              material={nodes.Icosphere.material}
              position={[0, 2.567, 0]}
              scale={0.535}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Cube004.geometry}
              material={nodes.Cube004.material}
              material-color={"red"}
              position={[0.283, -0.285, -0.053]}
              rotation={[0, -0.11, 0]}
              scale={[0.027, 0.032, 0.242]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Cube003.geometry}
              material={nodes.Cube003.material}
              position={[-0.278, -0.285, -0.053]}
              material-color={"red"}
              rotation={[0, 0.187, 0]}
              scale={[0.027, 0.032, 0.242]}
            />
          </group>
        </RigidBody>
        <MovePlayer />
      </group>
    </>
  );
}

useGLTF.preload("/player.glb");

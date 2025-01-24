import * as THREE from "three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Cube005: THREE.Mesh;
    Cube006: THREE.Mesh;
    Cube007: THREE.Mesh;
  };
  materials: {};
};

export function Stick(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { nodes } = useGLTF("/stick.glb") as GLTFResult;
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Cube005"
          castShadow
          receiveShadow
          geometry={nodes.Cube005.geometry}
          material={nodes.Cube005.material}
          position={[-0.03, -12, 0.096]}
        />
        <mesh
          name="Cube006"
          castShadow
          receiveShadow
          geometry={nodes.Cube006.geometry}
          material={nodes.Cube006.material}
          position={[0.081, -12, -0.418]}
          rotation={[-Math.PI, 0.5, -Math.PI]}
        />
        <mesh
          name="Cube007"
          castShadow
          receiveShadow
          geometry={nodes.Cube007.geometry}
          material={nodes.Cube007.material}
          position={[0, -12, 0]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/stick.glb");

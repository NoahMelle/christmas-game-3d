import * as THREE from "three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Cube010: THREE.Mesh;
  };
  materials: {
    ["Material.002"]: THREE.MeshStandardMaterial;
  };
};

export function Crowder(
  props: JSX.IntrinsicElements["group"] & {
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
  }
) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF("/crowder.glb") as GLTFResult;

  // Ensure geometry is centered and pivot is at the object's local origin
  const centeredGeometry = nodes.Cube010.geometry.clone();
  centeredGeometry.center();

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Cube010"
          castShadow
          receiveShadow
          material={materials["Material.002"]}
          material-color={props.color}
          geometry={centeredGeometry}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/crowder.glb");

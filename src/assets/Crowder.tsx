import * as THREE from "three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
    nodes: {
        Cube010: THREE.Mesh;
    };
    materials: {
        ["Material.002"]: THREE.MeshStandardMaterial;
    };
};

// Generate random color function
const randomColor = () => {
    const letters = "89ABCDEF";
    let color = "#";
    for (let i = 0; i < 3; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
};

export function Crowder(
    props: JSX.IntrinsicElements["group"] & {
        position: [number, number, number];
        rotation: [number, number, number];
    }
) {
    const group = useRef<THREE.Group>(null);
    const { nodes } = useGLTF("/crowder.glb") as GLTFResult;
    const color = useRef(randomColor());
    const bobbingRef = useRef<THREE.Group>(null);

    const randomSineOffset = Math.random() * Math.PI * 2;

    useFrame((_, dt) => {
        if (!bobbingRef.current) {
            return;
        }

        bobbingRef.current.position.y =
            (Math.sin(randomSineOffset + performance.now() / 400) + 1) * 0.1;
    });

    // Ensure geometry is centered and pivot is at the object's local origin
    const centeredGeometry = nodes.Cube010.geometry.clone();
    centeredGeometry.center();

    const material = new THREE.MeshStandardMaterial({ color: color.current });

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene" ref={bobbingRef}>
                <mesh
                    name="Cube010"
                    castShadow
                    receiveShadow
                    geometry={centeredGeometry}
                    material={material}
                />
            </group>
        </group>
    );
}

useGLTF.preload("/crowder.glb");

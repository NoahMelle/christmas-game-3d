import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

export const getDimensionsFromGLTF = (
    gltf: GLTF
): { width: number; height: number; depth: number } => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());

    return {
        width: size.x,
        depth: size.z,
        height: size.y,
    };
};

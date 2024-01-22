import { MutableRefObject, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function raycaster() {
    const { raycaster, scene } = useThree();
    const dir = new THREE.Vector3(0, 0, -1).normalize();
    const lines = scene.children[0];

    return (pos: THREE.Vector3) => {
        raycaster.set(pos, dir);
        return raycaster.intersectObject(lines)
    }
}

function update(
    mesh: MutableRefObject<THREE.Group>,
    lMesh: MutableRefObject<THREE.Mesh>,
    rMesh: MutableRefObject<THREE.Mesh>,
    lMat: MutableRefObject<THREE.MeshBasicMaterial>,
    rMat: MutableRefObject<THREE.MeshBasicMaterial>
) {
    const raycast = raycaster()

    return () => {
        const angle = mesh.current.rotation.z;
        const vector = new THREE.Vector3(
            -Math.sin(angle) * 0.04,
            Math.cos(angle) * 0.04,
            0
        );
        mesh.current.position.add(vector);

        let left = new THREE.Vector3();
        lMesh.current.getWorldPosition(left);

        if (raycast(left).length > 0) {
            mesh.current.rotation.z += 0.05;
            lMat.current.color = new THREE.Color("yellow");
        } else {
            lMat.current.color = new THREE.Color("red");
        }

        let right = new THREE.Vector3();
        rMesh.current.getWorldPosition(right);

        if (raycast(right).length > 0) {
            mesh.current.rotation.z -= 0.05;
            rMat.current.color = new THREE.Color("blue");
        } else {
            rMat.current.color = new THREE.Color("red");
        }
    };
}

function Robot() {
    const mesh = useRef<THREE.Group>(null!);

    const lMesh = useRef<THREE.Mesh>(null!);
    const lMat = useRef<THREE.MeshBasicMaterial>(null!);

    const rMesh = useRef<THREE.Mesh>(null!);
    const rMat = useRef<THREE.MeshBasicMaterial>(null!);

    useFrame(update(mesh, lMesh, rMesh, lMat, rMat));

    return (
        <group position={[-10, -5, 0]} rotation={[0, 0, 0]} ref={mesh}>
            <mesh position={[0, 0, 0]} ref={lMesh}>
                <planeGeometry args={[3, 3]} />
                <meshBasicMaterial ref={lMat} color={"black"} />
            </mesh>
            <mesh position={[2, 1, 0]} ref={rMesh}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial ref={rMat} color={"black"} />
            </mesh>
            <mesh position={[-2, 1, 0]} ref={lMesh}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial ref={lMat} color={"black"} />
            </mesh>
        </group>
    );
}

export default Robot;

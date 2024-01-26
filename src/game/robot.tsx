import { MutableRefObject, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function raycaster(course: MutableRefObject<THREE.Mesh>) {
    const { raycaster } = useThree();
    const dir = new THREE.Vector3(0, 0, -1).normalize();
    const lines = course.current;

    return (pos: THREE.Vector3) => {
        raycaster.set(pos, dir);
        return raycaster.intersectObject(lines);
    };
}

function move(robot: MutableRefObject<THREE.Group>, speed: number) {
    const angle = robot.current.rotation.z;
    const vector = new THREE.Vector3(
        -Math.sin(angle) * speed,
        Math.cos(angle) * speed,
        0
    );
    robot.current.position.add(vector);
}

export type Update = (left: boolean, right: boolean) => [number, number];

type RobotProps = { map: MutableRefObject<THREE.Mesh>; update: Update };

function Robot({ map, update }: RobotProps) {
    const mesh = useRef<THREE.Group>(null!);

    const lMesh = useRef<THREE.Mesh>(null!);
    const lMat = useRef<THREE.MeshBasicMaterial>(null!);

    const rMesh = useRef<THREE.Mesh>(null!);
    const rMat = useRef<THREE.MeshBasicMaterial>(null!);

    const raycast = raycaster(map);
    useFrame(() => {
        let left = new THREE.Vector3();
        let right = new THREE.Vector3();

        lMesh.current.getWorldPosition(left);
        rMesh.current.getWorldPosition(right);

        let lSensor = raycast(left).length > 0;
        let rSensor = raycast(right).length > 0;

        lMat.current.color = lSensor
            ? new THREE.Color("yellow")
            : new THREE.Color("red");
        rMat.current.color = rSensor
            ? new THREE.Color("blue")
            : new THREE.Color("red");

        let [speed, rotation] = update(lSensor, rSensor);
        mesh.current.rotation.z += rotation;
        if (speed != 0) {
            move(mesh, speed);
        }
    });

    return (
        <group position={[-10, -5, 0.1]} rotation={[0, 0, 0]} ref={mesh}>
            <mesh position={[0, 0, 0]} ref={lMesh}>
                <planeGeometry args={[3, 3]} />
                <meshBasicMaterial ref={lMat} color={"black"} />
            </mesh>
            <mesh position={[1, 1, 0]} ref={rMesh}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial ref={rMat} color={"white"} />
            </mesh>
            <mesh position={[-1, 1, 0]} ref={lMesh}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial ref={lMat} color={"white"} />
            </mesh>
        </group>
    );
}

export default Robot;

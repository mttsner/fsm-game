import { MutableRefObject, useEffect, useRef } from "react";
import {
    RootState,
    Vector3,
    Euler,
    useFrame,
    useThree,
} from "@react-three/fiber";
import * as THREE from "three";

function raycaster(course: MutableRefObject<THREE.Object3D>) {
    const { raycaster } = useThree();
    const dir = new THREE.Vector3(0, 0, -1).normalize();
    const lines = course.current;

    return (pos: THREE.Vector3) => {
        raycaster.set(pos, dir);
        return raycaster.intersectObject(lines);
    };
}

function move(
    position: THREE.Vector3,
    rotation: THREE.Quaternion,
    distance: number
) {
    const direction = new THREE.Vector3(0, 1, 0);
    direction.applyQuaternion(rotation);
    direction.multiplyScalar(distance);
    position.add(direction);
}

function rotate(rotation: THREE.Quaternion, angle: number) {
    const dir = new THREE.Quaternion();
    dir.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    rotation.multiply(dir);
}

export type Update = (left: boolean, right: boolean) => [number, number];

type RobotProps = {
    map: MutableRefObject<THREE.Object3D>;
    update: Update;
    position?: Vector3;
    rotation?: Euler;
};

function Robot({ map, update, position = [0, 0, 0.1], rotation }: RobotProps) {
    const mesh = useRef<THREE.Group>(null!);
    const lMesh = useRef<THREE.Mesh>(null!);
    const lMat = useRef<THREE.MeshBasicMaterial>(null!);

    const rMesh = useRef<THREE.Mesh>(null!);
    const rMat = useRef<THREE.MeshBasicMaterial>(null!);

    var lastpos = useRef<THREE.Vector3>(null!);
    var lastrot = useRef<THREE.Quaternion>(null!);

    var currentpos = useRef<THREE.Vector3>(null!);
    var currentrot = useRef<THREE.Quaternion>(null!);

    const internalOnFrame = (alpha: number) => {
        // Interpolate between positions from the physics system
        const pos = lastpos.current.clone().lerp(currentpos.current, alpha);
        const rot = lastrot.current.clone().slerp(currentrot.current, alpha);
        // Update position on canvas
        mesh.current.position.copy(pos);
        mesh.current.quaternion.copy(rot);
    };
    const raycast = raycaster(map);
    const internalOnTick = () => {
        // We actually don't need to look up the current.position every time
        // because it stays constant, since the mesh is positioned within the
        // parent groups local space
        let left = lMesh.current.position
            .clone()
            .applyQuaternion(currentrot.current)
            .add(currentpos.current);

        let right = rMesh.current.position
            .clone()
            .applyQuaternion(currentrot.current)
            .add(currentpos.current);
        // Raycast below both robot sensor to detect the path
        let lSensor = raycast(left).length > 0;
        let rSensor = raycast(right).length > 0;
        // Update sensor colors to indicate path detection
        lMat.current.color = lSensor
            ? new THREE.Color("yellow")
            : new THREE.Color("red");
        rMat.current.color = rSensor
            ? new THREE.Color("blue")
            : new THREE.Color("red");
        // Ask external code for how to update the robots position
        let [speed, angle] = update(lSensor, rSensor);
        // Save the current robot position and rotation as the last state
        lastrot.current.copy(currentrot.current);
        lastpos.current.copy(currentpos.current);
        // Update the current robot rotation and position
        rotate(currentrot.current, angle);
        move(currentpos.current, currentrot.current, speed);
    };

    const tps = 1 / 30; // Ticks per second
    let lag = useRef(0.0); // Avoid stale closure

    const onFrame = (_: RootState, delta: number) => {
        lag.current += delta;
        let count = 0;

        while (lag.current >= tps) {
            if (count > 10) {
                // Prevent infinite loop from crashing the system
                throw new Error("Too many physics iterations in one frame");
            }
            internalOnTick();
            lag.current -= tps;
            count++;
        }

        let alpha = lag.current / tps; // Linear interpolation value (should be betwee 0 and 1)
        internalOnFrame(alpha);
    };

    // Start game loop when component has been rendered
    useEffect(() => {
        lastpos.current = mesh.current.position.clone();
        currentpos.current = lastpos.current.clone();

        lastrot.current = mesh.current.quaternion.clone();
        currentrot.current = lastrot.current.clone();
    }, []);
    // Is this racy?
    useFrame(onFrame);
    return (
        <group position={position} rotation={rotation} ref={mesh}>
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

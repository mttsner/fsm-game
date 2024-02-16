import { MutableRefObject, useEffect, useRef } from "react";
import {
    Vector3,
    Euler,
    useFrame,
    useThree,
    ObjectMap,
} from "@react-three/fiber";
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

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
    tps: MutableRefObject<number>;
    object: GLTF & ObjectMap;
    map: MutableRefObject<THREE.Object3D>;
    update: Update;
    position?: Vector3;
    rotation?: Euler;

    onFrame?: Function;
    onTick?: Function;
};

function Robot({
    map,
    update,
    position = [0, 0, 0.1],
    rotation,
    object,
    tps,
    onFrame,
    onTick,
}: RobotProps) {
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
            ? new THREE.Color("red")
            : new THREE.Color("gray");
        rMat.current.color = rSensor
            ? new THREE.Color("green")
            : new THREE.Color("gray");
        // Ask external code for how to update the robots position
        let [speed, angle] = update(lSensor, rSensor);
        // Save the current robot position and rotation as the last state
        lastrot.current.copy(currentrot.current);
        lastpos.current.copy(currentpos.current);
        // Update the current robot rotation and position
        rotate(currentrot.current, angle);
        move(currentpos.current, currentrot.current, speed);
    };

    // Start game loop when component has been rendered
    useEffect(() => {
        lastpos.current = mesh.current.position.clone();
        currentpos.current = lastpos.current.clone();

        lastrot.current = mesh.current.quaternion.clone();
        currentrot.current = lastrot.current.clone();
    }, []);

    let lag = useRef(0.0); // Avoid stale closure
    // Is this racy?
    useFrame((_, delta) => {
        if (tps.current == 0) return;
        if (delta > 1 / 30) {
            delta = 1 / 30;
        }
        lag.current += delta;
        let count = 0;
        let t = 1 / tps.current;

        while (lag.current >= t) {
            if (count > 10) {
                // Prevent infinite loop from crashing the system
                throw new Error("Too many physics iterations in one frame");
            }
            internalOnTick();
            if (onTick) {
                onTick();
            }
            lag.current -= t;
            count++;
        }

        let alpha = lag.current / t; // Linear interpolation value (should be betwee 0 and 1)
        internalOnFrame(alpha);
        if (onFrame) {
            onFrame();
        }
    });

    return (
        <group position={position} rotation={rotation} ref={mesh}>
            <primitive
                object={object.scene}
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, Math.PI, 0]}
                scale={1}
            />
            <mesh scale={0} position={[0, 0, 0]} ref={lMesh}>
                <planeGeometry args={[3, 3]} />
                <meshBasicMaterial ref={lMat} color={"black"} />
            </mesh>
            <mesh scale={1} position={[0.9, 1.95, 5]} ref={rMesh}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshBasicMaterial ref={rMat} color={"white"} />
            </mesh>
            <mesh scale={1} position={[-0.9, 1.95, 5]} ref={lMesh}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshBasicMaterial ref={lMat} color={"white"} />
            </mesh>
        </group>
    );
}

export default Robot;

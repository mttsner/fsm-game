import { MutableRefObject, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fsm, node } from "./fsm";

function raycaster(course: MutableRefObject<THREE.Mesh> ) {
    const { raycaster, scene } = useThree();
    const dir = new THREE.Vector3(0, 0, -1).normalize();
    const lines = course.current
    console.log(scene);
    return (pos: THREE.Vector3) => {
        raycaster.set(pos, dir);
        return raycaster.intersectObject(lines);
    };
}

function move(robot: MutableRefObject<THREE.Group>) {
    const angle = robot.current.rotation.z;
    const vector = new THREE.Vector3(
        -Math.sin(angle) * 0.04,
        Math.cos(angle) * 0.04,
        0
    );
    robot.current.position.add(vector);
}

function driveForward(
    robot: MutableRefObject<THREE.Group>,
    lSensor: MutableRefObject<THREE.MeshBasicMaterial>,
    rSensor: MutableRefObject<THREE.MeshBasicMaterial>
) {
    lSensor.current.color = new THREE.Color("red");
    rSensor.current.color = new THREE.Color("red");
    move(robot);
}

function turnLeft(
    robot: MutableRefObject<THREE.Group>,
    sensor: MutableRefObject<THREE.MeshBasicMaterial>
) {
    robot.current.rotation.z -= 0.05;
    sensor.current.color = new THREE.Color("yellow");
    //move(robot);
}

function turnRight(
    robot: MutableRefObject<THREE.Group>,
    sensor: MutableRefObject<THREE.MeshBasicMaterial>
) {
    robot.current.rotation.z += 0.05;
    sensor.current.color = new THREE.Color("blue");
    //move(robot);
}

type RobotProps = { map: MutableRefObject<THREE.Mesh> };

function Robot({ map }: RobotProps) {
    const mesh = useRef<THREE.Group>(null!);

    const lMesh = useRef<THREE.Mesh>(null!);
    const lMat = useRef<THREE.MeshBasicMaterial>(null!);

    const rMesh = useRef<THREE.Mesh>(null!);
    const rMat = useRef<THREE.MeshBasicMaterial>(null!);

    const fwd = new node(() => driveForward(mesh, lMat, rMat));
    fwd.name = "Forward";
    const left = new node(() => turnLeft(mesh, rMat));
    left.name = "Left";
    const right = new node(() => turnRight(mesh, lMat));
    right.name = "Right";

    fwd.newEdge(left, (l, r) => !l && r);
    fwd.newEdge(right, (l, r) => l && !r);

    left.newEdge(fwd, (l, r) => (l && r) || (!l && !r));
    left.newEdge(right, (l, r) => l && !r);

    right.newEdge(fwd, (l, r) => (l && r) || (!l && !r));
    right.newEdge(left, (l, r) => !l && r);

    let game = new fsm(fwd, left, right);

    const raycast = raycaster(map);
    useFrame(() => {
        let left = new THREE.Vector3();
        let right = new THREE.Vector3();

        lMesh.current.getWorldPosition(left);
        rMesh.current.getWorldPosition(right);

        game.update(raycast(left).length > 0, raycast(right).length > 0);
        console.log(game.currentState.name);
    });

    //useFrame(update(mesh, lMesh, rMesh, lMat, rMat));

    return (
        <group position={[-10, -5, 0]} rotation={[0, 0, 0]} ref={mesh}>
            <mesh position={[0, 0, 0]} ref={lMesh}>
                <planeGeometry args={[3, 3]} />
                <meshBasicMaterial ref={lMat} color={"black"} />
            </mesh>
            <mesh position={[1, 1, 0]} ref={rMesh}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial ref={rMat} color={"black"} />
            </mesh>
            <mesh position={[-1, 1, 0]} ref={lMesh}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial ref={lMat} color={"black"} />
            </mesh>
        </group>
    );
}

export default Robot;

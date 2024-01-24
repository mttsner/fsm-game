import { Canvas } from "@react-three/fiber";
import {
    Line,
    MapControls,
    OrthographicCamera,
    useHelper,
} from "@react-three/drei";
import Robot from "./robot";
import { forwardRef, useRef } from "react";
import * as THREE from "three";

const Camera = () => {
    const camera = useRef<THREE.OrthographicCamera>(null!);
    useHelper(camera, THREE.CameraHelper);
    return (
        <OrthographicCamera
            manual
            left={-12}
            right={12}
            top={12}
            bottom={-12}
            far={1}
            ref={camera}
            position={[0, 0, 1]}
            scale={[1, 1, 1]}
        />
    );
};

const Map = forwardRef<THREE.Mesh>((_, ref) => {
    const leftup = new THREE.Vector3(-10, 10, 0)
    const leftbottom = new THREE.Vector3(-10, -10, 0)
    const rightup = new THREE.Vector3(10, 10, 0)
    const rightbottom = new THREE.Vector3(10, -10, 0)

    const width = 0.5

    // Hardcoded because its the easiest way for testing
    const vertices = [
        // Left
        leftup.clone().add(new THREE.Vector3(width, -width, 0)),
        leftup,
        leftbottom,

        leftup.clone().add(new THREE.Vector3(width, -width, 0)),
        leftbottom,
        leftbottom.clone().add(new THREE.Vector3(width, width, 0)),
        
        // Top
        leftup,
        leftup.clone().add(new THREE.Vector3(width, -width, 0)),
        rightup,

        leftup.clone().add(new THREE.Vector3(width, -width, 0)),
        rightup.clone().add(new THREE.Vector3(-width, -width, 0)),
        rightup,

        // Right
        rightup,
        rightup.clone().add(new THREE.Vector3(-width, -width, 0)),
        rightbottom,

        rightup.clone().add(new THREE.Vector3(-width, -width, 0)),
        rightbottom.clone().add(new THREE.Vector3(-width, width, 0)),
        rightbottom,

        // Bottom
        rightbottom,
        rightbottom.clone().add(new THREE.Vector3(-width, width, 0)),
        leftbottom,

        leftbottom,
        rightbottom.clone().add(new THREE.Vector3(-width, width, 0)),
        leftbottom.clone().add(new THREE.Vector3(width, width, 0)),

    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const material = new THREE.MeshBasicMaterial({ color: "red" });

    return <mesh ref={ref} geometry={geometry} material={material} />;
})

function Game() {
    const mapRef = useRef(null!)

    return (
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 10 }}>
            <color attach="background" args={[243, 243, 243]} />
            <MapControls screenSpacePanning />
            <Map ref={mapRef} />
            <gridHelper args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} />
            <Robot map={mapRef}/>
        </Canvas>
    );
}

export default Game;

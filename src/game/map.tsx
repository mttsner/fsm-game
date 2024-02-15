import { Canvas, useLoader } from "@react-three/fiber";
import {
    MapControls,
    OrthographicCamera,
    Stats,
    useHelper,
} from "@react-three/drei";
import Robot, { Update } from "./robot";
import { MutableRefObject, forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGResult } from "three-stdlib";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Controls } from "./controls";
import { useTheme } from "@/components/theme";

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

type SvgProps = {
    src: SVGResult;
};

const Svg = forwardRef<THREE.Group, SvgProps>(({ src }, ref) => {
    const matRef = useRef(new THREE.MeshBasicMaterial({ color: "black" }));
    const theme = useTheme();
    const root = document.documentElement;

    useEffect(() => {
        const color = getComputedStyle(root).getPropertyValue('--foreground');
        matRef.current.color.set(`hsl(${color.replaceAll(" ", ",")})`);
    }, [theme]);

    return (
        <group ref={ref}>
            {src.paths.map((path) =>
                path.subPaths.map((sub) => {
                    // sub.arcLengthDivisions can be used to make svg curves smoother
                    const style = SVGLoader.getStrokeStyle(
                        path.userData?.style?.strokeWidth
                    );

                    const geometry = SVGLoader.pointsToStroke(
                        sub.getPoints(),
                        style
                    );

                    return (
                        <mesh
                            key={geometry.uuid}
                            geometry={geometry}
                            material={matRef.current}
                        />
                    );
                })
            )}
        </group>
    );
});

const Map = forwardRef<THREE.Mesh>((_, ref) => {
    const leftup = new THREE.Vector3(-10, 10, 0);
    const leftbottom = new THREE.Vector3(-10, -10, 0);
    const rightup = new THREE.Vector3(10, 10, 0);
    const rightbottom = new THREE.Vector3(10, -10, 0);

    const width = 0.5;

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
});

export type GameProps = {
    update: Update;

    onFrame?: Function;
    onTick?: Function;
    tpsRef: MutableRefObject<number>;
};

function Game({ update, onFrame, tpsRef }: GameProps) {
    const mapRef = useRef<THREE.Group>(null!);
    const result = useLoader(SVGLoader, "./map8.svg");
    const robot = useLoader(GLTFLoader, "./robot.glb");
    const debug = false;

    return (
            <Canvas
                orthographic
                camera={{ position: [0, 0, 10], zoom: 20, up: [0, 0, 1] }}
                resize={{ debounce: 1 }}
            >
                {debug && <Stats showPanel={0} className="stats" />}
                <MapControls zoomToCursor zoomSpeed={.5} maxZoom={30} minZoom={6} enableRotate={false}/>
                <ambientLight intensity={5} />
                {debug && (
                    <gridHelper
                        args={[20, 20]}
                        rotation={[Math.PI / 2, 0, 0]}
                    />
                )}
                <Svg ref={mapRef} src={result} />
                <Robot
                    tps={tpsRef}
                    object={robot}
                    position={[-10, -8, 0.1]}
                    map={mapRef}
                    update={update}
                    onFrame={onFrame}
                />
            </Canvas>
    );
}
//
export default Game;

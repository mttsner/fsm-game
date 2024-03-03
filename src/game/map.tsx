import { Canvas, Vector3, useLoader } from "@react-three/fiber";
import {
    MapControls,
    Stats,
} from "@react-three/drei";
import Robot, { Update } from "./robot";
import { MutableRefObject, forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGResult } from "three-stdlib";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useTheme } from "@/components/theme";

type SvgProps = {
    src: SVGResult;
    position: Vector3,
};

const Svg = forwardRef<THREE.Group, SvgProps>(({ src, position }, ref) => {
    const matRef = useRef(new THREE.MeshBasicMaterial({ color: "black" }));
    const theme = useTheme();
    const root = document.documentElement;

    useEffect(() => {
        const color = getComputedStyle(root).getPropertyValue("--foreground");
        matRef.current.color.set(`hsl(${color.replaceAll(" ", ",")})`);
    }, [theme]);

    return (
        <group ref={ref} position={position}>
            {src.paths.map((path) =>
                path.subPaths.map((sub) => {
                    // sub.arcLengthDivisions can be used to make svg curves smoother
                    const style = SVGLoader.getStrokeStyle(
                        path.userData?.style?.strokeWidth
                    );

                    const geometry = SVGLoader.pointsToStroke(
                        sub.getPoints(),
                        style,
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

export type GameProps = {
    update: Update;

    onFrame?: Function;
    onTick?: Function;
    tpsRef: MutableRefObject<number>;
};

function Game({ update, onFrame, tpsRef }: GameProps) {
    const mapRef = useRef<THREE.Group>(null!);
    const result = useLoader(SVGLoader, "./course.svg");
    const robot = useLoader(GLTFLoader, "./robot.glb");
    const debug = false;

    return (
        <Canvas
            orthographic
            camera={{ position: [0, 0, 10], zoom: 9, up: [0, 0, 1]}}
            resize={{ debounce: 1 }}
        >
            {debug && <Stats showPanel={0} className="stats" />}
            <MapControls
                zoomToCursor
                zoomSpeed={0.5}
                maxZoom={30}
                minZoom={6}
                enableRotate={false}
            />
            <ambientLight intensity={5} />
            {debug && (
                <gridHelper args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} />
            )}
            <Svg ref={mapRef} src={result} position={[-26,-20,0]}/>
            <Robot
                tps={tpsRef}
                object={robot}
                position={[-22, -8, 0.1]}
                map={mapRef}
                update={update}
                onFrame={onFrame}
            />
        </Canvas>
    );
}
//
export default Game;

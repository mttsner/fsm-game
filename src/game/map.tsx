import { Canvas } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import Robot from './robot'

function Game() {
    const points: [number, number, number][] = [
        [-10, 10, 0],
        [10, 10, 0],
        [10, -10, 0],
        [-10, -10, 0],
        [-10, 10, 0],
    ];

    return (
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 10 }}>
            <color attach="background" args={[243, 243, 243]} />
            <Line points={points} lineWidth={10} />
            <Robot/>
        </Canvas>
    );
}

export default Game;

import { Suspense, useRef } from "react";
import { State, Transition } from "./game/fsm.ts";

import "reactflow/dist/style.css";
import "./style.css";
import Game from "./game/map.tsx";
import Graph, { GraphHandle } from "./graph/Graph.tsx";
import NodePicker from "./graph/Sidebar.tsx";

const initialNodes: State[] = [
    {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
            label: "Forward",
            activated: false,
            transitions: [],
            update: () => {
                return [0.1, 0];
            },
        },
    },
    {
        id: "2",
        type: "custom",
        position: { x: 250, y: 320 },
        data: {
            label: "Left",
            activated: false,
            transitions: [],
            update: () => {
                return [0, 0];
            },
        },
    },
    {
        id: "3",
        type: "custom",
        position: { x: 40, y: 300 },
        data: {
            label: "Right",
            activated: false,
            transitions: [],
            update: () => {
                return [0, -0.05];
            },
        },
    },
    {
        id: "4",
        type: "custom",
        position: { x: 300, y: 0 },
        data: {
            label: "Still",
            activated: false,
            transitions: [],
            update: () => {
                return [0, 0];
            },
        },
    },
];

const initialEdges: Transition[] = [
    {
        id: "1-3",
        source: "1",
        target: "3",
        data: {
            left: false,
            right: true,
        },
    },
    {
        id: "3-4",
        source: "3",
        target: "4",
        data: {
            left: false,
            right: false,
        },
    },
    {
        id: "4-1",
        source: "4",
        target: "1",
        data: {
            left: false,
            right: false,
        },
    },
];

const App = () => {
    const updateRef = useRef<GraphHandle>(null!);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div style={{ width: "50%", height: "80vh", float: "left" }}>
                <Graph
                    ref={updateRef}
                    initialNodes={initialNodes}
                    initialEdges={initialEdges}
                />
            </div>
            <div style={{ width: "50%", height: "80vh", float: "left" }}>
                <Suspense>
                    <Game
                        update={(...args) => updateRef.current.update(...args)}
                        onFrame={() => updateRef.current.onFrame()}
                    />
                </Suspense>
            </div>
            <div
                style={{
                    width: "100%",
                    height: "20vh",
                    top: "80vh",
                    position: "absolute",
                    display: "flex",
                }}
            >
                <NodePicker />
            </div>
        </div>
    );
};

export default App;

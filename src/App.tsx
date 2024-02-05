import { Suspense, useRef } from "react";

import "reactflow/dist/style.css";
import "./style.css";
import Game from "./game/map.tsx";
import Graph, { GraphHandle } from "./graph/Graph.tsx";
import NodePicker from "./graph/Sidebar.tsx";
import { Edge, Node } from "reactflow";
import { EdgeData, NodeData } from "./graph/nodes/Node.tsx";

const initialNodes: Node<NodeData>[] = [
    {
        id: "1",
        type: "move",
        position: { x: 0, y: 0 },
        data: {
            label: "Forward",
            move: 0.1,
            turn: 0,
        },
    },
    {
        id: "2",
        type: "move",
        position: { x: 250, y: 320 },
        data: {
            label: "Left",
            move: 0,
            turn: -0.05,
        },
    },
    {
        id: "3",
        type: "move",
        position: { x: 40, y: 300 },
        data: {
            label: "Right",
            move: 0,
            turn: -0.05,
        },
    },
    {
        id: "4",
        type: "move",
        position: { x: 300, y: 0 },
        data: {
            label: "Still",
            move: 0,
            turn: 0,
        },
    },
    {
        id: "5",
        type: "count",
        position: { x: 50, y: 50 },
        data: {
            count: 0,
            move: 0,
            turn: 0,
        }
    }
];

const initialEdges: Edge<EdgeData>[] = [
    {
        id: "1-3",
        type: "move",
        source: "1",
        target: "3",
        data: {
            left: false,
            right: true,
        },
    },
    {
        id: "3-4",
        type: "move",
        source: "3",
        target: "4",
        data: {
            left: false,
            right: false,
        },
    },
    {
        id: "4-1",
        type: "move",
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

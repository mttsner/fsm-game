import { useCallback, useState } from "react";
import { State, Transition } from "./game/fsm.ts";

import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
    Connection,
} from "reactflow";

import CustomNode from "./CustomNode.tsx";
import FloatingEdge from "./FloatingEdge.tsx";
import CustomConnectionLine from "./CustomConnectionLine.tsx";

import "reactflow/dist/style.css";
import "./style.css";
import Game from "./game/map.tsx";

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
                return [0.04, 0];
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

const connectionLineStyle = {
    strokeWidth: 3,
    stroke: "white",
};

const nodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    floating: FloatingEdge,
};

const defaultEdgeOptions = {
    style: { strokeWidth: 3, stroke: "white" },
    type: "floating",
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "white",
    },
};


function game(nodes: State[], edges: Transition[]) {
    let [currentState, setState] = useState(nodes[0])

    const update = (left: boolean, right: boolean) => {
        let edge = edges.find(
            (edge) =>
                edge.source === currentState.id &&
                edge.data?.left == left &&
                edge.data?.right == right
        );

        if (edge === undefined) {
            console.log(currentState.data.label)
            return currentState.data.update(left, right);
        }

        let state = nodes.find((state) => state.id === edge?.target);

        if (state !== undefined) {
            setState(state)
        }
        console.log(currentState.data.label)
        return currentState.data.update(left, right);
    }
    return {currentState, update}
}

const App = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => {
            if (!params.source || !params.target) {
                return
            }
            const edge: Transition = {
                id: `${params.source}-${params.target}`,
                source: params.source,
                target: params.target,
                data: {
                    left: false,
                    right: false,
                },
              };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );

    const {currentState, update} = game(nodes, edges)

    return (
        <>
            <div style={{ width: "100vw", height: "100vh" }}>
                <div style={{ width: "50%", height: "80vh", float: "left" }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        defaultEdgeOptions={defaultEdgeOptions}
                        connectionLineComponent={CustomConnectionLine}
                        connectionLineStyle={connectionLineStyle}
                        connectionRadius={100}
                    />
                </div>
                <div style={{ width: "50%", height: "80vh", float: "left" }}>
                    <Game
                        update={(left, right) => {
                            setNodes((nodes) =>
                                nodes.map((node) => {
                                    node.data = {
                                        ...node.data,
                                        activated:
                                            node.id == currentState.id,
                                    };
                                    return node;
                                })
                            );
                            return update(left, right);
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default App;

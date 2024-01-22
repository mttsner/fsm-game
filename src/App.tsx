import React, { useCallback } from "react";

import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "reactflow";

import CustomNode from "./CustomNode.tsx";
import FloatingEdge from "./FloatingEdge.tsx";
import CustomConnectionLine from "./CustomConnectionLine.tsx";

import "reactflow/dist/style.css";
import "./style.css";
import Controller from "./Controller.tsx";
import Game from "./game/map.tsx";

const initialNodes = [
    {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
    },
    {
        id: "2",
        type: "custom",
        position: { x: 250, y: 320 },
    },
    {
        id: "3",
        type: "custom",
        position: { x: 40, y: 300 },
    },
    {
        id: "4",
        type: "custom",
        position: { x: 300, y: 0 },
    },
];

const initialEdges = [];

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

const EasyConnectExample = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );
    return (
        <>
            <Controller labelX={50} labelY={0} />
            <div style={{width: "100vw", height: "100vh"}}>
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
                <div style={{width: "50%", height: "80vh", float: "left"}}>
                    <Game/>
                </div>
            </div>
        </>
    );
};

export default EasyConnectExample;

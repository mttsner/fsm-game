import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { State, Transition } from "../game/fsm.ts";

import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
    Connection,
    Edge,
    Node,
} from "reactflow";

import CustomNode from "./CustomNode.tsx";
import FloatingEdge from "./FloatingEdge.tsx";
import CustomConnectionLine from "./CustomConnectionLine.tsx";

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

const proOptions = { hideAttribution: true };

function game(nodes: State[], edges: Transition[]) {
    let currentState = useRef(nodes[0]);

    const update = (left: boolean, right: boolean) => {
        let edge = edges.find(
            (edge) =>
                edge.source === currentState.current.id &&
                edge.data?.left == left &&
                edge.data?.right == right
        );

        if (edge === undefined) {
            return currentState.current.data.update(left, right);
        }

        let state = nodes.find((state) => state.id === edge?.target);

        if (state !== undefined) {
            currentState.current = state;
        }

        return currentState.current.data.update(left, right);
    };
    return { currentState, update };
}

export type GraphHandle = {
    update: (left: boolean, right: boolean) => [number, number];
};

export type GraphProps = {
    initialNodes: Node[]
    initialEdges: Edge[]
}

const Graph = forwardRef<GraphHandle, GraphProps>(({initialNodes, initialEdges} ,ref) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const { currentState, update } = game(nodes, edges);

    useImperativeHandle(ref, () => ({
        update: (left: boolean, right: boolean) => {
            setNodes((nodes) =>
                nodes.map((node) => {
                    node.data = {
                        ...node.data,
                        activated:
                            node.id == currentState.current.id,
                    };
                    return node;
                })
            );
            return update(left, right);
        }
    }))

    const onConnect = useCallback(
        (params: Connection) => {
            if (!params.source || !params.target) {
                return;
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

    return (
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
            
            proOptions={proOptions}
        />
    );
});

export default Graph
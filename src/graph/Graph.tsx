import {
    DragEvent,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { State, Transition } from "../game/fsm.ts";

import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
    Connection,
    Edge,
    Node,
    ReactFlowInstance,
    XYPosition,
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

const createNode = (position: XYPosition, type: string, id: string) => {
    const node: State = {
        id: id,
        type: "custom",
        position,
        data: {
            label: "",
            activated: false,
            transitions: [],
            update: () => [0, 0],
        },
    };

    switch (type) {
        case "forward":
            node.data.label = "Forward";
            node.data.update = () => {
                return [0.1, 0];
            };
            break;
        case "still":
            node.data.label = "Still";
            break;
        case "left":
            node.data.label = "Left";
            node.data.update = () => {
                return [0, 0.05];
            };
            break;
        case "right":
            node.data.label = "Right";
            node.data.update = () => {
                return [0, -0.05];
            };
            break;
        default:
            throw new Error("Invalid node type");
    }
    return node;
};

export type GraphHandle = {
    update: (left: boolean, right: boolean) => [number, number];
    onFrame: Function;
};

export type GraphProps = {
    initialNodes: Node[];
    initialEdges: Edge[];
};

const Graph = forwardRef<GraphHandle, GraphProps>(
    ({ initialNodes, initialEdges }, ref) => {
        const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
        const [reactFlowInstance, setReactFlowInstance] =
            useState<ReactFlowInstance>(null!);

        let count = initialNodes.length + 1;
        const getId = () => `${count++}`;

        const { currentState, update } = game(nodes, edges);

        useImperativeHandle(ref, () => ({
            update: (left: boolean, right: boolean) => {
                return update(left, right);
            },
            onFrame: () => {
                setNodes((nodes) =>
                    nodes.map((node) => {
                        node.data = {
                            ...node.data,
                            activated: node.id === currentState.current.id,
                        };
                        return node;
                    })
                );
            },
        }));

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

        const onDrop = useCallback(
            (event: DragEvent) => {
                event.preventDefault();

                const type = event.dataTransfer.getData(
                    "application/reactflow"
                );

                // check if the dropped element is valid
                if (typeof type === "undefined" || !type) {
                    return;
                }

                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });

                setNodes((nds) =>
                    nds.concat(createNode(position, type, getId()))
                );
            },
            [reactFlowInstance]
        );

        const onDragOver = useCallback((event: DragEvent) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        }, []);

        return (
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineComponent={CustomConnectionLine}
                connectionLineStyle={connectionLineStyle}
                onDrop={onDrop}
                onDragOver={onDragOver}
                proOptions={proOptions}
            />
        );
    }
);

export default Graph;

import {
    DragEvent,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
    Connection,
    Edge,
    Node,
    ReactFlowInstance,
} from "reactflow";

import CustomConnectionLine from "./ConnectionLine.tsx";
import { MoveEdge, MoveEdgeData, MoveNode } from "./nodes/Move.tsx";
import {
    CountData,
    CountEdge,
    CountEdgeData,
    CountNode,
} from "./nodes/Count.tsx";
import { CreateNode, EdgeData, NodeData } from "./nodes/Node.tsx";
import { suspend } from "suspend-react";
import { create } from "zustand";

type State = {
    id: string;
};

type Action = {
    setId: (id: string) => void;
};

// Create your store, which includes both state and (optionally) actions
export const useStateStore = create<State & Action>((set) => ({
    id: "0",
    setId: (id) => set(() => ({ id: id })),
}));

const connectionLineStyle = {
    strokeWidth: 3,
    stroke: "hsl(var(--foreground))",
};

const nodeTypes = {
    move: MoveNode,
    count: CountNode,
};

const edgeTypes = {
    move: MoveEdge,
    count: CountEdge,
};

const defaultEdgeOptions = {
    style: { strokeWidth: 3, stroke: "hsl(var(--foreground))" },
    type: "floating",
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "hsl(var(--foreground))",
    },
};

const proOptions = { hideAttribution: true };

function game(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]) {
    let currentState = useRef(nodes[0]);
    const update = (left: boolean, right: boolean): [number, number] => {
        let edge = edges
            .filter((edge) => edge.source === currentState.current.id)
            .find((edge) => {
                switch (edge.type) {
                    case "move":
                        let moveData = edge.data as MoveEdgeData;
                        return (
                            moveData.left === left && moveData.right === right
                        );
                    case "count":
                        let countData = edge.data as CountEdgeData;
                        let nodeData = currentState.current.data as CountData;
                        let condition = false;

                        switch (countData.compare) {
                            case "==":
                                condition =
                                    nodeData.count === countData.condition;
                                break;
                            case "<":
                                condition =
                                    nodeData.count < countData.condition;
                                break;
                            case ">":
                                condition =
                                    nodeData.count > countData.condition;
                                break;
                            case "<=":
                                condition =
                                    nodeData.count <= countData.condition;
                                break;
                            case ">=":
                                condition =
                                    nodeData.count >= countData.condition;
                                break;
                        }

                        if (condition) {
                            (currentState.current.data as CountData).count++;
                        }
                        return condition;
                }
            });

        let { move, turn } = currentState.current.data;
        if (edge === undefined) {
            return [move, turn];
        }

        let state = nodes.find((state) => state.id === edge?.target);

        if (state !== undefined) {
            currentState.current = state;
            ({ move, turn } = currentState.current.data);
        }

        return [move, turn];
    };
    return { currentState, update };
}

const fetchData = async (): Promise<[Node<NodeData>[], Edge<EdgeData>[]]> => {
    let local = sessionStorage.getItem("data");
    let flow;

    if (local) {
        try {
            flow = JSON.parse(local);
        } catch (error) {}
    }
    if (!flow) {
        try {
            const data = await fetch("./defaultdata.json");
            flow = await data.json();
            sessionStorage.setItem("data", JSON.stringify(flow));
        } catch (error) {
            return [[], []];
        }
    }

    return [flow.nodes ?? [], flow.edges ?? []];
};

export type GraphHandle = {
    update: (left: boolean, right: boolean) => [number, number];
    onFrame: Function;
};

const Graph = forwardRef<GraphHandle>((_, ref) => {
    const [initialNodes, initialEdges] = suspend(fetchData);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<
        ReactFlowInstance<NodeData>
    >(null!);

    useEffect(() => {
        if (!reactFlowInstance) {
            return;
        }
        const flow = reactFlowInstance.toObject();
        sessionStorage.setItem("data", JSON.stringify(flow));
    }, [nodes, edges]);

    const setId = useStateStore((state) => state.setId);
    let count = initialNodes.length + 1;
    const getId = () => `${count++}`;
    const { currentState, update } = game(nodes, edges);

    useImperativeHandle(ref, () => ({
        update: (left: boolean, right: boolean) => {
            return update(left, right);
        },
        onFrame: () => {
            setId(currentState.current.id);
        },
    }));

    const onConnect = useCallback(
        (params: Connection) => {
            if (!params.source || !params.target) {
                return;
            }

            let source = nodes.find((node) => node.id == params.source);
            if (!source) {
                return;
            }

            let data: EdgeData;
            switch (source.type) {
                case "move":
                    data = {
                        left: false,
                        right: false,
                    };
                    break;
                case "count":
                    data = {
                        condition: 0,
                        compare: "==",
                    };
                    break;
                default:
                    return;
            }

            const edge: Edge<EdgeData> = {
                id: `${params.source}-${params.target}`,
                type: source.type,
                source: params.source,
                target: params.target,
                data: data,
            };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges, nodes]
    );

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData("application/reactflow");

            // check if the dropped element is valid
            if (typeof type === "undefined" || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            setNodes((nds) => nds.concat(CreateNode(type, getId(), position)));
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
            nodeOrigin={[0.5, 0.5]}
        />
    );
});

export default Graph;

import { HtmlHTMLAttributes, PropsWithChildren } from "react";
import { Handle, Node, NodeProps, Position, XYPosition, useStore } from "reactflow";
import {
    CreateForward,
    CreateLeft,
    CreateRight,
    CreateStill,
    MoveData,
    MoveEdgeData,
} from "./Move";
import { CountData, CountEdgeData, CreateCount } from "./Count";

export type NodeData = MoveData | CountData;
export type EdgeData = MoveEdgeData | CountEdgeData

export type BaseData = {
    activated?: boolean;
    move: number;
    turn: number;
};

export function BaseNode(props: HtmlHTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={
                "bg-neutral-800 rounded-full border-4 w-36 h-36 flex overflow-hidden justify-center items-center relative font-bold"
            }
        />
    );
}

export const GraphNode = ({
    id,
    data,
    children,
}: PropsWithChildren<NodeProps>) => {
    const connectionNodeId = useStore((state) => state.connectionNodeId);
    const isConnecting = !!connectionNodeId;

    return (
        <BaseNode
            style={{
                borderColor: data.activated ? "red" : "white",
            }}
        >
            {connectionNodeId !== id && (
                <Handle
                    className="opacity-0 w-full h-full"
                    position={Position.Left}
                    type="target"
                    isConnectableStart={isConnecting}
                />
            )}
            {!isConnecting && (
                <Handle
                    className="opacity-0 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-4/5 h-4/5 "
                    position={Position.Right}
                    type="source"
                />
            )}
            {children}
        </BaseNode>
    );
};

export const CreateNode = (kind: string, id: string, position: XYPosition): Node<NodeData> => {
    let data: NodeData;
    let type: string;
    switch (kind) {
        case "forward":
            data = CreateForward();
            type = "move"
            break;
        case "still":
            data = CreateStill();
            type = "move"
            break;
        case "left":
            data = CreateLeft();
            type = "move"
            break;
        case "right":
            data = CreateRight();
            type = "move"
            break;
        case "count":
            data = CreateCount();
            type = "count"
            break
        default:
            throw new Error("Invalid node type")
    }

    return {
        id: id,
        type: type,
        position: position,
        data: data,
    };
};

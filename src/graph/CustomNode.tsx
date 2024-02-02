import { HtmlHTMLAttributes } from "react";
import { Handle, NodeProps, Position, useStore } from "reactflow";

export function NodeBase(props: HtmlHTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={
                "bg-neutral-800 rounded-full border-4 w-36 h-36 flex overflow-hidden justify-center items-center relative font-bold"
            }
        />
    );
}

export default function CustomNode({ id, data }: NodeProps) {
    const connectionNodeId = useStore((state) => state.connectionNodeId);
    const isConnecting = !!connectionNodeId;

    return (
        <NodeBase
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
            {data.label}
        </NodeBase>
    );
}

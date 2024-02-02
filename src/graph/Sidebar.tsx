import { DragEvent } from "react";
import { NodeBase } from "./CustomNode";

export default () => {
    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <>
            <NodeBase
                draggable
                onDragStart={(event) => onDragStart(event, "forward")}
            >
                Forward
            </NodeBase>
            <NodeBase
                draggable
                onDragStart={(event) => onDragStart(event, "still")}
            >
                Still
            </NodeBase>
            <NodeBase
                draggable
                onDragStart={(event) => onDragStart(event, "left")}
            >
                Left
            </NodeBase>
            <NodeBase
                draggable
                onDragStart={(event) => onDragStart(event, "right")}
            >
                Right
            </NodeBase>
        </>
    );
};

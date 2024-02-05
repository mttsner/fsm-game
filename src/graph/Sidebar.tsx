import { DragEvent } from "react";
import { BaseNode } from "./nodes/Node";

export default () => {
    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <>
            <BaseNode
                draggable
                onDragStart={(event) => onDragStart(event, "forward")}
            >
                Forward
            </BaseNode>
            <BaseNode
                draggable
                onDragStart={(event) => onDragStart(event, "still")}
            >
                Still
            </BaseNode>
            <BaseNode
                draggable
                onDragStart={(event) => onDragStart(event, "left")}
            >
                Left
            </BaseNode>
            <BaseNode
                draggable
                onDragStart={(event) => onDragStart(event, "right")}
            >
                Right
            </BaseNode>
            <BaseNode
                draggable
                onDragStart={(event) => onDragStart(event, "count")}
            >
                Count
            </BaseNode>
        </>
    );
};

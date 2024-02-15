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
                className="flex-shrink-0"
                draggable
                onDragStart={(event) => onDragStart(event, "forward")}
            >
                Forward
            </BaseNode>
            <BaseNode
                className="flex-shrink-0"
                draggable
                onDragStart={(event) => onDragStart(event, "still")}
            >
                Still
            </BaseNode>
            <BaseNode
                className="flex-shrink-0"
                draggable
                onDragStart={(event) => onDragStart(event, "left")}
            >
                Left
            </BaseNode>
            <BaseNode
                className="flex-shrink-0"
                draggable
                onDragStart={(event) => onDragStart(event, "right")}
            >
                Right
            </BaseNode>
            <BaseNode
                className="flex-shrink-0"
                draggable
                onDragStart={(event) => onDragStart(event, "count")}
            >
                Count
            </BaseNode>
        </>
    );
};

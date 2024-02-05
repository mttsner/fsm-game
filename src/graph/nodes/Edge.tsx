import { PropsWithChildren, useCallback } from "react";
import {
    useStore,
    getStraightPath,
    EdgeProps,
    EdgeLabelRenderer,
} from "reactflow";
import { getEdgeParams } from "../utils";

export function BaseEdge({
    id,
    source,
    target,
    markerEnd,
    style,
    children,
}: PropsWithChildren<EdgeProps>) {
    const sourceNode = useStore(
        useCallback((store) => store.nodeInternals.get(source), [source])
    );
    const targetNode = useStore(
        useCallback((store) => store.nodeInternals.get(target), [target])
    );

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

    let [edgePath, labelX, labelY] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
    });

    return (
        <>
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                style={style}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: "all",
                    }}
                    className="bg-neutral-800 border-white border-2 flex flex-col rounded-md absolute nodrag nopan"
                >
                    {children}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

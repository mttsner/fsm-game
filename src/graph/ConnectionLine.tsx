import {
    getStraightPath,
    ConnectionLineComponentProps,
    Node,
    useStore,
    useReactFlow,
} from "reactflow";

function getNodeIntersection(
    fromNode: Node,
    fx: number,
    fy: number,
    tx: number,
    ty: number
) {
    const { width: intersectionNodeWidth } = fromNode;

    if (!intersectionNodeWidth) {
        throw new Error("Node width undefined");
    }

    const radius = intersectionNodeWidth / 2;

    const cx = fx;
    const cy = fy;

    const deltaY = ty - cy;
    const deltaX = tx - cx;
    const a = Math.atan2(deltaY, deltaX);

    const x = cx + radius * Math.cos(a);
    const y = cy + radius * Math.sin(a);

    return { x, y };
}

function CustomConnectionLine({
    fromNode,
    fromX,
    fromY,
    toX,
    toY,
    connectionLineStyle,
    connectionStatus,
}: ConnectionLineComponentProps) {
    const connectionEndHandle = useStore((state) => state.connectionEndHandle);
    const reactflow = useReactFlow();

    if (fromNode === undefined) {
        throw new Error("From node is undefined");
    }
    let source;
    let target = {x: toX, y: toY};
    const valid = connectionStatus === "valid"
    
    if (valid && connectionEndHandle) {
        const toNode = reactflow.getNode(connectionEndHandle.nodeId);
        target = getNodeIntersection(
            fromNode,
            toNode!.position.x,
            toNode!.position.y,
            fromX,
            fromY,
        );
        source = getNodeIntersection(
            fromNode,
            fromX,
            fromY,
            toNode!.position.x,
            toNode!.position.y,
        );
    } else {
        source = getNodeIntersection(fromNode, fromX, fromY, toX, toY);
    }

    const [edgePath] = getStraightPath({
        sourceX: source.x,
        sourceY: source.y,
        targetX: target.x,
        targetY: target.y,
    });

    return (
        <g>
            <path
                fill="none"
                className="animated"
                d={edgePath}
                markerEnd={valid ? "url(#1__color=white&type=arrowclosed)": ""}
                style={connectionLineStyle}
            />
        </g>
    );
}

export default CustomConnectionLine;

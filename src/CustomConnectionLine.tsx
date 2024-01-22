import {
    getStraightPath,
    ConnectionLineComponentProps,
    getMarkerEnd,
    MarkerType,
} from "reactflow";

type GetSpecialPathParams = {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
  };

function getSpecialPath({ sourceX, sourceY, targetX, targetY }: GetSpecialPathParams, offset: number) {
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;
  
    return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
  };

function getNodeIntersection(fromNode, fx, fy, tx, ty) {
    const { width: intersectionNodeWidth } = fromNode;

    const radius = intersectionNodeWidth / 2;

    const cx = fx; //intersectionNodePosition.x + radius
    const cy = fy; //intersectionNodePosition.y + radius

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
    const position = getNodeIntersection(fromNode, fromX, fromY, toX, toY);

    if (connectionStatus == "valid") {
        const { x, y } = getNodeIntersection(fromNode, toX, toY, fromX, fromY);
        toX = x;
        toY = y;
    }

    const [edgePath] = getStraightPath({
        sourceX: position.x,
        sourceY: position.y,
        targetX: toX,
        targetY: toY,
    });

    const newPath = getSpecialPath({
        sourceX: position.x,
        sourceY: position.y,
        targetX: toX,
        targetY: toY,
    }, 70)
    console.log(getMarkerEnd(MarkerType.ArrowClosed))
    return (
        <g>
            <path
              fill="none"
              className="animated"
              d={newPath}
              markerEnd="url(#arrowclosed)"
              style={connectionLineStyle}
            />
        </g>
    );
}

export default CustomConnectionLine;

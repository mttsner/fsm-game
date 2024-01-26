import { useCallback } from 'react';
import { useStore, getStraightPath, EdgeProps, EdgeLabelRenderer } from 'reactflow';

import { getEdgeParams } from './utils.tsx';
import Controller from './Controller.tsx';

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

function FloatingEdge({ id, source, target, markerEnd, style, data }: EdgeProps) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  data.test = true

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const newPath = getSpecialPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  }, 50)

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
        <Controller
          labelX={labelX}
          labelY={labelY}
          data={data}
        />
      </EdgeLabelRenderer>
    </>
  );
}

export default FloatingEdge;
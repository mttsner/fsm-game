import { Handle, NodeProps, Position, useStore } from 'reactflow';

export default function CustomNode({ id, data }: NodeProps) {
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  
  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };
  const label = isTarget ? 'Drop here' : data.label;

  return (
    <div className="customNode">
      <div className={(data.activated ? "border-red-600" : "border-white") + " bg-neutral-800 rounded-full border-4 w-36 h-36 flex overflow-hidden justify-center items-center relative font-bold"}>
        {!isConnecting && (
          <Handle className="customHandle" style={{ zIndex: 2 }} position={Position.Right} type="source" />
        )}
        {connectionNodeId !== id && (
          <Handle
          className="customHandle2"
          position={Position.Left}
          style={targetHandleStyle}
          type="target"
          isConnectableStart={false}
        />
        )}
        
        {label}
      </div>
    </div>
  );
}
import { Handle, Position, useStore } from 'reactflow';

const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function CustomNode({ id }) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  
  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };
  const label = isTarget ? 'Drop here' : 'Drag to connect';

  return (
    <div className="customNode">
      <div className=" bg-neutral-800 rounded-full border-white border-4 w-36 h-36 flex overflow-hidden justify-center items-center relative font-bold">
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
import { EdgeProps, NodeProps } from "reactflow";
import { BaseData, GraphNode } from "./Node";
import { BaseEdge } from "./Edge";
import { Checkbox } from "./Misc";

export type MoveEdgeData = {
    left: boolean;
    right: boolean;
};

export type MoveData = BaseData & {
    label: string;
};

// Type: move
export const MoveNode = (props: NodeProps<MoveData>) => (
    <GraphNode {...props}>{props.data.label}</GraphNode>
);

export const MoveEdge = (props: EdgeProps) => {
    return (
        <BaseEdge {...props}>
            <div className="flex p-0.5">
                <Checkbox
                    defaultChecked={props.data!.left}
                    onChange={(e) => (props.data!.left = e.target.checked)}
                    className="text-red-600"
                ></Checkbox>
                <Checkbox
                    defaultChecked={props.data!.right}
                    onChange={(e) => (props.data!.right = e.target.checked)}
                    className="text-green-600"
                ></Checkbox>
            </div>
        </BaseEdge>
    );
};

export const CreateForward = (): MoveData => ({
    label: "Forward",
    move: 0.1,
    turn: 0,
});

export const CreateStill = (): MoveData => ({
    label: "Still",
    move: 0,
    turn: 0,
});

export const CreateLeft = (): MoveData => ({
    label: "Left",
    move: 0,
    turn: 0.05,
});

export const CreateRight = (): MoveData => ({
    label: "Right",
    move: 0,
    turn: -0.05,
});

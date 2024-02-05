import { NodeProps } from "reactflow";
import { BaseData, GraphNode } from "./Node";

export type CountEdge = {
    condition: number
}

export type CountData = BaseData & {
    count: number;
};

// Type: count
export function CountNode(props: NodeProps<CountData>) {

    return (
        <GraphNode {...props}>
            {props.data.count}
        </GraphNode>
    );
};

export const CreateCount = (): CountData => ({
    count: 0,
    move: 0,
    turn: 0,
});
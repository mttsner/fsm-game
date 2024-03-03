import { EdgeProps, NodeProps } from "reactflow";
import { BaseData, GraphNode } from "./Node";
import { BaseEdge } from "./Edge";

export type CountEdgeData = {
    condition: number;
    compare: string;
};

export type CountData = BaseData & {
    count: number;
};

// Type: count
export function CountNode(props: NodeProps<CountData>) {
    return <GraphNode {...props}>{props.data.count}</GraphNode>;
}

export const CountEdge = (props: EdgeProps<CountEdgeData>) => {
    return (
        <BaseEdge {...props}>
            <div className="flex items-center gap-1 p-1">
                <select
                    onChange={(e) => (props.data!.compare = e.target.value)}
                    defaultValue={"=="}
                    className="pt-0 p-0.5 border rounded-sm border-foreground h-5 w-5 leading-4 bg-background text-foreground bg-none text-center"
                >
                    <option value="==">=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value=">=">≥</option>
                    <option value="<=">≤</option>
                </select>
                <input
                    type="number"
                    defaultValue={props.data!.condition}
                    onChange={(e) => (props.data!.condition = +e.target.value)}
                    className="w-10 h-5 p-0.5 text-center border rounded-sm border-foreground bg-background"
                ></input>
            </div>
        </BaseEdge>
    );
};

export const CreateCount = (): CountData => ({
    count: 0,
    move: 0,
    turn: 0,
});

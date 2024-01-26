import { Edge, Node } from "reactflow";
import { Update } from "./robot";

export type NodeData = {
    label: string;
    activated: boolean;
    update: Update;
    transitions: Transition[];
};

export type State = Node<NodeData>;

export type EdgeData = {
    left: boolean
    right: boolean
};

export type Transition = Edge<EdgeData>;

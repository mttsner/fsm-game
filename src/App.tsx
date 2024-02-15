import { Suspense, useRef } from "react";

import "reactflow/dist/style.css";
import "./style.css";
import Game from "./game/map.tsx";
import Graph, { GraphHandle } from "./graph/Graph.tsx";
import NodePicker from "./graph/Sidebar.tsx";
import { Edge, Node } from "reactflow";
import { EdgeData, NodeData } from "./graph/nodes/Node.tsx";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./components/ui/resizable.tsx";
import { Controls } from "./game/controls.tsx";
import { ThemeProvider } from "./components/theme.tsx";
import { ModeToggle } from "./components/theme-toggle.tsx";

const initialNodes: Node<NodeData>[] = [
    {
        id: "1",
        type: "move",
        position: { x: 0, y: 0 },
        data: {
            label: "Forward",
            move: 0.1,
            turn: 0,
        },
    },
    {
        id: "2",
        type: "move",
        position: { x: 250, y: 320 },
        data: {
            label: "Left",
            move: 0,
            turn: -0.05,
        },
    },
    {
        id: "3",
        type: "move",
        position: { x: 40, y: 300 },
        data: {
            label: "Right",
            move: 0,
            turn: -0.05,
        },
    },
    {
        id: "4",
        type: "move",
        position: { x: 300, y: 0 },
        data: {
            label: "Still",
            move: 0,
            turn: 0,
        },
    },
    {
        id: "5",
        type: "count",
        position: { x: 50, y: 50 },
        data: {
            count: 0,
            move: 0,
            turn: 0,
        },
    },
];

const initialEdges: Edge<EdgeData>[] = [
    {
        id: "1-3",
        type: "move",
        source: "1",
        target: "3",
        data: {
            left: false,
            right: true,
        },
    },
    {
        id: "3-4",
        type: "move",
        source: "3",
        target: "4",
        data: {
            left: false,
            right: false,
        },
    },
    {
        id: "4-1",
        type: "move",
        source: "4",
        target: "1",
        data: {
            left: false,
            right: false,
        },
    },
];

const Header = () => (
    <header className="bg-background w-full h-14 p-2 pl-3 z-10 border-b-[0.25rem] border-foreground flex items-center">
        <p className="text-4xl font-orbitron">FSM Game</p>
        <p className="text-sm self-end ml-1 font-orbitron">v0.1</p>
        <div className="ml-auto flex items-center"><ModeToggle/></div>
    </header>
);

const NodeMenu = () => (
    <div className="w-full h-40 z-10 border-t-[0.25rem] border-foreground">
        <div className="flex items-center h-7 relative bottom-7 bg-foreground w-28 pl-2 rounded-tr-md">
            <p className="text-sm font-orbitron text-background">Node Picker</p>
        </div>
        <div className="relative bottom-7 flex flex-row gap-1 overflow-x-auto p-1">
            <NodePicker />
        </div>
    </div>
);

const App = () => {
    const updateRef = useRef<GraphHandle>(null!);
    const tpsRef = useRef(30);
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex flex-col h-screen w-screen grid-rows-3">
                <Header />
                <ResizablePanelGroup
                    className="w-full flex-1"
                    direction="horizontal"
                >
                    <ResizablePanel className="z-10 bg-background">
                        <Graph
                            ref={updateRef}
                            initialNodes={initialNodes}
                            initialEdges={initialEdges}
                        />
                    </ResizablePanel>
                    <ResizableHandle
                        className="z-10 w-1 bg-foreground"
                        withHandle
                    />
                    <ResizablePanel>
                            <Suspense>
                                <Game
                                    update={(...args) =>
                                        updateRef.current.update(...args)
                                    }
                                    onFrame={() => updateRef.current.onFrame()}
                                    tpsRef={tpsRef}
                                />
                            </Suspense>
                            <Controls tps={tpsRef} />
                    </ResizablePanel>
                </ResizablePanelGroup>
                <NodeMenu />
            </div>
        </ThemeProvider>
    );
};

export default App;

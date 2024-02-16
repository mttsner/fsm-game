import { Suspense, useRef } from "react";
import "reactflow/dist/style.css";
import "./style.css";
import Game from "./game/map.tsx";
import Graph, { GraphHandle } from "./graph/Graph.tsx";
import NodePicker from "./graph/Sidebar.tsx";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./components/ui/resizable.tsx";
import { Controls } from "./game/controls.tsx";
import { ThemeProvider } from "./components/theme.tsx";
import { ModeToggle } from "./components/theme-toggle.tsx";

const Header = () => (
    <header className="bg-background w-full h-14 p-2 pl-3 z-10 border-b-[0.25rem] border-foreground flex items-center">
        <p className="text-4xl font-orbitron">FSM Game</p>
        <p className="text-sm self-end ml-1 font-orbitron">v0.1</p>
        <div className="ml-auto flex items-center">
            <ModeToggle />
        </div>
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
    console.log("App");
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex flex-col h-screen w-screen grid-rows-3">
                <Header />
                <ResizablePanelGroup
                    className="w-full flex-1"
                    direction="horizontal"
                >
                    <ResizablePanel className="z-10 bg-background">
                        <Suspense>
                            <Graph ref={updateRef} />
                        </Suspense>
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

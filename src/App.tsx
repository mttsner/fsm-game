import { Suspense, useRef } from "react";
import "reactflow/dist/style.css";
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
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "./components/ui/dialog.tsx";
import Info from "./info.mdx";
import { ScrollArea } from "./components/ui/scroll-area.tsx";

// Breaks in strict mode
const DialogOpen = () => {
    if (sessionStorage.getItem("dialog")) {
        return false
    }
    sessionStorage.setItem("dialog", "opened")
    return true
}

const Header = () => (
    <header className="bg-background w-full h-14 p-2 pl-3 z-10 border-b-[0.25rem] border-foreground flex items-center">
        <Dialog defaultOpen={DialogOpen()}>
            <DialogTrigger className="focus-visible:outline-none">
                <div className="text-4xl font-orbitron">FSM Game</div>
            </DialogTrigger>
            <DialogContent className="gap-2 h-5/6 p-0">
                <ScrollArea className="p-6">
                    <Info />
                </ScrollArea>
            </DialogContent>
        </Dialog>
        <div className="text-sm self-end ml-1 font-orbitron">v0.1</div>

        <div className="ml-auto flex items-center">
            <ModeToggle />
        </div>
    </header>
);

const NodeMenu = () => (
    <div className="w-full h-40 z-10 border-t-[0.25rem] border-foreground">
        <div className="flex items-center h-7 relative bottom-7 bg-foreground w-28 pl-2 rounded-tr-md">
            <div className="text-sm font-orbitron text-background">
                Node Picker
            </div>
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

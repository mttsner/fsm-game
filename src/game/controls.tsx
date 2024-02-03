import { BackwardIcon, ForwardIcon } from "@heroicons/react/24/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { MutableRefObject, useState } from "react";

export type ControlsParams = {
    tps: MutableRefObject<number>;
};

export const Controls = ({ tps }: ControlsParams) => {
    const base = 30;
    const [original, setOriginal] = useState(tps.current);
    const [paused, setPaused] = useState(false);

    const onPause = () => {
        tps.current = 0;
        setPaused(true);
    };

    const onPlay = () => {
        tps.current = original;
        setPaused(false);
    };

    const onForward = () => {
        let t = Math.min(base * 4, original * 2)
        setOriginal(t);
        if (!paused) {
            tps.current = t;
        }
    };

    const onBackward = () => {
        let t = Math.max(base / 4, original / 2)
        setOriginal(t);
        if (!paused) {
            tps.current = t;
        }
    };

    return (
        <div className="relative flex justify-center w-full h-[2.75rem] bottom-16">
            <div className="flex bg-gray-50 p-1 rounded-md drop-shadow-lg shadow-inner">
                <BackwardIcon
                    onClick={onBackward}
                    className={
                        (original === base / 4
                            ? "text-zinc-900 bg-zinc-200 drop-shadow "
                            : "") +
                        "text-slate-800 hover:text-zinc-900 m-[0.1rem] p-[0.2rem] rounded-md shadow shadow-zinc-200 transition-all duration-300 hover:bg-zinc-200 hover:drop-shadow"
                    }
                />
                {paused ? (
                    <PlayIcon
                        onClick={onPlay}
                        className="text-slate-800 hover:text-zinc-900 m-[0.1rem] p-[0.2rem] mr-1 ml-1 rounded-md shadow shadow-zinc-200 transition-all duration-300 hover:bg-zinc-200 hover:drop-shadow"
                    />
                ) : (
                    <PauseIcon
                        onClick={onPause}
                        className="text-slate-800 hover:text-zinc-900 m-[0.1rem] p-[0.2rem] mr-1 ml-1 rounded-md shadow shadow-zinc-200 transition-all duration-300 hover:bg-zinc-200 hover:drop-shadow"
                    />
                )}
                <ForwardIcon
                    onClick={onForward}
                    className={
                        (original === base * 4
                            ? "text-zinc-900 bg-zinc-200 drop-shadow "
                            : "") +
                        "text-slate-800 hover:text-zinc-900 m-[0.1rem] p-[0.2rem] rounded-md shadow shadow-zinc-200 transition-all duration-300 hover:bg-zinc-200 hover:drop-shadow"
                    }
                />
            </div>
        </div>
    );
};

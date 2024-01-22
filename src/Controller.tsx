export default function Controller({ labelX, labelY }) {
    return (
        <div
            style={{
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
            }}
            className="bg-neutral-800 border-white border-2 flex flex-col rounded-md absolute nodrag nopan"
        >
            <div className="grid grid-cols-2 gap-2 p-2">
                <label className="bg-red-600 bg-opacity-25 flex items-center justify-center">
                    <input
                        type="checkbox"
                        className=" focus outline outline-neutral-500 bg-neutral-700 border-neutral-700 border-2 appearance-none h-4 w-4 rounded-full checked:bg-white checked:outline-white"
                    ></input>
                </label>
                <label className="bg-blue-600 bg-opacity-25 flex items-center justify-center">
                    <input
                        type="checkbox"
                        className="outline outline-neutral-500 bg-neutral-700 border-neutral-700 border-2 appearance-none h-4 w-4 rounded-full checked:bg-white checked:outline-white"
                    ></input>
                </label>
                <label>
                    <input
                        type="number"
                        min={-100}
                        max={100}
                        defaultValue={0}
                        className="bg-neutral-700 outline-neutral-500 border-2 rounded-sm w-10 p-1 text-center"
                    ></input>
                </label>
                <label>
                    <input
                        type="number"
                        min={-100}
                        max={100}
                        defaultValue={0}
                        className="bg-neutral-700 outline-neutral-500 border-2 rounded-sm w-10 p-1 text-center"
                    ></input>
                </label>
            </div>
        </div>
    );
}

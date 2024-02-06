import { InputHTMLAttributes } from "react";

export const Checkbox = (props: InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        type="checkbox"
        className={`m-1 ring-2 ring-neutral-500 ring-offset-0 outline-none bg-neutral-700 border-none rounded-full focus:ring-offset-0 checked:bg-none ${props.className}`}
    ></input>
);


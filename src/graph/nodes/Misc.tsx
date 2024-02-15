import { InputHTMLAttributes } from "react";

export const Checkbox = (props: InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        type="checkbox"
        className={`m-1 ring-2 ring-foreground ring-offset-0 outline-none bg-background border-none rounded-full focus:ring-offset-0 checked:bg-none ${props.className}`}
    ></input>
);


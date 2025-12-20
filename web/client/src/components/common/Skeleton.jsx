import { twMerge } from "tailwind-merge";

export default function Skeleton({ className }) {
    return (
        <div
            className={twMerge(
                "bg-glass-border animate-shimmer bg-[length:200%_100%] rounded-md",
                "bg-gradient-to-r from-glass-border via-bg-hover to-glass-border",
                className
            )}
        />
    );
}

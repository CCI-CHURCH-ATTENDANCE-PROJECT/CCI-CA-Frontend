import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            class={cn("bg-accent animate-pulse rounded-md", className)}
            {...props}
        />
    );
}

export { Skeleton };

import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const inputClasses =
  "w-full rounded-lg border border-input bg-background px-3 py-2 placeholder:text-faint-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-blue-600 disabled:bg-muted disabled:text-subtle-foreground";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClasses, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "rounded-lg border border-input bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-600",
        className,
      )}
      {...props}
    />
  );
}

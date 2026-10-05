import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

// Swap the text for an <Image> here to use your own logo everywhere.
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className={cn("text-lg font-bold", className)}>
      {siteConfig.name}
    </Link>
  );
}

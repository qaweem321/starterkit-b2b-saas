// Only allow redirects to pages on this site: "/path", never "https://..." or "//other.site".
export function safeNextPath(next: string | null | undefined, fallback = "/dashboard") {
  if (next?.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")) {
    return next;
  }
  return fallback;
}

export function getNextPath(fallback = "/dashboard") {
  return safeNextPath(new URLSearchParams(window.location.search).get("next"), fallback);
}

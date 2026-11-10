/*
 * Routes that are complete websites of their own (client concept builds
 * under /work/…). They bring their own brand, so the portfolio chrome
 * (Header, Cursor) stays out of the way there.
 */
const STANDALONE_PREFIXES = ["/work/"];

export function isStandalone(pathname = "") {
  return STANDALONE_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * test-setup.ts — vitest setup.
 *
 * jsdom (via vitest's jsdom environment) exposes a `localStorage` object that
 * lacks the Storage methods in this toolchain, which breaks the marketplace-cart
 * unit tests. Install a minimal in-memory Storage shim whenever a usable one is
 * absent. No-op in the node environment (no window/localStorage there).
 */

function makeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() { return map.size; },
    clear() { map.clear(); },
    getItem(k: string) { return map.has(k) ? map.get(k)! : null; },
    key(i: number) { return Array.from(map.keys())[i] ?? null; },
    removeItem(k: string) { map.delete(k); },
    setItem(k: string, v: string) { map.set(k, String(v)); },
  } as Storage;
}

const g = globalThis as unknown as { window?: unknown; localStorage?: unknown };

if (typeof g.window !== 'undefined') {
  const ls = g.localStorage as { clear?: unknown } | undefined;
  if (!ls || typeof ls.clear !== 'function') {
    const shim = makeStorage();
    Object.defineProperty(g, 'localStorage', { value: shim, configurable: true, writable: true });
    Object.defineProperty(g.window as object, 'localStorage', { value: shim, configurable: true, writable: true });
  }
}

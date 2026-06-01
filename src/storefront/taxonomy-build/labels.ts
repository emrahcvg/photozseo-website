import type { RawEntry } from './types';

export function extractLabels(entries: RawEntry[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const e of entries) {
    out[e.id] = e.path[e.path.length - 1];
  }
  return out;
}

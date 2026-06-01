import type { RawEntry } from './types';

const VERSION_RE = /version:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i;

export function parse(text: string): { version: string; entries: RawEntry[] } {
  const lines = text.split('\n');
  let version = '';
  const entries: RawEntry[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#')) {
      const m = line.match(VERSION_RE);
      if (m) version = m[1];
      continue;
    }
    const sep = line.indexOf(' - ');
    if (sep === -1) continue;
    const id = line.slice(0, sep).trim();
    const path = line
      .slice(sep + 3)
      .split(' > ')
      .map((s) => s.trim());
    if (!id || path.some((s) => !s)) continue;
    entries.push({ id, path });
  }

  return { version, entries };
}

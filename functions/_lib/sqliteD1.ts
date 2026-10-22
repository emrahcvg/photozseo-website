// functions/_lib/sqliteD1.ts — vitest için GERÇEK SQL motoru (node:sqlite) üstünde D1 adaptörü.
// D1 de SQLite olduğundan WHERE/ORDER BY/LIMIT/GROUP BY sorguları canlıdakiyle aynı davranır;
// regex tabanlı fakeD1'in kaçıracağı sorgu hatalarını yakalar. migrations/*.sql sırayla uygulanır.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

type Row = Record<string, unknown>;

/** D1 tek sorguda en fazla 100 bağlı parametre kabul eder — testte de aynı sınırı uygula. */
const D1_MAX_PARAMS = 100;

export function makeSqliteD1() {
  const sqlite = new DatabaseSync(':memory:');
  const dir = join(__dirname, '../../migrations');
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.sql')).sort()) {
    sqlite.exec(readFileSync(join(dir, f), 'utf8'));
  }
  const norm = (args: unknown[]) => args.map((a) => (a === undefined ? null : typeof a === 'boolean' ? Number(a) : a)) as never[];
  const stmt = (sql: string, args: unknown[] = []) => {
    if (args.length > D1_MAX_PARAMS) throw new Error(`D1 parametre sınırı aşıldı: ${args.length} > ${D1_MAX_PARAMS}`);
    return {
      bind: (...a: unknown[]) => stmt(sql, a),
      async first<T = Row>(col?: string): Promise<T | null> {
        const r = sqlite.prepare(sql).get(...norm(args)) as Row | undefined;
        if (!r) return null;
        return (col ? (r[col] as T) : ({ ...r } as T));
      },
      async all<T = Row>(): Promise<{ results: T[] }> {
        return { results: (sqlite.prepare(sql).all(...norm(args)) as Row[]).map((r) => ({ ...r }) as T) };
      },
      async run(): Promise<{ success: boolean }> {
        sqlite.prepare(sql).run(...norm(args));
        return { success: true };
      },
    };
  };
  const db = {
    prepare: (sql: string) => stmt(sql),
    async batch(stmts: { run(): Promise<unknown> }[]) { return Promise.all(stmts.map((s) => s.run())); },
  };
  return { db, sqlite };
}

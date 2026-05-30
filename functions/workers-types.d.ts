/**
 * Minimal Cloudflare Workers type shims for TypeScript type-checking.
 * For full types, install @cloudflare/workers-types.
 * These allow `astro check` to pass without adding a devDependency.
 */

interface KVNamespace {
  get(key: string, options?: { type?: 'text' }): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: { name: string }[];
    list_complete: boolean;
    cursor?: string;
  }>;
}

interface EventContext<Env = Record<string, unknown>, P extends string = string, Data = unknown> {
  request: Request;
  env: Env;
  params: Record<P, string | string[]>;
  waitUntil(promise: Promise<unknown>): void;
  next(input?: Request | string, init?: RequestInit): Promise<Response>;
  data: Data;
  pluginArgs?: unknown;
  functionPath: string;
}

type PagesFunction<
  Env = Record<string, unknown>,
  P extends string = string,
  Data = unknown,
> = (context: EventContext<Env, P, Data>) => Response | Promise<Response>;

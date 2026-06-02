// functions/_lib/fakeD1.ts — vitest için minimal bellek-içi D1 sahtesi.
// Sadece marketplace.ts'in ürettiği SQL şekillerini destekler (meta upsert/select,
// stores/products replace + filtre select + count). Tam bir SQL motoru DEĞİLDİR.

interface Row { [k: string]: unknown; }

export interface FakeD1 {
  db: {
    prepare(sql: string): {
      bind(...args: unknown[]): {
        first<T = Row>(col?: string): Promise<T | null>;
        all<T = Row>(): Promise<{ results: T[] }>;
        run(): Promise<{ success: boolean }>;
      };
      first<T = Row>(col?: string): Promise<T | null>;
      all<T = Row>(): Promise<{ results: T[] }>;
      run(): Promise<{ success: boolean }>;
    };
    batch(stmts: unknown[]): Promise<unknown[]>;
  };
  tables: { meta: Row[]; stores: Row[]; products: Row[]; favorites: Row[]; cart_items: Row[] };
}

export function makeFakeD1(): FakeD1 {
  const tables = {
    meta: [{ key: 'index_version', value: 0 }] as Row[],
    stores: [] as Row[],
    products: [] as Row[],
    favorites: [] as Row[],
    cart_items: [] as Row[],
  };

  function exec(sql: string, args: unknown[]) {
    const s = sql.trim().replace(/\s+/g, ' ');

    // meta: UPDATE ... value = value + 1
    if (/UPDATE meta SET value = value \+ 1/i.test(s)) {
      const m = tables.meta.find((r) => r.key === 'index_version')!;
      m.value = (m.value as number) + 1;
      return { kind: 'run' as const };
    }
    // meta: SELECT value FROM meta WHERE key = 'index_version'
    if (/SELECT value FROM meta WHERE key = \?/i.test(s)) {
      const r = tables.meta.find((x) => x.key === args[0]);
      return { kind: 'first' as const, row: r ? { value: r.value } : null };
    }
    // stores upsert (INSERT OR REPLACE INTO stores ...)
    if (/INSERT OR REPLACE INTO stores/i.test(s)) {
      const [slug, name, city, country, iban, iban_name, whatsapp, listed, lang, index_version, updated_at] = args;
      const i = tables.stores.findIndex((r) => r.slug === slug);
      const row = { slug, name, city, country, iban, iban_name, whatsapp, listed, lang, index_version, updated_at };
      if (i >= 0) tables.stores[i] = row; else tables.stores.push(row);
      return { kind: 'run' as const };
    }
    // products: DELETE FROM products WHERE store_slug = ?
    if (/DELETE FROM products WHERE store_slug = \?/i.test(s)) {
      tables.products = tables.products.filter((r) => r.store_slug !== args[0]);
      return { kind: 'run' as const };
    }
    // stores: DELETE FROM stores WHERE slug = ?
    if (/DELETE FROM stores WHERE slug = \?/i.test(s)) {
      tables.stores = tables.stores.filter((r) => r.slug !== args[0]);
      return { kind: 'run' as const };
    }
    // products insert
    if (/INSERT OR REPLACE INTO products/i.test(s)) {
      const [id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at] = args;
      tables.products.push({ id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at });
      return { kind: 'run' as const };
    }
    // products select all (filtreler marketplace.ts JS tarafında uygulanır — sahte tüm satırları döner)
    if (/SELECT .* FROM products/i.test(s)) {
      return { kind: 'all' as const, rows: [...tables.products] };
    }
    // stores select all
    if (/SELECT .* FROM stores/i.test(s)) {
      return { kind: 'all' as const, rows: tables.stores.filter((r) => (r.listed as number) === 1) };
    }
    // favorites: INSERT OR IGNORE
    if (/INSERT OR IGNORE INTO favorites/i.test(s)) {
      const [owner_key, store_slug, product_slug, created_at] = args;
      const exists = tables.favorites.some(
        (r) => r.owner_key === owner_key && r.store_slug === store_slug && r.product_slug === product_slug,
      );
      if (!exists) tables.favorites.push({ owner_key, store_slug, product_slug, created_at });
      return { kind: 'run' as const };
    }
    // favorites: DELETE one
    if (/DELETE FROM favorites WHERE owner_key = \? AND store_slug = \? AND product_slug = \?/i.test(s)) {
      tables.favorites = tables.favorites.filter(
        (r) => !(r.owner_key === args[0] && r.store_slug === args[1] && r.product_slug === args[2]),
      );
      return { kind: 'run' as const };
    }
    // favorites: SELECT product_slug WHERE owner_key + store_slug
    if (/SELECT product_slug FROM favorites WHERE owner_key = \? AND store_slug = \?/i.test(s)) {
      const rows = tables.favorites
        .filter((r) => r.owner_key === args[0] && r.store_slug === args[1])
        .map((r) => ({ product_slug: r.product_slug }));
      return { kind: 'all' as const, rows };
    }
    // cart_items: upsert (INSERT OR REPLACE)
    if (/INSERT OR REPLACE INTO cart_items/i.test(s)) {
      const [owner_key, store_slug, product_slug, qty, updated_at] = args;
      const i = tables.cart_items.findIndex(
        (r) => r.owner_key === owner_key && r.store_slug === store_slug && r.product_slug === product_slug,
      );
      const row = { owner_key, store_slug, product_slug, qty, updated_at };
      if (i >= 0) tables.cart_items[i] = row; else tables.cart_items.push(row);
      return { kind: 'run' as const };
    }
    // cart_items: DELETE one
    if (/DELETE FROM cart_items WHERE owner_key = \? AND store_slug = \? AND product_slug = \?/i.test(s)) {
      tables.cart_items = tables.cart_items.filter(
        (r) => !(r.owner_key === args[0] && r.store_slug === args[1] && r.product_slug === args[2]),
      );
      return { kind: 'run' as const };
    }
    // cart_items: DELETE all for owner+store (clear)
    if (/DELETE FROM cart_items WHERE owner_key = \? AND store_slug = \?$/i.test(s)) {
      tables.cart_items = tables.cart_items.filter(
        (r) => !(r.owner_key === args[0] && r.store_slug === args[1]),
      );
      return { kind: 'run' as const };
    }
    // cart_items: SELECT WHERE owner_key + store_slug
    if (/SELECT product_slug, qty FROM cart_items WHERE owner_key = \? AND store_slug = \?/i.test(s)) {
      const rows = tables.cart_items
        .filter((r) => r.owner_key === args[0] && r.store_slug === args[1])
        .map((r) => ({ product_slug: r.product_slug, qty: r.qty }));
      return { kind: 'all' as const, rows };
    }
    throw new Error('fakeD1: tanınmayan SQL: ' + s);
  }

  function stmt(sql: string, args: unknown[]) {
    return {
      first: async <T,>(_col?: string) => { const r = exec(sql, args); return (r.kind === 'first' ? r.row : null) as T | null; },
      all: async <T,>() => { const r = exec(sql, args); return { results: (r.kind === 'all' ? r.rows : []) as T[] }; },
      run: async () => { exec(sql, args); return { success: true }; },
    };
  }

  const db = {
    prepare(sql: string) {
      return {
        bind: (...args: unknown[]) => stmt(sql, args),
        first: async <T,>(c?: string) => stmt(sql, []).first<T>(c),
        all: async <T,>() => stmt(sql, []).all<T>(),
        run: async () => stmt(sql, []).run(),
      };
    },
    async batch(stmts: unknown[]) { return stmts.map(() => ({ success: true })); },
  };

  return { db, tables };
}

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
  tables: { meta: Row[]; stores: Row[]; products: Row[]; favorites: Row[]; cart_items: Row[]; orders: Row[]; companies: Row[]; memberships: Row[]; invites: Row[]; pool_projects: Row[]; pool_assets: Row[]; team_activity_log: Row[]; store_buyers: Row[]; store_buyer_transactions: Row[] };
}

export function makeFakeD1(): FakeD1 {
  const tables = {
    meta: [{ key: 'index_version', value: 0 }] as Row[],
    stores: [] as Row[],
    products: [] as Row[],
    favorites: [] as Row[],
    cart_items: [] as Row[],
    orders: [] as Row[],
    companies: [] as Row[],
    memberships: [] as Row[],
    invites: [] as Row[],
    pool_projects: [] as Row[],
    pool_assets: [] as Row[],
    team_activity_log: [] as Row[],
    store_buyers: [] as Row[],
    store_buyer_transactions: [] as Row[],
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
    // favorites/cart: çapraz-mağaza JOIN (market favori/sepet sayfası)
    if (/FROM (favorites|cart_items) \w+ LEFT JOIN products/i.test(s)) {
      const isCart = /FROM cart_items/i.test(s);
      const src = isCart ? tables.cart_items : tables.favorites;
      const rows = src
        .filter((r) => r.owner_key === args[0])
        .slice()
        .sort((a, b) => {
          const bySlug = String(a.store_slug).localeCompare(String(b.store_slug));
          if (bySlug !== 0) return bySlug;
          const ka = isCart ? 'updated_at' : 'created_at';
          return String(b[ka]).localeCompare(String(a[ka]));
        })
        .map((r) => {
          const p = tables.products.find((x) => x.id === `${r.store_slug}:${r.product_slug}`);
          const store = tables.stores.find((x) => x.slug === r.store_slug);
          return {
            store_slug: r.store_slug,
            product_slug: r.product_slug,
            ...(isCart ? { qty: r.qty } : {}),
            title: p?.title ?? null,
            price: p?.price ?? null,
            currency: p?.currency ?? null,
            stock: p?.stock ?? null,
            image_url: p?.image_url ?? null,
            product_path: p?.product_path ?? null,
            store_name: store?.name ?? null,
          };
        });
      return { kind: 'all' as const, rows };
    }
    // migration: favorites owner-only SELECT (store_slug, product_slug, created_at)
    if (/SELECT store_slug, product_slug, created_at FROM favorites WHERE owner_key = \?/i.test(s)) {
      const rows = tables.favorites
        .filter((r) => r.owner_key === args[0])
        .map((r) => ({ store_slug: r.store_slug, product_slug: r.product_slug, created_at: r.created_at }));
      return { kind: 'all' as const, rows };
    }
    // migration: favorites owner-only DELETE
    if (/DELETE FROM favorites WHERE owner_key = \?$/i.test(s)) {
      tables.favorites = tables.favorites.filter((r) => r.owner_key !== args[0]);
      return { kind: 'run' as const };
    }
    // migration: cart owner-only SELECT (store_slug, product_slug, qty, updated_at)
    if (/SELECT store_slug, product_slug, qty, updated_at FROM cart_items WHERE owner_key = \?/i.test(s)) {
      const rows = tables.cart_items
        .filter((r) => r.owner_key === args[0])
        .map((r) => ({ store_slug: r.store_slug, product_slug: r.product_slug, qty: r.qty, updated_at: r.updated_at }));
      return { kind: 'all' as const, rows };
    }
    // migration: cart INSERT OR IGNORE (çakışmada mevcut hedef korunur)
    if (/INSERT OR IGNORE INTO cart_items/i.test(s)) {
      const [owner_key, store_slug, product_slug, qty, updated_at] = args;
      const exists = tables.cart_items.some(
        (r) => r.owner_key === owner_key && r.store_slug === store_slug && r.product_slug === product_slug,
      );
      if (!exists) tables.cart_items.push({ owner_key, store_slug, product_slug, qty, updated_at });
      return { kind: 'run' as const };
    }
    // migration: cart owner-only DELETE
    if (/DELETE FROM cart_items WHERE owner_key = \?$/i.test(s)) {
      tables.cart_items = tables.cart_items.filter((r) => r.owner_key !== args[0]);
      return { kind: 'run' as const };
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
    // orders: INSERT INTO orders
    if (/INSERT INTO orders/i.test(s)) {
      const [id, owner_key, store_slug, store_name, items_json, item_count, total, currency, status, created_at] = args;
      tables.orders.push({ id, owner_key, store_slug, store_name, items_json, item_count, total, currency, status, created_at });
      return { kind: 'run' as const };
    }
    // orders: SELECT * WHERE owner_key ORDER BY created_at DESC
    if (/SELECT \* FROM orders WHERE owner_key = \? ORDER BY created_at DESC/i.test(s)) {
      const rows = tables.orders
        .filter((r) => r.owner_key === args[0])
        .slice()
        .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
      return { kind: 'all' as const, rows };
    }
    // companies: INSERT
    if (/INSERT INTO companies/i.test(s)) {
      const [id, name, owner_sub, created_at] = args;
      tables.companies.push({ id, name, owner_sub, created_at });
      return { kind: 'run' as const };
    }
    // companies: SELECT by id
    if (/SELECT .* FROM companies WHERE id = \?/i.test(s)) {
      const r = tables.companies.find((x) => x.id === args[0]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // memberships: INSERT
    if (/INSERT INTO memberships/i.test(s)) {
      const [company_id, user_sub, email, name, role, joined_at] = args;
      const i = tables.memberships.findIndex((r) => r.company_id === company_id && r.user_sub === user_sub);
      const row = { company_id, user_sub, email, name, role, joined_at };
      if (i >= 0) tables.memberships[i] = row; else tables.memberships.push(row);
      return { kind: 'run' as const };
    }
    // memberships: SELECT one by company + user
    if (/SELECT .* FROM memberships WHERE company_id = \? AND user_sub = \?/i.test(s)) {
      const r = tables.memberships.find((x) => x.company_id === args[0] && x.user_sub === args[1]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // memberships: SELECT all by user (me)
    if (/SELECT .* FROM memberships WHERE user_sub = \?/i.test(s)) {
      const rows = tables.memberships.filter((r) => r.user_sub === args[0]);
      return { kind: 'all' as const, rows };
    }
    // memberships: COUNT owners by company (roster SELECT'ten ÖNCE — regex anchor'sız)
    if (/SELECT COUNT\(\*\) AS n FROM memberships WHERE company_id = \? AND role = 'owner'/i.test(s)) {
      const n = tables.memberships.filter((r) => r.company_id === args[0] && r.role === 'owner').length;
      return { kind: 'first' as const, row: { n } };
    }
    // memberships: UPDATE role by company + user
    if (/UPDATE memberships SET role = \? WHERE company_id = \? AND user_sub = \?/i.test(s)) {
      const r = tables.memberships.find((x) => x.company_id === args[1] && x.user_sub === args[2]);
      if (r) r.role = args[0];
      return { kind: 'run' as const };
    }
    // memberships: UPDATE role literal (transfer-ownership: 'owner'/'admin')
    {
      const m = s.match(/UPDATE memberships SET role = '(owner|admin|employee)' WHERE company_id = \? AND user_sub = \?/i);
      if (m) {
        const r = tables.memberships.find((x) => x.company_id === args[0] && x.user_sub === args[1]);
        if (r) r.role = m[1];
        return { kind: 'run' as const };
      }
    }
    // companies: UPDATE owner_sub (transfer-ownership)
    if (/UPDATE companies SET owner_sub = \? WHERE id = \?/i.test(s)) {
      const c = tables.companies.find((x) => x.id === args[1]);
      if (c) c.owner_sub = args[0];
      return { kind: 'run' as const };
    }
    // cascade DELETE by company_id (delete-company): tek-kolon, anchor'lı
    {
      const m = s.match(/DELETE FROM (pool_assets|pool_projects|invites|memberships) WHERE company_id = \?\s*$/i);
      if (m) {
        const t = m[1] as 'pool_assets' | 'pool_projects' | 'invites' | 'memberships';
        tables[t] = (tables[t] as Row[]).filter((r) => r.company_id !== args[0]);
        return { kind: 'run' as const };
      }
    }
    // companies: DELETE by id (delete-company)
    if (/DELETE FROM companies WHERE id = \?/i.test(s)) {
      tables.companies = tables.companies.filter((r) => r.id !== args[0]);
      return { kind: 'run' as const };
    }
    // memberships: DELETE one by company + user
    if (/DELETE FROM memberships WHERE company_id = \? AND user_sub = \?/i.test(s)) {
      for (let i = tables.memberships.length - 1; i >= 0; i--) {
        if (tables.memberships[i].company_id === args[0] && tables.memberships[i].user_sub === args[1]) {
          tables.memberships.splice(i, 1);
        }
      }
      return { kind: 'run' as const };
    }
    // memberships: SELECT all by company (roster)
    if (/SELECT .* FROM memberships WHERE company_id = \?/i.test(s)) {
      const rows = tables.memberships.filter((r) => r.company_id === args[0]);
      return { kind: 'all' as const, rows };
    }
    // invites: INSERT
    if (/INSERT INTO invites/i.test(s)) {
      const [code, company_id, role, created_by, created_at, expires_at] = args;
      tables.invites.push({ code, company_id, role, created_by, created_at, expires_at, redeemed_by: null, redeemed_at: null });
      return { kind: 'run' as const };
    }
    // invites: SELECT by code
    if (/SELECT .* FROM invites WHERE code = \?/i.test(s)) {
      const r = tables.invites.find((x) => x.code === args[0]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // invites: mark redeemed (single-use guard: yalnızca redeemed_by IS NULL iken)
    if (/UPDATE invites SET redeemed_by = \?, redeemed_at = \? WHERE code = \? AND redeemed_by IS NULL/i.test(s)) {
      const inv = tables.invites.find((x) => x.code === args[2] && x.redeemed_by == null);
      if (inv) { inv.redeemed_by = args[0]; inv.redeemed_at = args[1]; }
      return { kind: 'run' as const };
    }
    // pool_projects: LWW upsert (ON CONFLICT ... WHERE excluded.modified_at >= mevcut)
    if (/INSERT INTO pool_projects/i.test(s)) {
      const [company_id, project_id, created_by, modified_at, deleted_at, snapshot] = args;
      const i = tables.pool_projects.findIndex((r) => r.company_id === company_id && r.project_id === project_id);
      if (i < 0) {
        tables.pool_projects.push({ company_id, project_id, created_by, modified_at, deleted_at, snapshot });
      } else if (String(modified_at) >= String(tables.pool_projects[i].modified_at)) {
        // created_by ilk yazanı korur (excluded.created_by ile değişmez)
        const keepCreatedBy = tables.pool_projects[i].created_by;
        tables.pool_projects[i] = { company_id, project_id, created_by: keepCreatedBy, modified_at, deleted_at, snapshot };
      }
      return { kind: 'run' as const };
    }
    // pool_projects: SELECT one
    if (/SELECT .* FROM pool_projects WHERE company_id = \? AND project_id = \?/i.test(s)) {
      const r = tables.pool_projects.find((x) => x.company_id === args[0] && x.project_id === args[1]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // pool_projects: delta SELECT (modified_at > since)
    if (/SELECT project_id, modified_at, deleted_at FROM pool_projects WHERE company_id = \? AND modified_at > \?/i.test(s)) {
      const rows = tables.pool_projects
        .filter((r) => r.company_id === args[0] && String(r.modified_at) > String(args[1]))
        .map((r) => ({ project_id: r.project_id, modified_at: r.modified_at, deleted_at: r.deleted_at }))
        .sort((a, b) => String(a.modified_at).localeCompare(String(b.modified_at)));
      return { kind: 'all' as const, rows };
    }
    // pool_projects: tombstone UPDATE
    if (/UPDATE pool_projects SET deleted_at = \?, modified_at = \? WHERE company_id = \? AND project_id = \?/i.test(s)) {
      const r = tables.pool_projects.find((x) => x.company_id === args[2] && x.project_id === args[3]);
      if (r) { r.deleted_at = args[0]; r.modified_at = args[1]; }
      return { kind: 'run' as const };
    }
    // pool_assets: LWW upsert
    if (/INSERT INTO pool_assets/i.test(s)) {
      const [company_id, project_id, asset_id, r2_key, created_by, modified_at, deleted_at, snapshot] = args;
      const i = tables.pool_assets.findIndex((r) => r.company_id === company_id && r.project_id === project_id && r.asset_id === asset_id);
      if (i < 0) {
        tables.pool_assets.push({ company_id, project_id, asset_id, r2_key, created_by, modified_at, deleted_at, snapshot });
      } else if (String(modified_at) >= String(tables.pool_assets[i].modified_at)) {
        const keepCreatedBy = tables.pool_assets[i].created_by;
        tables.pool_assets[i] = { company_id, project_id, asset_id, r2_key, created_by: keepCreatedBy, modified_at, deleted_at, snapshot };
      }
      return { kind: 'run' as const };
    }
    // pool_assets: SELECT one
    if (/SELECT .* FROM pool_assets WHERE company_id = \? AND project_id = \? AND asset_id = \?/i.test(s)) {
      const r = tables.pool_assets.find((x) => x.company_id === args[0] && x.project_id === args[1] && x.asset_id === args[2]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // pool_assets: list by project
    if (/SELECT .* FROM pool_assets WHERE company_id = \? AND project_id = \?$/i.test(s)) {
      const rows = tables.pool_assets.filter((r) => r.company_id === args[0] && r.project_id === args[1]);
      return { kind: 'all' as const, rows };
    }
    // pool_assets: tombstone UPDATE
    if (/UPDATE pool_assets SET deleted_at = \?, modified_at = \? WHERE company_id = \? AND project_id = \? AND asset_id = \?/i.test(s)) {
      const r = tables.pool_assets.find((x) => x.company_id === args[2] && x.project_id === args[3] && x.asset_id === args[4]);
      if (r) { r.deleted_at = args[0]; r.modified_at = args[1]; }
      return { kind: 'run' as const };
    }
    // INSERT INTO team_activity_log
    if (/INSERT INTO team_activity_log/i.test(s)) {
      const [id, company_id, event_type, actor_sub, actor_email, target_sub, target_ref, meta, created_at] = args;
      tables.team_activity_log.push({ id, company_id, event_type, actor_sub, actor_email, target_sub, target_ref, meta, created_at });
      return { kind: 'run' as const };
    }
    // SELECT ... FROM team_activity_log WHERE company_id
    if (/SELECT .+ FROM team_activity_log WHERE company_id/i.test(s)) {
      // cursor varsa: args = [company_id, cursor, limit]
      // cursor yoksa: args = [company_id, limit]
      let company_id: string, cursor: string | undefined, limit: number;
      if (args.length === 3) {
        [company_id, cursor, limit] = args as [string, string, number];
      } else {
        [company_id, limit] = args as [string, number];
        cursor = undefined;
      }
      const all = tables.team_activity_log
        .filter((r) => r.company_id === company_id && (cursor == null || (r.created_at as string) < cursor))
        .sort((a, b) => ((b.created_at as string) > (a.created_at as string) ? 1 : -1))
        .slice(0, limit);
      return { kind: 'all' as const, rows: all };
    }
    // DELETE FROM team_activity_log WHERE created_at < ?
    if (/DELETE FROM team_activity_log WHERE created_at/i.test(s)) {
      const [before] = args as [string];
      tables.team_activity_log = tables.team_activity_log.filter((r) => (r.created_at as string) >= before);
      return { kind: 'run' as const };
    }
    // store_buyers: INSERT (unique constraint: store_slug + access_code)
    // SQL: INSERT INTO store_buyers (id, store_slug, buyer_name, access_code, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)
    // bind args: id, store_slug, buyer_name, access_code, created_at  (is_active is a literal 1 in SQL)
    if (/INSERT INTO store_buyers/i.test(s)) {
      const [id, store_slug, buyer_name, access_code, created_at] = args;
      const exists = tables.store_buyers.some(
        (r) => r.store_slug === store_slug && r.access_code === access_code,
      );
      if (exists) throw new Error('fakeD1: store_buyers UNIQUE constraint: store_slug+access_code');
      tables.store_buyers.push({ id, store_slug, buyer_name, access_code, is_active: 1, created_at });
      return { kind: 'run' as const };
    }
    // store_buyers: SELECT all for store, ordered by created_at DESC
    if (/SELECT .+ FROM store_buyers WHERE store_slug = \? ORDER BY created_at DESC/i.test(s)) {
      const rows = tables.store_buyers
        .filter((r) => r.store_slug === args[0])
        .slice()
        .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
      return { kind: 'all' as const, rows };
    }
    // store_buyers: SELECT one by store_slug + access_code + is_active = 1
    if (/SELECT .+ FROM store_buyers WHERE store_slug = \? AND access_code = \? AND is_active = 1/i.test(s)) {
      const r = tables.store_buyers.find(
        (x) => x.store_slug === args[0] && x.access_code === args[1] && (x.is_active as number) === 1,
      ) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // store_buyers: SELECT one by id + store_slug
    if (/SELECT .+ FROM store_buyers WHERE id = \? AND store_slug = \?/i.test(s)) {
      const r = tables.store_buyers.find(
        (x) => x.id === args[0] && x.store_slug === args[1],
      ) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // store_buyers: UPDATE is_active by id (e.g. SET is_active=0 WHERE id=?)
    if (/UPDATE store_buyers SET is_active=\d+ WHERE id=\?/i.test(s)) {
      const match = s.match(/SET is_active=(\d+)/i);
      const val = match ? parseInt(match[1], 10) : 0;
      const row = tables.store_buyers.find((x) => x.id === args[0]);
      if (row) row.is_active = val;
      return { kind: 'run' as const };
    }
    // store_buyers: DELETE by id + store_slug
    if (/DELETE FROM store_buyers WHERE id = \? AND store_slug = \?/i.test(s)) {
      tables.store_buyers = tables.store_buyers.filter(
        (r) => !(r.id === args[0] && r.store_slug === args[1]),
      );
      return { kind: 'run' as const };
    }
    // store_buyers: UPDATE balance
    if (/UPDATE store_buyers SET balance = balance \+ \? WHERE id = \? AND store_slug = \?/i.test(s)) {
      const delta = args[0] as number;
      const row = tables.store_buyers.find((x) => x.id === args[1] && x.store_slug === args[2]);
      if (row) row.balance = ((row.balance as number) ?? 0) + delta;
      return { kind: 'run' as const };
    }
    // store_buyers: SELECT balance WHERE id + store_slug
    if (/SELECT balance FROM store_buyers WHERE id = \? AND store_slug = \?/i.test(s)) {
      const r = tables.store_buyers.find((x) => x.id === args[0] && x.store_slug === args[1]) ?? null;
      return { kind: 'first' as const, row: r ? { balance: (r.balance as number) ?? 0 } : null };
    }
    // store_buyer_transactions: INSERT
    if (/INSERT INTO store_buyer_transactions/i.test(s)) {
      const [id, store_slug, buyer_id, type, amount, currency, description, order_ref, created_by, created_at] = args;
      tables.store_buyer_transactions.push({ id, store_slug, buyer_id, type, amount, currency, description, order_ref, created_by, created_at });
      return { kind: 'run' as const };
    }
    // store_buyer_transactions: SELECT WHERE store_slug + buyer_id ORDER BY created_at DESC
    if (/SELECT .+ FROM store_buyer_transactions WHERE store_slug = \? AND buyer_id = \? ORDER BY created_at DESC/i.test(s)) {
      const rows = tables.store_buyer_transactions
        .filter((r) => r.store_slug === args[0] && r.buyer_id === args[1])
        .slice()
        .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
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

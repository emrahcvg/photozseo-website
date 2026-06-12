import { describe, it, expect } from 'vitest';
import { addTransaction, listTransactions, getBuyerBalance } from './b2b-ledger';
import { addBuyer } from './b2b-buyers';
import { makeFakeD1 } from './fakeD1';

const NOW  = '2026-06-12T10:00:00Z';
const LATER = '2026-06-12T11:00:00Z';

async function setupBuyer(db: ReturnType<typeof makeFakeD1>['db']) {
  return addBuyer(db, 'test-store', 'Ahmet Ltd', 'AB2C3D', 'buyer-1', NOW);
}

describe('addTransaction + getBuyerBalance', () => {
  it('debit bakiyeyi artırır', async () => {
    const { db } = makeFakeD1();
    await setupBuyer(db);
    await addTransaction(db, { id:'tx-1', store_slug:'test-store', buyer_id:'buyer-1', type:'debit', amount:500, currency:'TRY', description:'Fatura #1', created_by:'seller', created_at:NOW });
    expect(await getBuyerBalance(db, 'test-store', 'buyer-1')).toBe(500);
  });

  it('credit bakiyeyi azaltır', async () => {
    const { db } = makeFakeD1();
    await setupBuyer(db);
    await addTransaction(db, { id:'tx-1', store_slug:'test-store', buyer_id:'buyer-1', type:'debit', amount:500, currency:'TRY', created_by:'seller', created_at:NOW });
    await addTransaction(db, { id:'tx-2', store_slug:'test-store', buyer_id:'buyer-1', type:'credit', amount:200, currency:'TRY', created_by:'seller', created_at:LATER });
    expect(await getBuyerBalance(db, 'test-store', 'buyer-1')).toBe(300);
  });

  it('order tipi debit gibi davranır', async () => {
    const { db } = makeFakeD1();
    await setupBuyer(db);
    await addTransaction(db, { id:'tx-1', store_slug:'test-store', buyer_id:'buyer-1', type:'order', amount:1200, currency:'TRY', order_ref:'ord-99', created_by:'system', created_at:NOW });
    expect(await getBuyerBalance(db, 'test-store', 'buyer-1')).toBe(1200);
  });
});

describe('listTransactions', () => {
  it('ters kronolojik sıra', async () => {
    const { db } = makeFakeD1();
    await setupBuyer(db);
    await addTransaction(db, { id:'tx-1', store_slug:'test-store', buyer_id:'buyer-1', type:'debit', amount:100, currency:'TRY', description:'A', created_by:'seller', created_at:NOW });
    await addTransaction(db, { id:'tx-2', store_slug:'test-store', buyer_id:'buyer-1', type:'credit', amount:50, currency:'TRY', description:'B', created_by:'seller', created_at:LATER });
    const txns = await listTransactions(db, 'test-store', 'buyer-1');
    expect(txns[0].id).toBe('tx-2');
    expect(txns[1].id).toBe('tx-1');
  });

  it('işlemler alıcıya göre izole', async () => {
    const { db } = makeFakeD1();
    await addBuyer(db, 'test-store', 'A', 'AA1111', 'buyer-a', NOW);
    await addBuyer(db, 'test-store', 'B', 'BB2222', 'buyer-b', NOW);
    await addTransaction(db, { id:'tx-1', store_slug:'test-store', buyer_id:'buyer-a', type:'debit', amount:100, currency:'TRY', created_by:'seller', created_at:NOW });
    expect(await listTransactions(db, 'test-store', 'buyer-b')).toHaveLength(0);
  });
});

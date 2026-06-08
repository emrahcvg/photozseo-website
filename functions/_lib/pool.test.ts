import { describe, it, expect } from 'vitest';
import { makeFakeD1 } from './fakeD1';
import { upsertProject, getProject, projectsSince, tombstoneProject } from './pool';

const C = 'c:co-1';

describe('pool projeler', () => {
  it('upsert + get', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-a', modifiedAt: '2026-06-08T00:00:00Z', snapshot: '{"name":"Ürün"}' });
    const got = await getProject(db, C, 'p1');
    expect(got).toMatchObject({ project_id: 'p1', created_by: 'sub-a', snapshot: '{"name":"Ürün"}', deleted_at: null });
  });

  it('LWW: eski modified_at yazmaz, yeni yazar', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"v":2}' });
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-b', modifiedAt: '2026-06-08T09:00:00Z', snapshot: '{"v":1}' }); // eski → yok sayılır
    expect((await getProject(db, C, 'p1'))!.snapshot).toBe('{"v":2}');
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-b', modifiedAt: '2026-06-08T11:00:00Z', snapshot: '{"v":3}' }); // yeni → yazar
    expect((await getProject(db, C, 'p1'))!.snapshot).toBe('{"v":3}');
  });

  it('created_by ilk yazanı korur (update created_by değiştirmez)', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-b', modifiedAt: '2026-06-08T11:00:00Z', snapshot: '{}' });
    expect((await getProject(db, C, 'p1'))!.created_by).toBe('sub-a');
  });

  it('projectsSince delta — since sonrası, kronolojik', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'x', modifiedAt: '2026-06-08T08:00:00Z', snapshot: '{}' });
    await upsertProject(db, { companyId: C, projectId: 'p2', createdBy: 'x', modifiedAt: '2026-06-08T09:00:00Z', snapshot: '{}' });
    await upsertProject(db, { companyId: C, projectId: 'p3', createdBy: 'x', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    const delta = await projectsSince(db, C, '2026-06-08T08:30:00Z');
    expect(delta.map((d) => d.projectId)).toEqual(['p2', 'p3']);
  });

  it('tombstone — deleted_at set + delta içinde görünür', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'x', modifiedAt: '2026-06-08T08:00:00Z', snapshot: '{}' });
    await tombstoneProject(db, { companyId: C, projectId: 'p1', deletedAt: '2026-06-08T12:00:00Z', modifiedAt: '2026-06-08T12:00:00Z' });
    const got = await getProject(db, C, 'p1');
    expect(got!.deleted_at).toBe('2026-06-08T12:00:00Z');
    const delta = await projectsSince(db, C, '2026-06-08T11:00:00Z');
    expect(delta[0]).toMatchObject({ projectId: 'p1', deletedAt: '2026-06-08T12:00:00Z' });
  });

  it('şirket izolasyonu — başka şirketin projesi görünmez', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: 'c:other', projectId: 'p9', createdBy: 'x', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    expect(await getProject(db, C, 'p9')).toBeNull();
    expect(await projectsSince(db, C, '2026-06-08T00:00:00Z')).toEqual([]);
  });
});

import { upsertAsset, getAsset, listAssets, tombstoneAsset } from './pool';

describe('pool asset', () => {
  it('upsert + get + list', async () => {
    const { db } = makeFakeD1();
    await upsertAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', r2Key: 'companies/c:co-1/projects/p1/original/a1.jpg', createdBy: 'sub-a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"order":0}' });
    const got = await getAsset(db, C, 'p1', 'a1');
    expect(got).toMatchObject({ asset_id: 'a1', r2_key: 'companies/c:co-1/projects/p1/original/a1.jpg', deleted_at: null });
    const list = await listAssets(db, C, 'p1');
    expect(list).toHaveLength(1);
  });

  it('LWW eski yazmaz', async () => {
    const { db } = makeFakeD1();
    await upsertAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', r2Key: 'k', createdBy: 'a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"v":2}' });
    await upsertAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', r2Key: 'k', createdBy: 'a', modifiedAt: '2026-06-08T09:00:00Z', snapshot: '{"v":1}' });
    expect((await getAsset(db, C, 'p1', 'a1'))!.snapshot).toBe('{"v":2}');
  });

  it('tombstone', async () => {
    const { db } = makeFakeD1();
    await upsertAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', r2Key: 'k', createdBy: 'a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    await tombstoneAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', deletedAt: '2026-06-08T12:00:00Z', modifiedAt: '2026-06-08T12:00:00Z' });
    expect((await getAsset(db, C, 'p1', 'a1'))!.deleted_at).toBe('2026-06-08T12:00:00Z');
  });
});

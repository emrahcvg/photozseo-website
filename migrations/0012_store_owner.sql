-- Migration 0012: stores tablosuna owner_sub kolonu (B2 Faz B sahiplik)
-- Faz-1 geriye uyumlu: kolon NULL'lanabilir; mevcut anonim mağazalar owner_sub=NULL kalır.
-- Sadece Google oturumlu (kind='session') claim'lerde owner_sub = session.sub yazılır.
ALTER TABLE stores ADD COLUMN owner_sub TEXT;

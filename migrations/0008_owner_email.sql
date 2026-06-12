-- Migration 0008: stores tablosuna owner_email kolonu
ALTER TABLE stores ADD COLUMN owner_email TEXT;

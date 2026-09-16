-- =======================================================
-- SISTEM GUDANG KAIN - DATABASE SCHEMA (MIGRATION 00)
-- =======================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TYPE ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'viewer');
CREATE TYPE transaction_type AS ENUM ('masuk', 'keluar', 'penyesuaian');
CREATE TYPE transaction_status AS ENUM ('draft', 'selesai', 'dibatalkan');
CREATE TYPE delivery_direction AS ENUM ('keluar', 'masuk');
CREATE TYPE delivery_status AS ENUM ('draft', 'diterbitkan', 'dalam_pengiriman', 'diterima', 'ditolak_sebagian', 'dibatalkan');

-- 1. BUSINESS_INFO (Single row setting)
CREATE TABLE IF NOT EXISTS business_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_bisnis VARCHAR(255) NOT NULL DEFAULT 'Gudang Kain Jaya',
  logo_url TEXT,
  alamat TEXT,
  kota VARCHAR(100),
  provinsi VARCHAR(100),
  kode_pos VARCHAR(20),
  telepon VARCHAR(50),
  email VARCHAR(100),
  npwp VARCHAR(50),
  website VARCHAR(100),
  catatan_footer TEXT DEFAULT 'Barang yang sudah diterima sesuai surat jalan tidak dapat dikembalikan tanpa persetujuan tertulis.',
  allow_negative_stock BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES (Jenis Kain)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  warna_label VARCHAR(20) DEFAULT '#6C5CE7',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. UNITS (Satuan Kain)
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(50) NOT NULL,
  simbol VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 4. SUPPLIERS
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(150) NOT NULL,
  kontak_person VARCHAR(100),
  telepon VARCHAR(50),
  email VARCHAR(100),
  alamat TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 5. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(150) NOT NULL,
  kontak_person VARCHAR(100),
  telepon VARCHAR(50),
  email VARCHAR(100),
  alamat TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 6. PRODUCTS (Master Kain)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  nama VARCHAR(200) NOT NULL,
  category_id UUID REFERENCES categories(id),
  unit_id UUID REFERENCES units(id),
  warna VARCHAR(100) NOT NULL,
  kode_warna VARCHAR(20),
  lebar_kain_cm NUMERIC(10,2),
  gramasi NUMERIC(10,2),
  komposisi VARCHAR(150),
  harga_beli NUMERIC(15,2) DEFAULT 0,
  harga_jual NUMERIC(15,2) DEFAULT 0,
  stok_saat_ini NUMERIC(12,2) DEFAULT 0,
  stok_minimum NUMERIC(12,2) DEFAULT 10,
  lokasi_rak VARCHAR(100),
  foto_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 7. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_transaksi VARCHAR(100) UNIQUE NOT NULL,
  tipe transaction_type NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_id UUID REFERENCES suppliers(id),
  customer_id UUID REFERENCES customers(id),
  nomor_referensi VARCHAR(100),
  keterangan TEXT,
  total_nilai NUMERIC(15,2) DEFAULT 0,
  status transaction_status DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TRANSACTION_ITEMS
CREATE TABLE IF NOT EXISTS transaction_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  qty NUMERIC(12,2) NOT NULL DEFAULT 0,
  qty_surat_jalan NUMERIC(12,2) DEFAULT 0,
  qty_aktual NUMERIC(12,2) DEFAULT 0,
  qty_retur NUMERIC(12,2) DEFAULT 0,
  harga_satuan NUMERIC(15,2) DEFAULT 0,
  subtotal NUMERIC(15,2) DEFAULT 0,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DELIVERY_NOTES (Surat Jalan)
CREATE TABLE IF NOT EXISTS delivery_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_surat_jalan VARCHAR(100),
  arah delivery_direction NOT NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  tanggal_kirim DATE,
  tanggal_terima DATE,
  customer_id UUID REFERENCES customers(id),
  supplier_id UUID REFERENCES suppliers(id),
  nomor_sj_pemasok VARCHAR(100),
  nama_penerima VARCHAR(150),
  alamat_tujuan TEXT,
  telepon_tujuan VARCHAR(50),
  nama_sopir VARCHAR(100),
  nomor_kendaraan VARCHAR(50),
  ekspedisi VARCHAR(100),
  jumlah_koli INT DEFAULT 1,
  keterangan TEXT,
  status delivery_status DEFAULT 'draft',
  file_scan_url TEXT,
  ttd_penerima_url TEXT,
  created_by UUID,
  diterbitkan_at TIMESTAMPTZ,
  diterbitkan_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_sj_keluar UNIQUE (nomor_surat_jalan),
  CONSTRAINT unique_sj_pemasok UNIQUE (supplier_id, nomor_sj_pemasok)
);

-- 10. DELIVERY_NOTE_STATUS_LOGS
CREATE TABLE IF NOT EXISTS delivery_note_status_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_note_id UUID REFERENCES delivery_notes(id) ON DELETE CASCADE,
  status_lama delivery_status,
  status_baru delivery_status NOT NULL,
  catatan TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STOCK_MOVEMENTS (Kartu Stok / Ledger Immutable)
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) NOT NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  tanggal TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tipe transaction_type NOT NULL,
  qty_masuk NUMERIC(12,2) DEFAULT 0,
  qty_keluar NUMERIC(12,2) DEFAULT 0,
  stok_sebelum NUMERIC(12,2) NOT NULL,
  stok_sesudah NUMERIC(12,2) NOT NULL,
  keterangan TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PROFILES (Supabase Auth reference)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  nama_lengkap VARCHAR(150) NOT NULL,
  role user_role DEFAULT 'staff',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  aksi VARCHAR(100) NOT NULL,
  tabel VARCHAR(100) NOT NULL,
  record_id UUID,
  data_lama JSONB,
  data_baru JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR SPEED
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_transactions_tipe ON transactions(tipe);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_stock_movements_prod ON stock_movements(product_id, tanggal);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_sj ON delivery_notes(nomor_surat_jalan);

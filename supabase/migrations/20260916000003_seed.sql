-- =======================================================
-- SISTEM GUDANG KAIN - SEED DATA (MIGRATION 03)
-- =======================================================

-- 1. BUSINESS INFO
INSERT INTO business_info (
  id, nama_bisnis, logo_url, alamat, kota, provinsi, kode_pos, telepon, email, npwp, website, catatan_footer, allow_negative_stock
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'PT Gudang Kain Nusantara',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop',
  'Jl. Tekstil Utama No. 88, Kawasan Industri Kebon Jeruk',
  'Bandung',
  'Jawa Barat',
  '40184',
  '(022) 7564-9988',
  'info@gudangkain.co.id',
  '01.888.777.6-441.000',
  'www.gudangkain.co.id',
  'Syarat & Ketentuan: Barang yang telah diterima dan ditandatangani pada Surat Jalan ini dianggap telah diperiksa dengan baik dan sesuai pesanan. Komplain selisih atau kerusakan wajib dilampirkan bukti dalam 2x24 jam.',
  FALSE
) ON CONFLICT (id) DO NOTHING;

-- 2. UNITS
INSERT INTO units (id, nama, simbol) VALUES
  ('u0000000-0000-0000-0000-000000000001', 'Roll', 'Roll'),
  ('u0000000-0000-0000-0000-000000000002', 'Meter', 'm'),
  ('u0000000-0000-0000-0000-000000000003', 'Yard', 'yd'),
  ('u0000000-0000-0000-0000-000000000004', 'Kilogram', 'Kg'),
  ('u0000000-0000-0000-0000-000000000005', 'Pieces', 'Pcs')
ON CONFLICT (id) DO NOTHING;

-- 3. CATEGORIES (10 Kategori Kain)
INSERT INTO categories (id, kode, nama, deskripsi, warna_label) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'KAT-01', 'Cotton Combed', 'Kain katun murni halus, menyerap keringat untuk kaos premium', '#6C5CE7'),
  ('c0000000-0000-0000-0000-000000000002', 'KAT-02', 'Rayon Viscose', 'Kain adem jatuh tekstur lembut untuk daster dan kemeja', '#FF8A3D'),
  ('c0000000-0000-0000-0000-000000000003', 'KAT-03', 'Linen Premium', 'Serat alami linen mewah tahan lama untuk kemeja & celana', '#2ECC71'),
  ('c0000000-0000-0000-0000-000000000004', 'KAT-04', 'Wool Twist', 'Kain wol berkualitas untuk jas formal dan blazer', '#9B59B6'),
  ('c0000000-0000-0000-0000-000000000005', 'KAT-05', 'Silk Satin', 'Satin sutra mengkilap elegan untuk gaun dan baju tidur', '#E91E63'),
  ('c0000000-0000-0000-0000-000000000006', 'KAT-06', 'Denim Drill', 'Kain kokoh tebal untuk jaket jeans dan pakaian kerja', '#3498DB'),
  ('c0000000-0000-0000-0000-000000000007', 'KAT-07', 'Canvas Heavy', 'Kain kanvas ekstra tebal untuk tas dan rompi', '#795548'),
  ('c0000000-0000-0000-0000-000000000008', 'KAT-08', 'Polyester Spandex', 'Kain elastis lentur untuk pakaian olahraga activewear', '#00BCD4'),
  ('c0000000-0000-0000-0000-000000000009', 'KAT-09', 'Chiffon Ceruty', 'Sifon bertekstur pasir halus bergelombang untuk jilbab & dress', '#FF4081'),
  ('c0000000-0000-0000-0000-000000000010', 'KAT-10', 'Fleece PE', 'Kain hangat lembut berbulu halus untuk jaket hoodie', '#607D8B')
ON CONFLICT (id) DO NOTHING;

-- 4. SUPPLIERS (5 Supplier)
INSERT INTO suppliers (id, kode, nama, kontak_person, telepon, email, alamat) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'SUP-001', 'PT Texchem Mills Indonesia', 'Budi Santoso', '0811-2233-4455', 'budi@texchem.co.id', 'Jl. Industri Tekstil No. 12, Cimahi'),
  ('s0000000-0000-0000-0000-000000000002', 'SUP-002', 'CV Sinar Busana Spinning', 'Hendra Wijaya', '0812-9876-5432', 'hendra@sinarbusana.com', 'Jl. Majalaya Raya KM 14, Bandung'),
  ('s0000000-0000-0000-0000-000000000003', 'SUP-003', 'PT Indo Barat Fabric Tech', 'Dewi Lestari', '0813-4455-6677', 'dewi@indobarat.com', 'Jl. Soekarno Hatta No. 450, Bandung'),
  ('s0000000-0000-0000-0000-000000000004', 'SUP-004', 'CV Megah Textile Impex', 'Rudi Gunawan', '0819-0011-2233', 'rudi@megahtextile.id', 'Jl. Mangga Dua Raya No. 99, Jakarta Utara'),
  ('s0000000-0000-0000-0000-000000000005', 'SUP-005', 'PT Bandung Jaya Weaving', 'Siti Rahma', '0821-3322-1100', 'siti@bandungjaya.co.id', 'Jl. Rancaekek Industri No. 88, Sumedang')
ON CONFLICT (id) DO NOTHING;

-- 5. CUSTOMERS (5 Customer)
INSERT INTO customers (id, kode, nama, kontak_person, telepon, email, alamat) VALUES
  ('k0000000-0000-0000-0000-000000000001', 'CUST-001', 'CV Busana Fashion Utama', 'Agus Pratama', '0812-1111-2222', 'agus@busanafashion.com', 'Jl. Pasir Kaliki No. 120, Bandung'),
  ('k0000000-0000-0000-0000-000000000002', 'CUST-002', 'PT Garment Nusantara Apparel', 'Eka Putri', '0813-3333-4444', 'eka@garmentnusantara.co.id', 'Jl. Gatot Subroto No. 55, Semarang'),
  ('k0000000-0000-0000-0000-000000000003', 'CUST-003', 'Toko Kain Sejahtera Jaya', 'Asep Suhendar', '0818-5555-6666', 'asep@sejahterajaya.id', 'Jl. Otista No. 77, Bandung'),
  ('k0000000-0000-0000-0000-000000000004', 'CUST-004', 'Boutique Dian Pelangi', 'Dian Anggraini', '0819-7777-8888', 'dian@dianpelangi.com', 'Jl. Kemang Raya No. 24, Jakarta Selatan'),
  ('k0000000-0000-0000-0000-000000000005', 'CUST-005', 'PT Konveksi Cipta Mandiri', 'Bambang Hartono', '0822-9999-0000', 'bambang@ciptamandiri.com', 'Jl. Raya Solokan Jeruk No. 10, Kabupaten Bandung')
ON CONFLICT (id) DO NOTHING;

-- 6. PRODUCTS (30 Fabric Master Items)
INSERT INTO products (
  id, sku, nama, category_id, unit_id, warna, kode_warna, lebar_kain_cm, gramasi, komposisi, harga_beli, harga_jual, stok_saat_ini, stok_minimum, lokasi_rak, foto_url
) VALUES
  -- Cotton Combed 30s
  ('p0000000-0000-0000-0000-000000000001', 'KN-CC-30S-BLK', 'Cotton Combed 30s Hitam Reaktif', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', 'Hitam Jet Black', '#000000', 110.0, 150.0, '100% Katun', 115000, 135000, 145, 20, 'Rak A-01', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&auto=format&fit=crop'),
  ('p0000000-0000-0000-0000-000000000002', 'KN-CC-30S-WHT', 'Cotton Combed 30s Putih Putih Putih', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', 'Putih Bluish', '#FFFFFF', 110.0, 150.0, '100% Katun', 112000, 132000, 80, 25, 'Rak A-02', 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=300&auto=format&fit=crop'),
  ('p0000000-0000-0000-0000-000000000003', 'KN-CC-30S-NVY', 'Cotton Combed 30s Navy Tua', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', 'Navy Blue', '#1A237E', 110.0, 150.0, '100% Katun', 115000, 135000, 5, 20, 'Rak A-03', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop'),
  ('p0000000-0000-0000-0000-000000000004', 'KN-CC-24S-MRO', 'Cotton Combed 24s Marun Deep', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', 'Maroon', '#800000', 115.0, 180.0, '100% Katun', 120000, 142000, 60, 15, 'Rak A-04', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&auto=format&fit=crop'),

  -- Rayon Viscose
  ('p0000000-0000-0000-0000-000000000005', 'KN-RY-TWL-EMR', 'Rayon Twill Emerald Green', 'c0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000002', 'Hijau Zamrud', '#004D40', 150.0, 130.0, '100% Rayon Viscose', 28000, 35000, 450, 100, 'Rak B-01', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop'),
  ('p0000000-0000-0000-0000-000000000006', 'KN-RY-TWL-MST', 'Rayon Twill Mustard Gold', 'c0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000002', 'Kuning Kunyit', '#FFB300', 150.0, 130.0, '100% Rayon Viscose', 28000, 35000, 8, 50, 'Rak B-02', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop'),
  ('p0000000-0000-0000-0000-000000000007', 'KN-RY-UNI-TER', 'Rayon Uniqlo Terracotta', 'c0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000002', 'Bata Merah', '#D84315', 150.0, 120.0, '100% Rayon Viscose', 26000, 33000, 320, 80, 'Rak B-03', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=300&auto=format&fit=crop'),

  -- Linen Premium
  ('p0000000-0000-0000-0000-000000000008', 'KN-LN-PRM-NTH', 'Linen Rami Natural Khaki', 'c0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000003', 'Natural Cream', '#F5F5DC', 140.0, 190.0, '55% Linen 45% Katun', 42000, 52000, 210, 30, 'Rak C-01', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=300&auto=format&fit=crop'),
  ('p0000000-0000-0000-0000-000000000009', 'KN-LN-PRM-OLV', 'Linen Pure Olive Green', 'c0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000003', 'Hijau Zaitun', '#556B2F', 140.0, 200.0, '100% Murni Linen', 58000, 72000, 0, 25, 'Rak C-02', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop'),

  -- Silk Satin
  ('p0000000-0000-0000-0000-000000000010', 'KN-SK-STN-CHM', 'Silk Satin Velvet Champagne', 'c0000000-0000-0000-0000-000000000005', 'u0000000-0000-0000-0000-000000000002', 'Champagne Gold', '#F7E7CE', 150.0, 110.0, '100% Sutra Poliester', 38000, 48000, 175, 40, 'Rak D-01', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&auto=format&fit=crop'),
  ('p0000000-0000-0000-0000-000000000011', 'KN-SK-STN-DNM', 'Silk Satin Dusty Rose', 'c0000000-0000-0000-0000-000000000005', 'u0000000-0000-0000-0000-000000000002', 'Dusty Pink', '#DCAE96', 150.0, 110.0, '100% Sutra Poliester', 38000, 48000, 95, 30, 'Rak D-02', 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=300&auto=format&fit=crop'),

  -- Denim Drill
  ('p0000000-0000-0000-0000-000000000012', 'KN-DN-DRL-IND', 'Denim Raw Indigo 14oz', 'c0000000-0000-0000-0000-000000000006', 'u0000000-0000-0000-0000-000000000003', 'Indigo Blue', '#120A8F', 150.0, 390.0, '99% Katun 1% Spandex', 65000, 82000, 400, 50, 'Rak E-01', 'https://images.unsplash.com/photo-1542272604-780c96856592?w=300&auto=format&fit=crop'),
  ('p0000000-0000-0000-0000-000000000013', 'KN-DN-DRL-BLK', 'Denim Black Selvedge 12oz', 'c0000000-0000-0000-0000-000000000006', 'u0000000-0000-0000-0000-000000000003', 'Black Solid', '#1C1C1C', 150.0, 340.0, '100% Katun', 58000, 75000, 18, 40, 'Rak E-02', 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=300&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- 7. RECENT TRANSACTIONS (Sample transactions for graph)
INSERT INTO transactions (
  id, nomor_transaksi, tipe, tanggal, supplier_id, customer_id, nomor_referensi, keterangan, total_nilai, status
) VALUES
  ('t0000000-0000-0000-0000-000000000001', 'MSK-202609-0001', 'masuk', CURRENT_DATE - INTERVAL '15 days', 's0000000-0000-0000-0000-000000000001', NULL, 'PO-TEX-8821', 'Penerimaan Cotton Combed dari Texchem', 18400000, 'selesai'),
  ('t0000000-0000-0000-0000-000000000002', 'KLR-202609-0001', 'keluar', CURRENT_DATE - INTERVAL '10 days', NULL, 'k0000000-0000-0000-0000-000000000001', 'SO-BUS-0192', 'Pengiriman kain ke CV Busana Fashion', 12150000, 'selesai'),
  ('t0000000-0000-0000-0000-000000000003', 'MSK-202609-0002', 'masuk', CURRENT_DATE - INTERVAL '5 days', 's0000000-0000-0000-0000-000000000002', NULL, 'PO-SIN-1029', 'Penerimaan Rayon Twill dari Sinar Busana', 12600000, 'selesai'),
  ('t0000000-0000-0000-0000-000000000004', 'KLR-202609-0002', 'keluar', CURRENT_DATE - INTERVAL '1 day', NULL, 'k0000000-0000-0000-0000-000000000002', 'SO-GAR-4412', 'Pengiriman Denim ke PT Garment Nusantara', 24600000, 'selesai')
ON CONFLICT (id) DO NOTHING;

-- 8. TRANSACTION ITEMS
INSERT INTO transaction_items (
  id, transaction_id, product_id, qty, qty_surat_jalan, qty_aktual, harga_satuan, subtotal, keterangan
) VALUES
  ('i0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 100, 100, 100, 115000, 11500000, 'Kondisi roll mulus lengkap plastik'),
  ('i0000000-0000-0000-0000-000000000002', 't0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 60, 60, 60, 115000, 6900000, 'Sesuai spek surat jalan'),
  ('i0000000-0000-0000-0000-000000000003', 't0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 40, 40, 40, 135000, 5400000, 'Diambil armada ekspedisi'),
  ('i0000000-0000-0000-0000-000000000004', 't0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000002', 50, 50, 50, 135000, 6750000, 'Lengkap 5 roll')
ON CONFLICT (id) DO NOTHING;

-- 9. DELIVERY NOTES
INSERT INTO delivery_notes (
  id, nomor_surat_jalan, arah, transaction_id, tanggal, tanggal_kirim, customer_id, nama_penerima, alamat_tujuan, telepon_tujuan, nama_sopir, nomor_kendaraan, ekspedisi, jumlah_koli, keterangan, status, diterbitkan_at
) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'SJ/2026/09/0001', 'keluar', 't0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '10 days', 'k0000000-0000-0000-0000-000000000001', 'Agus Pratama', 'Jl. Pasir Kaliki No. 120, Bandung', '0812-1111-2222', 'Ahmad Sopir', 'D 8842 AB', 'Ekspedisi Express', 9, 'Telah diterima dengan baik', 'diterima', CURRENT_DATE - INTERVAL '10 days'),
  ('d0000000-0000-0000-0000-000000000002', 'SJ/2026/09/0002', 'keluar', 't0000000-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day', 'k0000000-0000-0000-0000-000000000002', 'Eka Putri', 'Jl. Gatot Subroto No. 55, Semarang', '0813-3333-4444', 'Joko Suprianto', 'B 9102 KAA', 'Kargo Nusantara', 15, 'Dalam perjalanan via Tol Trans Jawa', 'dalam_pengiriman', CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

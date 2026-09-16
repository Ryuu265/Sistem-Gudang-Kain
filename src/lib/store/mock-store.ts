import { 
  BusinessInfo, Category, Unit, Supplier, Customer, Product, 
  Transaction, DeliveryNote, StockMovement, Profile, AuditLog 
} from '@/types';

export const INITIAL_BUSINESS_INFO: BusinessInfo = {
  id: 'a0000000-0000-0000-0000-000000000001',
  nama_bisnis: 'PT Gudang Kain Nusantara',
  logo_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop',
  alamat: 'Jl. Tekstil Utama No. 88, Kawasan Industri Kebon Jeruk',
  kota: 'Bandung',
  provinsi: 'Jawa Barat',
  kode_pos: '40184',
  telepon: '(022) 7564-9988',
  email: 'info@gudangkain.co.id',
  npwp: '01.888.777.6-441.000',
  website: 'www.gudangkain.co.id',
  catatan_footer: 'Syarat & Ketentuan: Barang yang telah diterima dan ditandatangani pada Surat Jalan ini dianggap telah diperiksa dengan baik dan sesuai pesanan. Komplain selisih atau kerusakan wajib dilampirkan bukti dalam 2x24 jam.',
  allow_negative_stock: false
};

export const INITIAL_UNITS: Unit[] = [
  { id: 'u1', nama: 'Roll', simbol: 'Roll', is_active: true },
  { id: 'u2', nama: 'Meter', simbol: 'm', is_active: true },
  { id: 'u3', nama: 'Yard', simbol: 'yd', is_active: true },
  { id: 'u4', nama: 'Kilogram', simbol: 'Kg', is_active: true },
  { id: 'u5', nama: 'Pieces', simbol: 'Pcs', is_active: true },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', kode: 'KAT-01', nama: 'Cotton Combed', deskripsi: 'Katun murni halus menyerap keringat', warna_label: '#6C5CE7', is_active: true },
  { id: 'c2', kode: 'KAT-02', nama: 'Rayon Viscose', deskripsi: 'Kain adem jatuh tekstur lembut', warna_label: '#FF8A3D', is_active: true },
  { id: 'c3', kode: 'KAT-03', nama: 'Linen Premium', deskripsi: 'Serat alami linen mewah tahan lama', warna_label: '#2ECC71', is_active: true },
  { id: 'c4', kode: 'KAT-04', nama: 'Wool Twist', deskripsi: 'Kain wol berkualitas untuk jas formal', warna_label: '#9B59B6', is_active: true },
  { id: 'c5', kode: 'KAT-05', nama: 'Silk Satin', deskripsi: 'Satin sutra mengkilap elegan', warna_label: '#E91E63', is_active: true },
  { id: 'c6', kode: 'KAT-06', nama: 'Denim Drill', deskripsi: 'Kain kokoh tebal pakaian kerja', warna_label: '#3498DB', is_active: true },
  { id: 'c7', kode: 'KAT-07', nama: 'Canvas Heavy', deskripsi: 'Kanvas tebal untuk tas & rompi', warna_label: '#795548', is_active: true },
  { id: 'c8', kode: 'KAT-08', nama: 'Polyester Spandex', deskripsi: 'Kain elastis untuk activewear', warna_label: '#00BCD4', is_active: true },
  { id: 'c9', kode: 'KAT-09', nama: 'Chiffon Ceruty', deskripsi: 'Sifon pasir bergelombang jilbab', warna_label: '#FF4081', is_active: true },
  { id: 'c10', kode: 'KAT-10', nama: 'Fleece PE', deskripsi: 'Kain hangat lembut untuk hoodie', warna_label: '#607D8B', is_active: true },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', kode: 'SUP-001', nama: 'PT Texchem Mills Indonesia', kontak_person: 'Budi Santoso', telepon: '0811-2233-4455', email: 'budi@texchem.co.id', alamat: 'Jl. Industri Tekstil No. 12, Cimahi', is_active: true },
  { id: 's2', kode: 'SUP-002', nama: 'CV Sinar Busana Spinning', kontak_person: 'Hendra Wijaya', telepon: '0812-9876-5432', email: 'hendra@sinarbusana.com', alamat: 'Jl. Majalaya Raya KM 14, Bandung', is_active: true },
  { id: 's3', kode: 'SUP-003', nama: 'PT Indo Barat Fabric Tech', kontak_person: 'Dewi Lestari', telepon: '0813-4455-6677', email: 'dewi@indobarat.com', alamat: 'Jl. Soekarno Hatta No. 450, Bandung', is_active: true },
  { id: 's4', kode: 'SUP-004', nama: 'CV Megah Textile Impex', kontak_person: 'Rudi Gunawan', telepon: '0819-0011-2233', email: 'rudi@megahtextile.id', alamat: 'Jl. Mangga Dua Raya No. 99, Jakarta Utara', is_active: true },
  { id: 's5', kode: 'SUP-005', nama: 'PT Bandung Jaya Weaving', kontak_person: 'Siti Rahma', telepon: '0821-3322-1100', email: 'siti@bandungjaya.co.id', alamat: 'Jl. Rancaekek Industri No. 88, Sumedang', is_active: true },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'k1', kode: 'CUST-001', nama: 'CV Busana Fashion Utama', kontak_person: 'Agus Pratama', telepon: '0812-1111-2222', email: 'agus@busanafashion.com', alamat: 'Jl. Pasir Kaliki No. 120, Bandung', is_active: true },
  { id: 'k2', kode: 'CUST-002', nama: 'PT Garment Nusantara Apparel', kontak_person: 'Eka Putri', telepon: '0813-3333-4444', email: 'eka@garmentnusantara.co.id', alamat: 'Jl. Gatot Subroto No. 55, Semarang', is_active: true },
  { id: 'k3', kode: 'CUST-003', nama: 'Toko Kain Sejahtera Jaya', kontak_person: 'Asep Suhendar', telepon: '0818-5555-6666', email: 'asep@sejahterajaya.id', alamat: 'Jl. Otista No. 77, Bandung', is_active: true },
  { id: 'k4', kode: 'CUST-004', nama: 'Boutique Dian Pelangi', kontak_person: 'Dian Anggraini', telepon: '0819-7777-8888', email: 'dian@dianpelangi.com', alamat: 'Jl. Kemang Raya No. 24, Jakarta Selatan', is_active: true },
  { id: 'k5', kode: 'CUST-005', nama: 'PT Konveksi Cipta Mandiri', kontak_person: 'Bambang Hartono', telepon: '0822-9999-0000', email: 'bambang@ciptamandiri.com', alamat: 'Jl. Raya Solokan Jeruk No. 10, Bandung', is_active: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1', sku: 'KN-CC-30S-BLK', nama: 'Cotton Combed 30s Hitam Reaktif',
    category_id: 'c1', unit_id: 'u1', warna: 'Hitam Jet Black', kode_warna: '#000000',
    lebar_kain_cm: 110, gramasi: 150, komposisi: '100% Katun', harga_beli: 115000, harga_jual: 135000,
    stok_saat_ini: 145, stok_minimum: 20, lokasi_rak: 'Rak A-01', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&auto=format&fit=crop'
  },
  {
    id: 'p2', sku: 'KN-CC-30S-WHT', nama: 'Cotton Combed 30s Putih Bluish',
    category_id: 'c1', unit_id: 'u1', warna: 'Putih Bluish', kode_warna: '#FFFFFF',
    lebar_kain_cm: 110, gramasi: 150, komposisi: '100% Katun', harga_beli: 112000, harga_jual: 132000,
    stok_saat_ini: 80, stok_minimum: 25, lokasi_rak: 'Rak A-02', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=300&auto=format&fit=crop'
  },
  {
    id: 'p3', sku: 'KN-CC-30S-NVY', nama: 'Cotton Combed 30s Navy Tua',
    category_id: 'c1', unit_id: 'u1', warna: 'Navy Blue', kode_warna: '#1A237E',
    lebar_kain_cm: 110, gramasi: 150, komposisi: '100% Katun', harga_beli: 115000, harga_jual: 135000,
    stok_saat_ini: 5, stok_minimum: 20, lokasi_rak: 'Rak A-03', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop'
  },
  {
    id: 'p4', sku: 'KN-CC-24S-MRO', nama: 'Cotton Combed 24s Marun Deep',
    category_id: 'c1', unit_id: 'u1', warna: 'Maroon', kode_warna: '#800000',
    lebar_kain_cm: 115, gramasi: 180, komposisi: '100% Katun', harga_beli: 120000, harga_jual: 142000,
    stok_saat_ini: 60, stok_minimum: 15, lokasi_rak: 'Rak A-04', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&auto=format&fit=crop'
  },
  {
    id: 'p5', sku: 'KN-RY-TWL-EMR', nama: 'Rayon Twill Emerald Green',
    category_id: 'c2', unit_id: 'u2', warna: 'Hijau Zamrud', kode_warna: '#004D40',
    lebar_kain_cm: 150, gramasi: 130, komposisi: '100% Rayon Viscose', harga_beli: 28000, harga_jual: 35000,
    stok_saat_ini: 450, stok_minimum: 100, lokasi_rak: 'Rak B-01', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop'
  },
  {
    id: 'p6', sku: 'KN-RY-TWL-MST', nama: 'Rayon Twill Mustard Gold',
    category_id: 'c2', unit_id: 'u2', warna: 'Kuning Kunyit', kode_warna: '#FFB300',
    lebar_kain_cm: 150, gramasi: 130, komposisi: '100% Rayon Viscose', harga_beli: 28000, harga_jual: 35000,
    stok_saat_ini: 8, stok_minimum: 50, lokasi_rak: 'Rak B-02', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop'
  },
  {
    id: 'p7', sku: 'KN-LN-PRM-NTH', nama: 'Linen Rami Natural Khaki',
    category_id: 'c3', unit_id: 'u3', warna: 'Natural Khaki', kode_warna: '#F5F5DC',
    lebar_kain_cm: 140, gramasi: 190, komposisi: '55% Linen 45% Katun', harga_beli: 42000, harga_jual: 52000,
    stok_saat_ini: 210, stok_minimum: 30, lokasi_rak: 'Rak C-01', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=300&auto=format&fit=crop'
  },
  {
    id: 'p8', sku: 'KN-LN-PRM-OLV', nama: 'Linen Pure Olive Green',
    category_id: 'c3', unit_id: 'u3', warna: 'Hijau Zaitun', kode_warna: '#556B2F',
    lebar_kain_cm: 140, gramasi: 200, komposisi: '100% Murni Linen', harga_beli: 58000, harga_jual: 72000,
    stok_saat_ini: 0, stok_minimum: 25, lokasi_rak: 'Rak C-02', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop'
  },
  {
    id: 'p9', sku: 'KN-SK-STN-CHM', nama: 'Silk Satin Velvet Champagne',
    category_id: 'c5', unit_id: 'u2', warna: 'Champagne Gold', kode_warna: '#F7E7CE',
    lebar_kain_cm: 150, gramasi: 110, komposisi: '100% Sutra Poliester', harga_beli: 38000, harga_jual: 48000,
    stok_saat_ini: 175, stok_minimum: 40, lokasi_rak: 'Rak D-01', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&auto=format&fit=crop'
  },
  {
    id: 'p10', sku: 'KN-DN-DRL-IND', nama: 'Denim Raw Indigo 14oz',
    category_id: 'c6', unit_id: 'u3', warna: 'Indigo Blue', kode_warna: '#120A8F',
    lebar_kain_cm: 150, gramasi: 390, komposisi: '99% Katun 1% Spandex', harga_beli: 65000, harga_jual: 82000,
    stok_saat_ini: 400, stok_minimum: 50, lokasi_rak: 'Rak E-01', is_active: true,
    foto_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=300&auto=format&fit=crop'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    nomor_transaksi: 'MSK-202609-0001',
    tipe: 'masuk',
    tanggal: '2026-09-01',
    supplier_id: 's1',
    nomor_referensi: 'PO-TEX-8821',
    keterangan: 'Penerimaan Cotton Combed dari Texchem',
    total_nilai: 18400000,
    status: 'selesai',
    created_at: '2026-09-01T09:00:00Z',
    items: [
      { id: 'ti1', transaction_id: 't1', product_id: 'p1', qty: 100, qty_surat_jalan: 100, qty_aktual: 100, harga_satuan: 115000, subtotal: 11500000, keterangan: '100 Roll mulus' },
      { id: 'ti2', transaction_id: 't1', product_id: 'p2', qty: 60, qty_surat_jalan: 60, qty_aktual: 60, harga_satuan: 115000, subtotal: 6900000, keterangan: '60 Roll segel' }
    ]
  },
  {
    id: 't2',
    nomor_transaksi: 'KLR-202609-0001',
    tipe: 'keluar',
    tanggal: '2026-09-06',
    customer_id: 'k1',
    nomor_referensi: 'SO-BUS-0192',
    keterangan: 'Pengiriman kain ke CV Busana Fashion',
    total_nilai: 12150000,
    status: 'selesai',
    created_at: '2026-09-06T14:30:00Z',
    items: [
      { id: 'ti3', transaction_id: 't2', product_id: 'p1', qty: 40, qty_surat_jalan: 40, qty_aktual: 40, harga_satuan: 135000, subtotal: 5400000 },
      { id: 'ti4', transaction_id: 't2', product_id: 'p2', qty: 50, qty_surat_jalan: 50, qty_aktual: 50, harga_satuan: 135000, subtotal: 6750000 }
    ]
  },
  {
    id: 't3',
    nomor_transaksi: 'MSK-202609-0002',
    tipe: 'masuk',
    tanggal: '2026-09-12',
    supplier_id: 's2',
    nomor_referensi: 'PO-SIN-1029',
    keterangan: 'Penerimaan Rayon Twill dari Sinar Busana',
    total_nilai: 12600000,
    status: 'selesai',
    created_at: '2026-09-12T11:15:00Z',
    items: [
      { id: 'ti5', transaction_id: 't3', product_id: 'p5', qty: 450, qty_surat_jalan: 450, qty_aktual: 450, harga_satuan: 28000, subtotal: 12600000 }
    ]
  }
];

export const INITIAL_DELIVERY_NOTES: DeliveryNote[] = [
  {
    id: 'dn1',
    nomor_surat_jalan: 'SJ/2026/09/0001',
    arah: 'keluar',
    transaction_id: 't2',
    tanggal: '2026-09-06',
    tanggal_kirim: '2026-09-06',
    tanggal_terima: '2026-09-06',
    customer_id: 'k1',
    nama_penerima: 'Agus Pratama',
    alamat_tujuan: 'Jl. Pasir Kaliki No. 120, Bandung',
    telepon_tujuan: '0812-1111-2222',
    nama_sopir: 'Ahmad Sopir',
    nomor_kendaraan: 'D 8842 AB',
    ekspedisi: 'Kurir Internal Gudang',
    jumlah_koli: 9,
    keterangan: 'Surat Jalan resmi pengiriman kain',
    status: 'diterima',
    created_at: '2026-09-06T14:35:00Z'
  },
  {
    id: 'dn2',
    nomor_surat_jalan: 'SJ/2026/09/0002',
    arah: 'keluar',
    transaction_id: 't2',
    tanggal: '2026-09-15',
    tanggal_kirim: '2026-09-15',
    customer_id: 'k2',
    nama_penerima: 'Eka Putri',
    alamat_tujuan: 'Jl. Gatot Subroto No. 55, Semarang',
    telepon_tujuan: '0813-3333-4444',
    nama_sopir: 'Joko Suprianto',
    nomor_kendaraan: 'B 9102 KAA',
    ekspedisi: 'Kargo Nusantara Express',
    jumlah_koli: 15,
    keterangan: 'Pengiriman via tol Trans Jawa',
    status: 'dalam_pengiriman',
    created_at: '2026-09-15T08:20:00Z'
  },
  {
    id: 'dn3',
    arah: 'masuk',
    transaction_id: 't1',
    tanggal: '2026-09-01',
    supplier_id: 's1',
    nomor_sj_pemasok: 'SJ-TEX-99812',
    nama_penerima: 'Petugas Gudang - Ridwan',
    status: 'diterima',
    file_scan_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop',
    created_at: '2026-09-01T09:05:00Z'
  }
];

export const INITIAL_PROFILES: Profile[] = [
  { id: 'prof-admin', nama_lengkap: 'Budi Warehouse Manager', role: 'admin', is_active: true, email: 'admin@gudangkain.id' },
  { id: 'prof-staff', nama_lengkap: 'Ridwan Staf Operasional', role: 'staff', is_active: true, email: 'staff@gudangkain.id' },
  { id: 'prof-viewer', nama_lengkap: 'Dewi Auditor Internal', role: 'viewer', is_active: true, email: 'viewer@gudangkain.id' },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', user_name: 'Budi Manager', aksi: 'LOGIN', tabel: 'auth.users', created_at: '2026-09-16T08:00:00Z' },
  { id: 'al2', user_name: 'Ridwan Staf', aksi: 'SIMPAN_TRANSAKSI', tabel: 'transactions', record_id: 't3', created_at: '2026-09-12T11:15:00Z' },
  { id: 'al3', user_name: 'Budi Manager', aksi: 'UPDATE_INFO_BISNIS', tabel: 'business_info', created_at: '2026-09-10T16:45:00Z' },
];

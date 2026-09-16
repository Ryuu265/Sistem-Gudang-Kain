export type UserRole = 'admin' | 'staff' | 'viewer';
export type TransactionType = 'masuk' | 'keluar' | 'penyesuaian';
export type TransactionStatus = 'draft' | 'selesai' | 'dibatalkan';
export type DeliveryDirection = 'keluar' | 'masuk';
export type DeliveryStatus = 'draft' | 'diterbitkan' | 'dalam_pengiriman' | 'diterima' | 'ditolak_sebagian' | 'dibatalkan';

export interface BusinessInfo {
  id: string;
  nama_bisnis: string;
  logo_url?: string;
  alamat?: string;
  kota?: string;
  provinsi?: string;
  kode_pos?: string;
  telepon?: string;
  email?: string;
  npwp?: string;
  website?: string;
  catatan_footer?: string;
  allow_negative_stock?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  warna_label: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  product_count?: number;
  total_stock?: number;
}

export interface Unit {
  id: string;
  nama: string;
  simbol: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Supplier {
  id: string;
  kode: string;
  nama: string;
  kontak_person?: string;
  telepon?: string;
  email?: string;
  alamat?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Customer {
  id: string;
  kode: string;
  nama: string;
  kontak_person?: string;
  telepon?: string;
  email?: string;
  alamat?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Product {
  id: string;
  sku: string;
  nama: string;
  category_id: string;
  category?: Category;
  unit_id: string;
  unit?: Unit;
  warna: string;
  kode_warna?: string;
  lebar_kain_cm?: number;
  gramasi?: number;
  komposisi?: string;
  harga_beli: number;
  harga_jual: number;
  stok_saat_ini: number;
  stok_minimum: number;
  lokasi_rak?: string;
  foto_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  product?: Product;
  qty: number;
  qty_surat_jalan?: number;
  qty_aktual?: number;
  qty_retur?: number;
  harga_satuan: number;
  subtotal: number;
  keterangan?: string;
  created_at?: string;
}

export interface Transaction {
  id: string;
  nomor_transaksi: string;
  tipe: TransactionType;
  tanggal: string;
  supplier_id?: string;
  supplier?: Supplier;
  customer_id?: string;
  customer?: Customer;
  nomor_referensi?: string;
  keterangan?: string;
  total_nilai: number;
  status: TransactionStatus;
  created_by?: string;
  items?: TransactionItem[];
  delivery_note?: DeliveryNote;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryNote {
  id: string;
  nomor_surat_jalan?: string;
  arah: DeliveryDirection;
  transaction_id?: string;
  transaction?: Transaction;
  tanggal: string;
  tanggal_kirim?: string;
  tanggal_terima?: string;
  customer_id?: string;
  customer?: Customer;
  supplier_id?: string;
  supplier?: Supplier;
  nomor_sj_pemasok?: string;
  nama_penerima?: string;
  alamat_tujuan?: string;
  telepon_tujuan?: string;
  nama_sopir?: string;
  nomor_kendaraan?: string;
  ekspedisi?: string;
  jumlah_koli?: number;
  keterangan?: string;
  status: DeliveryStatus;
  file_scan_url?: string;
  ttd_penerima_url?: string;
  created_by?: string;
  diterbitkan_at?: string;
  diterbitkan_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryNoteStatusLog {
  id: string;
  delivery_note_id: string;
  status_lama?: DeliveryStatus;
  status_baru: DeliveryStatus;
  catatan?: string;
  user_id?: string;
  created_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  product?: Product;
  transaction_id?: string;
  transaction?: Transaction;
  tanggal: string;
  tipe: TransactionType;
  qty_masuk: number;
  qty_keluar: number;
  stok_sebelum: number;
  stok_sesudah: number;
  keterangan?: string;
  created_by?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  nama_lengkap: string;
  role: UserRole;
  is_active: boolean;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user_name?: string;
  aksi: string;
  tabel: string;
  record_id?: string;
  data_lama?: Record<string, any>;
  data_baru?: Record<string, any>;
  created_at: string;
}

export interface KpiMetrics {
  totalJenisKain: number;
  totalStok: number;
  barangMasukHariIni: number;
  barangKeluarHariIni: number;
  trendMasukPct: number;
  trendKeluarPct: number;
}

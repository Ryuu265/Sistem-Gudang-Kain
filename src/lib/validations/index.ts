import { z } from 'zod';

export const productSchema = z.object({
  sku: z.string().min(3, 'SKU minimal 3 karakter'),
  nama: z.string().min(3, 'Nama kain minimal 3 karakter'),
  category_id: z.string().min(1, 'Kategori kain wajib dipilih'),
  unit_id: z.string().min(1, 'Satuan wajib dipilih'),
  warna: z.string().min(1, 'Warna wajib diisi'),
  kode_warna: z.string().optional(),
  lebar_kain_cm: z.coerce.number().min(0, 'Lebar kain tidak boleh negatif').optional(),
  gramasi: z.coerce.number().min(0, 'Gramasi tidak boleh negatif').optional(),
  komposisi: z.string().optional(),
  harga_beli: z.coerce.number().min(0, 'Harga beli tidak boleh negatif'),
  harga_jual: z.coerce.number().min(0, 'Harga jual tidak boleh negatif'),
  stok_minimum: z.coerce.number().min(0, 'Stok minimum tidak boleh negatif'),
  lokasi_rak: z.string().optional(),
  foto_url: z.string().optional(),
});

export const transactionItemSchema = z.object({
  product_id: z.string().min(1, 'Produk kain wajib dipilih'),
  qty: z.coerce.number().gt(0, 'Jumlah harus lebih besar dari 0'),
  qty_surat_jalan: z.coerce.number().min(0).optional(),
  qty_aktual: z.coerce.number().min(0).optional(),
  harga_satuan: z.coerce.number().min(0),
  keterangan: z.string().optional(),
});

export const transactionSchema = z.object({
  tipe: z.enum(['masuk', 'keluar', 'penyesuaian']),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  supplier_id: z.string().optional(),
  customer_id: z.string().optional(),
  nomor_referensi: z.string().optional(),
  nomor_sj_pemasok: z.string().optional(),
  tanggal_sj_pemasok: z.string().optional(),
  nama_pengirim: z.string().optional(),
  nomor_kendaraan: z.string().optional(),
  nama_sopir: z.string().optional(),
  file_scan_url: z.string().optional(),
  keterangan: z.string().optional(),
  items: z.array(transactionItemSchema).min(1, 'Minimal 1 barang kain dalam transaksi'),
});

export const categorySchema = z.object({
  kode: z.string().min(2, 'Kode kategori minimal 2 karakter'),
  nama: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  deskripsi: z.string().optional(),
  warna_label: z.string().min(4, 'Warna label hex wajib dipilih'),
});

export const businessInfoSchema = z.object({
  nama_bisnis: z.string().min(3, 'Nama bisnis minimal 3 karakter'),
  logo_url: z.string().optional(),
  alamat: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),
  kode_pos: z.string().optional(),
  telepon: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  npwp: z.string().optional(),
  website: z.string().optional(),
  catatan_footer: z.string().optional(),
  allow_negative_stock: z.boolean().optional(),
});

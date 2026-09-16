# Catatan Keputusan Teknis (DECISIONS.md)

Dokumen ini mencatat keputusan arsitektur dan teknis dalam pembuatan **Sistem Gudang Kain**.

## 1. Pembaruan Stok Atomik via PostgreSQL Trigger
* **Keputusan**: Seluruh mutasi stok (`stok_saat_ini` pada tabel `products`) HANYA diubah oleh database trigger (`trg_on_transaction_status_change`) ketika status transaksi berubah menjadi `selesai`.
* **Alasan**: Menjamin integritas data stok (ACID properties) di tingkat basis data. Mencegah race condition, modifikasi stok ilegal via UI/API, dan menjamin bahwa kartu stok (`stock_movements`) selalu sinkron 100% dengan saldo akhir barang.

## 2. Penguncian Nomor Surat Jalan & Penomoran Otomatis
* **Keputusan**: Format nomor Surat Jalan Keluar mengikut pola `SJ/YYYY/MM/0001` secara berurutan dan terkunci secara permanen begitu diterbitkan.
* **Alasan**: Mencegah celah manipulasi pengiriman dan mematuhi audit fisik pergudangan serta regulasi perpajakan/distribusi.

## 3. Penanganan Selisih Barang Masuk (Qty Surat Jalan vs Qty Aktual)
* **Keputusan**: Form Barang Masuk mencatat `qty_surat_jalan` dan `qty_aktual` per baris item. Stok yang ditambahkan ke gudang SELALU memakai `qty_aktual`. Selisih fisik (rusak/kurang kirim) disimpan dalam metadata item beserta alasannya.
* **Alasan**: Mencegah manipulasi stok fisik gudang akibat klaim pengiriman vendor yang tidak sesuai kenyataan.

## 4. Supabase Client & Server Setup
* **Keputusan**: Menggunakan `@supabase/ssr` untuk kompatibilitas penuh dengan Next.js 14 App Router, Server Components, dan Server Actions.
* **Alasan**: Memberikan keamanan tingkat lanjut (RLS enforcement), sesi ter-cookie secara aman, dan kemudahan proteksi rute di Middleware.

## 5. Offline / Local Mock Fallback untuk Development & Verification
* **Keputusan**: Ketika koneksi Supabase belum terkonfigurasi atau dalam mode offline, aplikasi menyediakan mock-data state manager (Local Storage & Initial Seed State) sehingga seluruh alur UI, validasi form, cetak PDF, export Excel, dan grafik dapat diuji secara mandiri tanpa memblokir pengujian.
* **Alasan**: Memungkinkan percepatan verifikasi fitur dan keandalan aplikasi di berbagai lingkungan sandbox.

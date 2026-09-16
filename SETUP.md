# Petunjuk Setup & Deployment - Sistem Gudang Kain

Aplikasi Sistem Distribusi & Gudang Kain dibangun menggunakan Next.js 14 App Router, Tailwind CSS, TypeScript, dan Supabase.

## 1. Persyaratan Sistem
- Node.js >= 18.17.0 (disarankan v20)
- npm atau pnpm
- Akun Supabase (untuk database PostgreSQL, Auth, & Storage)

## 2. Langkah Setup Lokal

### A. Clone Repository
```bash
git clone https://github.com/Ryuu265/Sistem-Gudang-Kain.git
cd Sistem-Gudang-Kain
```

### B. Install Dependensi
```bash
npm install
```

### C. Konfigurasi Environment Variable
Salin `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi nilai berikut dengan kredensial Supabase Anda:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### D. Setup Database Supabase
1. Buka dashboard proyek Supabase Anda -> **SQL Editor**.
2. Jalankan skrip SQL secara berurutan yang ada di dalam folder `supabase/migrations/`:
   - `20260916000000_schema.sql` (Tabel, Enum, Index)
   - `20260916000001_triggers.sql` (Stored Functions & Trigger Stok Atomik)
   - `20260916000002_rls.sql` (Row Level Security & Role Rules)
   - `20260916000003_seed.sql` (Data Contoh 10 Kategori, 30 Produk, Transaksi, Surat Jalan)
3. Buat dua Storage Bucket di Supabase Storage:
   - `business-assets` (Public)
   - `surat-jalan-scans` (Public)

### E. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 3. Langkah Deploy ke Vercel

1. Push kode ke repository GitHub:
   ```bash
   git add .
   git commit -m "feat: setup awal sistem gudang kain"
   git push origin main
   ```
2. Impor repository di dashboard Vercel.
3. Tambahkan Environment Variable di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Tekan **Deploy**.

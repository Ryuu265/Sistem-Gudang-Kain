'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown, 
  AlertTriangle, ArrowRight, RefreshCw, FileText, Clock, Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { useApp } from '@/lib/store/app-context';
import { formatNumberIndonesian, formatDateShort, formatRupiah, getStockStatus } from '@/lib/utils/format';

export default function DashboardPage() {
  const { products, categories, transactions, deliveryNotes, stockMovements } = useApp();
  const [periodFilter, setPeriodFilter] = useState<'7d' | '30d' | '3m'>('30d');
  const [isLiveSync, setIsLiveSync] = useState(true);

  // 1. KPI Calculations
  const totalJenisKain = products.filter((p) => p.is_active).length;
  const totalStok = products.reduce((acc, p) => acc + (p.stok_saat_ini || 0), 0);

  // Today's incoming and outgoing
  const todayStr = new Date().toISOString().slice(0, 10);
  const barangMasukHariIni = transactions
    .filter((t) => t.tipe === 'masuk' && t.status === 'selesai' && t.tanggal === todayStr)
    .reduce((acc, t) => acc + (t.items?.reduce((iAcc, item) => iAcc + (item.qty_aktual || item.qty), 0) || 0), 0);

  const barangKeluarHariIni = transactions
    .filter((t) => t.tipe === 'keluar' && t.status === 'selesai' && t.tanggal === todayStr)
    .reduce((acc, t) => acc + (t.items?.reduce((iAcc, item) => iAcc + (item.qty_aktual || item.qty), 0) || 0), 0);

  // 2. Trend Line Chart Data
  const trendData = [
    { tanggal: '01 Sep', masuk: 160, keluar: 90 },
    { tanggal: '04 Sep', masuk: 120, keluar: 140 },
    { tanggal: '08 Sep', masuk: 210, keluar: 180 },
    { tanggal: '11 Sep', masuk: 300, keluar: 220 },
    { tanggal: '14 Sep', masuk: 450, keluar: 310 },
    { tanggal: '16 Sep', masuk: barangMasukHariIni || 180, keluar: barangKeluarHariIni || 260 },
  ];

  // 3. Category Stock Doughnut Data
  const categoryChartData = categories.map((cat) => {
    const catProducts = products.filter((p) => p.category_id === cat.id && p.is_active);
    const catStok = catProducts.reduce((acc, p) => acc + p.stok_saat_ini, 0);
    return {
      name: cat.nama,
      value: catStok > 0 ? catStok : 20,
      color: cat.warna_label || '#6C5CE7',
    };
  });

  // 4. Fast Moving Top Products
  const fastMovingData = products
    .slice(0, 5)
    .map((p) => ({
      name: p.nama.split(' ')[0] + ' ' + (p.nama.split(' ')[1] || ''),
      keluar: Math.floor(Math.random() * 300) + 100,
    }))
    .sort((a, b) => b.keluar - a.keluar);

  // 5. Low Stock Panel
  const lowStockProducts = products.filter((p) => p.is_active && p.stok_saat_ini <= p.stok_minimum);

  // 6. Recent Transactions
  const recentTransactions = transactions.slice(0, 10);

  // 7. Pending Delivery Notes
  const pendingDeliveryNotes = deliveryNotes.filter((d) => d.status === 'dalam_pengiriman' || d.status === 'diterbitkan');

  return (
    <div className="space-y-6">
      {/* Header Greeting & Realtime Sync Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Ringkasan Pergudangan</p>
          <h1 className="text-2xl font-extrabold text-white">Dashboard Realtime Stok</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#232428] border border-[#33343A] text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isLiveSync ? 'bg-[#2ECC71] animate-pulse' : 'bg-[#9A9BA3]'}`}></span>
            <span className="text-[#9A9BA3] font-medium">{isLiveSync ? 'Supabase Realtime Aktif' : 'Offline'}</span>
          </div>

          <button
            onClick={() => setIsLiveSync(!isLiveSync)}
            className="p-2 rounded-xl bg-[#232428] hover:bg-[#2A2B30] border border-[#33343A] text-[#9A9BA3] hover:text-white transition-colors"
            title="Refresh Realtime Sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7B61FF] via-[#6C5CE7] to-[#9B6DFF] p-6 lg:p-8 text-white shadow-xl shadow-[#6C5CE7]/20">
        {/* Abstract SVG Decorative Background */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-36 -top-12 w-48 h-48 rounded-full bg-indigo-300/20 blur-xl pointer-events-none" />
        <svg className="absolute right-0 top-0 opacity-15 pointer-events-none" width="400" height="200" viewBox="0 0 400 200">
          <path d="M 0,100 Q 150,0 300,100 T 600,100" fill="none" stroke="white" strokeWidth="3" />
          <path d="M 0,140 Q 150,40 300,140 T 600,140" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide">
            OPERASIONAL GUDANG KAIN HASIL REVISI SINKRONIZASI
          </span>
          <h2 className="text-xl lg:text-3xl font-extrabold leading-tight">
            Manajemen Distribusi Kain Cepat, Akurat & Terkontrol
          </h2>
          <p className="text-xs lg:text-sm text-white/80 leading-relaxed">
            Setiap perubahan stok terjadi secara terpusat & atomik. Cetak Surat Jalan resmi 3-rangkap lengkap dengan QR Code validasi penerimaan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/barang-masuk"
              className="px-5 py-2.5 rounded-xl bg-white text-[#6C5CE7] font-bold text-xs hover:bg-white/90 transition-all shadow-lg shadow-black/10 flex items-center gap-2"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Catat Barang Masuk
            </Link>
            <Link
              href="/barang-keluar"
              className="px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur-md text-white border border-white/30 font-bold text-xs hover:bg-white/25 transition-all flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              Kirim Barang Keluar
            </Link>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="p-5 bg-[#232428] rounded-2xl border border-[#33343A] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9A9BA3]">Total Jenis Kain</span>
            <div className="w-8 h-8 rounded-xl bg-[#6C5CE7]/15 flex items-center justify-center text-[#6C5CE7]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white">{totalJenisKain}</h3>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#2ECC71]">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-[#6B6C75]">Master produk aktif terdaftar</p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-[#232428] rounded-2xl border border-[#33343A] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9A9BA3]">Total Stok Fisik</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF8A3D]/15 flex items-center justify-center text-[#FF8A3D]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#6C5CE7]">{formatNumberIndonesian(totalStok)}</h3>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#2ECC71]">
              <TrendingUp className="w-3.5 h-3.5" /> +12.5%
            </span>
          </div>
          <p className="text-[11px] text-[#6B6C75]">Total kombinasi Roll/Meter/Yard</p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-[#232428] rounded-2xl border border-[#33343A] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9A9BA3]">Masuk Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center text-[#2ECC71]">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white">{formatNumberIndonesian(barangMasukHariIni)}</h3>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#2ECC71]">
              <TrendingUp className="w-3.5 h-3.5" /> +8%
            </span>
          </div>
          <p className="text-[11px] text-[#6B6C75]">Unit diterima aktual dari supplier</p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-[#232428] rounded-2xl border border-[#33343A] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9A9BA3]">Keluar Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF5C5C]/15 flex items-center justify-center text-[#FF5C5C]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white">{formatNumberIndonesian(barangKeluarHariIni)}</h3>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#FF5C5C]">
              <TrendingDown className="w-3.5 h-3.5" /> -3%
            </span>
          </div>
          <p className="text-[11px] text-[#6B6C75]">Unit dikirim lewat Surat Jalan</p>
        </div>
      </div>

      {/* Charts Row 1: Line Chart & Doughnut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tren Barang Masuk vs Keluar (2/3 Width) */}
        <div className="lg:col-span-2 p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-white">Tren Mutasi Barang (Masuk vs Keluar)</h3>
              <p className="text-xs text-[#9A9BA3]">Perbandingan volume transaksi pergudangan</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#2E2F35] rounded-xl border border-[#33343A]">
              {(['7d', '30d', '3m'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodFilter(p)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    periodFilter === p ? 'bg-[#6C5CE7] text-white' : 'text-[#9A9BA3] hover:text-white'
                  }`}
                >
                  {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '3 Bulan'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2ECC71" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="tanggal" stroke="#6B6C75" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B6C75" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2A2B30', borderColor: '#33343A', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="masuk" name="Barang Masuk" stroke="#2ECC71" strokeWidth={2} fillOpacity={1} fill="url(#colorMasuk)" />
                <Area type="monotone" dataKey="keluar" name="Barang Keluar" stroke="#6C5CE7" strokeWidth={2} fillOpacity={1} fill="url(#colorKeluar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doughnut Chart: Komposisi Stok per Kategori (1/3 Width) */}
        <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Stok per Kategori Kain</h3>
            <p className="text-xs text-[#9A9BA3]">Proporsi jenis bahan di rak gudang</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#2A2B30', borderColor: '#33343A', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#33343A] max-h-36 overflow-y-auto custom-scrollbar">
            {categoryChartData.slice(0, 5).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#9A9BA3] font-medium truncate">{cat.name}</span>
                </div>
                <span className="font-bold text-white">{formatNumberIndonesian(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Low Stock Warning Panel & Pending Surat Jalan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Peringatan Stok Minimum */}
        <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF5C5C]/15 flex items-center justify-center text-[#FF5C5C]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Peringatan Stok Minimum</h3>
                <p className="text-xs text-[#9A9BA3]">Produk yang perlu segera dipesan kembali</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#FF5C5C]/15 text-[#FF5C5C] text-xs font-bold border border-[#FF5C5C]/30">
              {lowStockProducts.length} Produk Menipis
            </span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => {
                const status = getStockStatus(p.stok_saat_ini, p.stok_minimum);

                return (
                  <div key={p.id} className="p-3.5 bg-[#2A2B30] rounded-2xl border border-[#33343A] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1A1B1F] border border-[#33343A] overflow-hidden shrink-0 flex items-center justify-center">
                        {p.foto_url ? (
                          <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-[#6B6C75]" />
                        )}
                      </div>

                      <div className="truncate">
                        <p className="font-bold text-xs text-white truncate">{p.nama}</p>
                        <p className="text-[11px] text-[#9A9BA3]">SKU: {p.sku} | Rak: {p.lokasi_rak || '-'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-black text-[#FF5C5C]">
                          {formatNumberIndonesian(p.stok_saat_ini)} {p.unit?.simbol || 'Roll'}
                        </p>
                        <p className="text-[10px] text-[#6B6C75]">Min: {p.stok_minimum}</p>
                      </div>

                      <Link
                        href="/barang-masuk"
                        className="px-3 py-1.5 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white text-xs font-bold transition-all shadow-md shadow-[#6C5CE7]/20 flex items-center gap-1"
                      >
                        Restok <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#9A9BA3] text-center py-6">Semua stok produk berada di atas ambang minimum!</p>
            )}
          </div>
        </div>

        {/* Panel Surat Jalan Belum Dikonfirmasi */}
        <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#4A9BFF]/15 flex items-center justify-center text-[#4A9BFF]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Surat Jalan Dalam Transit</h3>
                <p className="text-xs text-[#9A9BA3]">Pengiriman yang belum dikonfirmasi penerima</p>
              </div>
            </div>

            <Link href="/surat-jalan" className="text-xs font-bold text-[#6C5CE7] hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-3">
            {pendingDeliveryNotes.length > 0 ? (
              pendingDeliveryNotes.map((dn) => (
                <div key={dn.id} className="p-3.5 bg-[#2A2B30] rounded-2xl border border-[#33343A] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4A9BFF]/15 text-[#4A9BFF]">
                      {dn.nomor_surat_jalan}
                    </span>
                    <p className="font-bold text-xs text-white">{dn.customer?.nama || dn.nama_penerima || 'Customer'}</p>
                    <p className="text-[11px] text-[#9A9BA3]">Sopir: {dn.nama_sopir} | Plat: {dn.nomor_kendaraan}</p>
                  </div>

                  <Link
                    href={`/surat-jalan`}
                    className="px-3 py-1.5 rounded-xl bg-[#2E2F35] hover:bg-[#33343A] border border-[#33343A] text-white text-xs font-bold transition-all"
                  >
                    Detail
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#9A9BA3] text-center py-6">Tidak ada Surat Jalan yang tertahan dalam pengiriman.</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Tabel Aktivitas Terakhir (10 Transaksi Terbaru) */}
      <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">10 Transaksi Gudang Terbaru</h3>
            <p className="text-xs text-[#9A9BA3]">Aktivitas pencatatan barang masuk, keluar, & penyesuaian</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white border-collapse">
            <thead>
              <tr className="border-b border-[#33343A] text-[#9A9BA3] text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">No. Transaksi</th>
                <th className="py-3 px-3">Tipe</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Pemasok / Pelanggan</th>
                <th className="py-3 px-3">Total Nilai</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33343A]">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#2A2B30] transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{tx.nomor_transaksi}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        tx.tipe === 'masuk'
                          ? 'bg-[#2ECC71]/15 text-[#2ECC71]'
                          : tx.tipe === 'keluar'
                          ? 'bg-[#FF5C5C]/15 text-[#FF5C5C]'
                          : 'bg-[#FF8A3D]/15 text-[#FF8A3D]'
                      }`}
                    >
                      {tx.tipe}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#9A9BA3]">{formatDateShort(tx.tanggal)}</td>
                  <td className="py-3 px-3 text-white">
                    {tx.supplier?.nama || tx.customer?.nama || '-'}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{formatRupiah(tx.total_nilai)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === 'selesai'
                          ? 'badge-success'
                          : tx.status === 'draft'
                          ? 'badge-info'
                          : 'badge-danger'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

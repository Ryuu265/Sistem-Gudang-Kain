'use client';

import React, { useState } from 'react';
import { 
  BarChart3, FileSpreadsheet, FileText, Download, 
  Printer, Filter, Package, AlertTriangle 
} from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { formatNumberIndonesian, formatRupiah, formatDateShort } from '@/lib/utils/format';
import { exportToExcel, exportToCSV, exportReportToPDF } from '@/lib/utils/export';

export default function LaporanPage() {
  const { products, categories, transactions, deliveryNotes, businessInfo } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<string>('stok_saat_ini');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const reportOptions = [
    { id: 'stok_saat_ini', title: 'Laporan Stok Saat Ini' },
    { id: 'mutasi_barang', title: 'Laporan Mutasi Barang (Masuk/Keluar/Saldo)' },
    { id: 'barang_masuk', title: 'Laporan Barang Masuk' },
    { id: 'barang_keluar', title: 'Laporan Barang Keluar' },
    { id: 'stok_minimum', title: 'Laporan Stok Minimum (Reorder)' },
    { id: 'nilai_persediaan', title: 'Laporan Nilai Persediaan (Qty x Harga Beli)' },
    { id: 'surat_jalan', title: 'Laporan Status Surat Jalan' },
    { id: 'selisih_penerimaan', title: 'Laporan Selisih Penerimaan Vendor' },
  ];

  // Helper to generate dynamic table data based on report type
  const getReportData = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (selectedReportType === 'stok_saat_ini') {
      headers = ['SKU', 'Nama Kain', 'Kategori', 'Warna', 'Stok saat ini', 'Satuan', 'Lokasi Rak'];
      const filteredProds = products.filter((p) => p.is_active && (selectedCategory === 'all' || p.category_id === selectedCategory));
      rows = filteredProds.map((p) => [
        p.sku,
        p.nama,
        p.category?.nama || '-',
        p.warna,
        formatNumberIndonesian(p.stok_saat_ini),
        p.unit?.simbol || 'Roll',
        p.lokasi_rak || '-',
      ]);
    } else if (selectedReportType === 'nilai_persediaan') {
      headers = ['SKU', 'Nama Kain', 'Stok', 'Satuan', 'Harga Beli Satuan', 'Total Nilai (Rp)'];
      const filteredProds = products.filter((p) => p.is_active);
      rows = filteredProds.map((p) => [
        p.sku,
        p.nama,
        formatNumberIndonesian(p.stok_saat_ini),
        p.unit?.simbol || 'Roll',
        formatRupiah(p.harga_beli),
        formatRupiah(p.stok_saat_ini * p.harga_beli),
      ]);
    } else if (selectedReportType === 'stok_minimum') {
      headers = ['SKU', 'Nama Kain', 'Stok Fisik', 'Stok Minimum', 'Status', 'Lokasi Rak'];
      const filteredProds = products.filter((p) => p.is_active && p.stok_saat_ini <= p.stok_minimum);
      rows = filteredProds.map((p) => [
        p.sku,
        p.nama,
        formatNumberIndonesian(p.stok_saat_ini),
        formatNumberIndonesian(p.stok_minimum),
        p.stok_saat_ini <= 0 ? 'HABIS' : 'MENIPIS',
        p.lokasi_rak || '-',
      ]);
    } else if (selectedReportType === 'surat_jalan') {
      headers = ['No. SJ', 'Arah', 'Tanggal Kirim', 'Penerima / Tujuan', 'Sopir', 'Status'];
      rows = deliveryNotes.map((dn) => [
        dn.nomor_surat_jalan || dn.nomor_sj_pemasok || 'DRAFT',
        dn.arah.toUpperCase(),
        formatDateShort(dn.tanggal_kirim || dn.tanggal),
        dn.customer?.nama || dn.nama_penerima || '-',
        dn.nama_sopir || '-',
        dn.status.replace('_', ' ').toUpperCase(),
      ]);
    } else {
      // Default Transactions
      headers = ['No. Transaksi', 'Tipe', 'Tanggal', 'Pemasok / Customer', 'Total Nilai (Rp)', 'Status'];
      rows = transactions.map((t) => [
        t.nomor_transaksi,
        t.tipe.toUpperCase(),
        formatDateShort(t.tanggal),
        t.supplier?.nama || t.customer?.nama || '-',
        formatRupiah(t.total_nilai),
        t.status.toUpperCase(),
      ]);
    }

    return { headers, rows };
  };

  const { headers, rows } = getReportData();
  const currentReportTitle = reportOptions.find((r) => r.id === selectedReportType)?.title || 'Laporan Gudang';

  const handleExportExcel = () => {
    const jsonRows = rows.map((row) => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });
    exportToExcel(jsonRows, currentReportTitle.replace(/\s+/g, '_'));
  };

  const handleExportCSV = () => {
    const jsonRows = rows.map((row) => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });
    exportToCSV(jsonRows, currentReportTitle.replace(/\s+/g, '_'));
  };

  const handleExportPDF = () => {
    exportReportToPDF({
      title: currentReportTitle,
      period: 'Bulan September 2026',
      businessInfo,
      headers,
      rows,
      fileName: currentReportTitle.replace(/\s+/g, '_'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Pusat Laporan & Analytics</p>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#6C5CE7]" />
            Laporan Pergudangan & Export
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-[#232428] hover:bg-[#2A2B30] border border-[#33343A] text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#4A9BFF]" /> CSV
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 rounded-xl bg-[#232428] hover:bg-[#2A2B30] border border-[#33343A] text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2ECC71]" /> Excel
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white text-xs font-bold transition-all shadow-lg shadow-[#6C5CE7]/25 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Cetak / Download PDF
          </button>
        </div>
      </div>

      {/* Report Selector Bar */}
      <div className="p-4 bg-[#232428] rounded-2xl border border-[#33343A] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="font-bold text-[#9A9BA3] shrink-0">Jenis Laporan:</label>
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="w-full md:w-80 bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A] font-bold"
          >
            {reportOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.title}</option>
            ))}
          </select>
        </div>

        {selectedReportType === 'stok_saat_ini' && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="font-bold text-[#9A9BA3] shrink-0">Filter Kategori:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Live Table Preview */}
      <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#33343A] pb-3">
          <h3 className="font-bold text-sm text-white">{currentReportTitle}</h3>
          <span className="text-xs text-[#9A9BA3]">Total Baris: <strong className="text-white">{rows.length}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white border-collapse">
            <thead>
              <tr className="border-b border-[#33343A] text-[#9A9BA3] text-[11px] uppercase tracking-wider">
                {headers.map((h, i) => (
                  <th key={i} className="py-3 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33343A]">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#2A2B30] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-3 px-3">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  ArrowDownLeft, Plus, Trash2, FileText, Upload, AlertCircle, 
  CheckCircle, Printer, Save, Check 
} from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { formatNumberIndonesian, formatRupiah, formatDateShort } from '@/lib/utils/format';
import { generateSuratJalanPDF } from '@/lib/pdf/surat-jalan-pdf';

interface FormItem {
  product_id: string;
  qty_surat_jalan: number;
  qty_aktual: number;
  harga_satuan: number;
  alasan_selisih?: string;
}

export default function BarangMasukPage() {
  const { products, suppliers, deliveryNotes, businessInfo, addTransaction } = useApp();

  // Header & Surat Jalan Pemasok Form
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [supplierId, setSupplierId] = useState('');
  const [nomorSjPemasok, setNomorSjPemasok] = useState('');
  const [tanggalSjPemasok, setTanggalSjPemasok] = useState(new Date().toISOString().slice(0, 10));
  const [nomorPo, setNomorPo] = useState('');
  const [namaPengirim, setNamaPengirim] = useState('');
  const [nomorKendaraan, setNomorKendaraan] = useState('');
  const [namaSopir, setNamaSopir] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [scanFileUrl, setScanFileUrl] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Multi-item details
  const [items, setItems] = useState<FormItem[]>([
    { product_id: '', qty_surat_jalan: 10, qty_aktual: 10, harga_satuan: 0 }
  ]);

  // Success Notification
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check duplicate SJ Pemasok
  const handleSjPemasokChange = (sjNum: string) => {
    setNomorSjPemasok(sjNum);
    if (!sjNum || !supplierId) {
      setDuplicateWarning(null);
      return;
    }

    const existing = deliveryNotes.find(
      (d) => d.supplier_id === supplierId && d.nomor_sj_pemasok?.toLowerCase() === sjNum.toLowerCase()
    );

    if (existing) {
      setDuplicateWarning(
        `Surat jalan "${sjNum}" dari supplier ini sudah pernah dicatat pada ${formatDateShort(existing.tanggal)}`
      );
    } else {
      setDuplicateWarning(null);
    }
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { product_id: '', qty_surat_jalan: 0, qty_aktual: 0, harga_satuan: 0 }]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItemRow = (index: number, field: keyof FormItem, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'product_id') {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          item.harga_satuan = prod.harga_beli;
        }
      }

      updated[index] = item;
      return updated;
    });
  };

  const calculateTotalNilai = () => {
    return items.reduce((acc, item) => acc + (item.qty_aktual * item.harga_satuan), 0);
  };

  const handleSubmit = (status: 'draft' | 'selesai') => {
    if (!supplierId) {
      alert('Pemasok (Supplier) wajib dipilih!');
      return;
    }
    if (!nomorSjPemasok) {
      alert('Nomor Surat Jalan Pemasok wajib diisi!');
      return;
    }
    if (items.some((i) => !i.product_id || i.qty_aktual <= 0)) {
      alert('Semua item kain harus dipilih dan Qty Aktual > 0!');
      return;
    }

    const txItems = items.map((i) => ({
      product_id: i.product_id,
      qty: i.qty_aktual, // Atomic stock follows qty_aktual
      qty_surat_jalan: i.qty_surat_jalan,
      qty_aktual: i.qty_aktual,
      harga_satuan: i.harga_satuan,
      subtotal: i.qty_aktual * i.harga_satuan,
      keterangan: i.qty_surat_jalan !== i.qty_aktual ? `Selisih Qty SJ: ${i.qty_surat_jalan} vs Aktual: ${i.qty_aktual}` : undefined,
    }));

    const createdTx = addTransaction({
      tipe: 'masuk',
      tanggal,
      supplier_id: supplierId,
      nomor_referensi: nomorPo || nomorSjPemasok,
      keterangan: `SJ Pemasok: ${nomorSjPemasok} | ${keterangan}`,
      total_nilai: calculateTotalNilai(),
      status,
      items: txItems as any,
    });

    setSuccessMessage(`Transaksi Barang Masuk (${createdTx.nomor_transaksi}) berhasil disimpan dengan status ${status}!`);
    resetForm();
  };

  const resetForm = () => {
    setNomorSjPemasok('');
    setNomorPo('');
    setNamaPengirim('');
    setNomorKendaraan('');
    setNamaSopir('');
    setKeterangan('');
    setItems([{ product_id: '', qty_surat_jalan: 10, qty_aktual: 10, harga_satuan: 0 }]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Form Operasional</p>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ArrowDownLeft className="w-6 h-6 text-[#2ECC71]" />
            Penerimaan Barang Masuk
          </h1>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 bg-[#2ECC71]/15 border border-[#2ECC71]/40 rounded-2xl flex items-center justify-between text-xs text-[#2ECC71]">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="font-bold underline">Tutup</button>
        </div>
      )}

      {/* Main Form Container */}
      <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-6 shadow-xl">
        {/* Header Section: Vendor & Receipt Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-[#33343A]">
          <div>
            <label className="block text-xs font-bold text-[#9A9BA3] mb-1">Tanggal Terima *</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full bg-[#2E2F35] text-xs text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9BA3] mb-1">Supplier / Pemasok *</label>
            <select
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                if (nomorSjPemasok) handleSjPemasokChange(nomorSjPemasok);
              }}
              className="w-full bg-[#2E2F35] text-xs text-white p-2.5 rounded-xl border border-[#33343A]"
            >
              <option value="">-- Pilih Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.nama} ({s.kode})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9BA3] mb-1">Catatan Keterangan</label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Pengiriman batch ke-2 PO"
              className="w-full bg-[#2E2F35] text-xs text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
        </div>

        {/* Mandatory Vendor Surat Jalan Block */}
        <div className="p-4 bg-[#2A2B30] rounded-2xl border border-[#33343A] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#4A9BFF] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blok Surat Jalan Pemasok (Wajib Digudang)
            </h3>
          </div>

          {/* Duplicate SJ Warning */}
          {duplicateWarning && (
            <div className="p-3 bg-[#FF8A3D]/15 border border-[#FF8A3D]/40 rounded-xl flex items-center gap-3 text-xs text-[#FF8A3D]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#9A9BA3] mb-1">No. Surat Jalan Pemasok *</label>
              <input
                type="text"
                required
                value={nomorSjPemasok}
                onChange={(e) => handleSjPemasokChange(e.target.value)}
                placeholder="Contoh: SJ-TEX-99812"
                className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#9A9BA3] mb-1">Tgl Surat Jalan Pemasok</label>
              <input
                type="date"
                value={tanggalSjPemasok}
                onChange={(e) => setTanggalSjPemasok(e.target.value)}
                className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#9A9BA3] mb-1">No. PO / Referensi</label>
              <input
                type="text"
                value={nomorPo}
                onChange={(e) => setNomorPo(e.target.value)}
                placeholder="PO-2026-001"
                className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#9A9BA3] mb-1">Nama Ekspedisi / Pengirim</label>
              <input
                type="text"
                value={namaPengirim}
                onChange={(e) => setNamaPengirim(e.target.value)}
                placeholder="Kurir Texchem / JNE Kargo"
                className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#9A9BA3] mb-1">Nomor Kendaraan (Plat)</label>
              <input
                type="text"
                value={nomorKendaraan}
                onChange={(e) => setNomorKendaraan(e.target.value)}
                placeholder="D 8842 AB"
                className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#9A9BA3] mb-1">Nama Sopir</label>
              <input
                type="text"
                value={namaSopir}
                onChange={(e) => setNamaSopir(e.target.value)}
                placeholder="Ahmad Sopir"
                className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
              />
            </div>
          </div>
        </div>

        {/* Multi-Item Entries Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">Detail Item Kain Diterima</h3>
            <button
              type="button"
              onClick={addItemRow}
              className="px-3 py-1.5 rounded-xl bg-[#6C5CE7]/20 text-[#6C5CE7] hover:bg-[#6C5CE7]/30 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Baris Kain
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white border-collapse">
              <thead>
                <tr className="border-b border-[#33343A] text-[#9A9BA3] text-[11px] uppercase">
                  <th className="py-2.5 px-2">Kain (SKU / Nama)</th>
                  <th className="py-2.5 px-2 w-28">Qty di SJ</th>
                  <th className="py-2.5 px-2 w-28">Qty Aktual</th>
                  <th className="py-2.5 px-2 w-36">Harga Beli Satuan</th>
                  <th className="py-2.5 px-2 w-36">Subtotal</th>
                  <th className="py-2.5 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#33343A]">
                {items.map((item, index) => {
                  const selectedProd = products.find((p) => p.id === item.product_id);
                  const hasDiscrepancy = item.qty_surat_jalan !== item.qty_aktual;

                  return (
                    <tr key={index} className="hover:bg-[#2A2B30]/50">
                      <td className="py-2 px-2">
                        <select
                          value={item.product_id}
                          onChange={(e) => updateItemRow(index, 'product_id', e.target.value)}
                          className="w-full bg-[#2E2F35] text-xs text-white p-2 rounded-xl border border-[#33343A]"
                        >
                          <option value="">-- Pilih Kain --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nama} ({p.sku}) - Stok: {p.stok_saat_ini}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={item.qty_surat_jalan}
                          onChange={(e) => updateItemRow(index, 'qty_surat_jalan', parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#2E2F35] text-xs text-white p-2 rounded-xl border border-[#33343A]"
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={item.qty_aktual}
                          onChange={(e) => updateItemRow(index, 'qty_aktual', parseFloat(e.target.value) || 0)}
                          className={`w-full text-xs font-bold p-2 rounded-xl border ${
                            hasDiscrepancy ? 'bg-[#FF8A3D]/20 border-[#FF8A3D] text-[#FF8A3D]' : 'bg-[#2E2F35] text-white border-[#33343A]'
                          }`}
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={item.harga_satuan}
                          onChange={(e) => updateItemRow(index, 'harga_satuan', parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#2E2F35] text-xs text-white p-2 rounded-xl border border-[#33343A]"
                        />
                      </td>

                      <td className="py-2 px-2 font-bold text-white">
                        {formatRupiah(item.qty_aktual * item.harga_satuan)}
                      </td>

                      <td className="py-2 px-2 text-right">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            className="p-1.5 text-[#FF5C5C] hover:bg-[#FF5C5C]/15 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary & Actions */}
        <div className="pt-4 border-t border-[#33343A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#9A9BA3]">Total Nilai Barang Masuk:</p>
            <h3 className="text-xl font-extrabold text-[#2ECC71]">{formatRupiah(calculateTotalNilai())}</h3>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#2E2F35] hover:bg-[#33343A] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('selesai')}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-bold text-xs shadow-lg shadow-[#2ECC71]/20 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Selesaikan & Tambah Stok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

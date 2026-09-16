'use client';

import React, { useState } from 'react';
import { 
  ArrowUpRight, Plus, Trash2, FileText, CheckCircle, 
  AlertTriangle, Save, Check, Printer 
} from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { formatNumberIndonesian, formatRupiah } from '@/lib/utils/format';
import { generateSuratJalanPDF } from '@/lib/pdf/surat-jalan-pdf';

interface OutgoingItem {
  product_id: string;
  qty: number;
  harga_satuan: number;
  keterangan?: string;
}

export default function BarangKeluarPage() {
  const { products, customers, businessInfo, addTransaction, deliveryNotes } = useApp();

  // Header State
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [customerId, setCustomerId] = useState('');
  const [nomorPoCustomer, setNomorPoCustomer] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Items State
  const [items, setItems] = useState<OutgoingItem[]>([
    { product_id: '', qty: 10, harga_satuan: 0 }
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addItemRow = () => {
    setItems((prev) => [...prev, { product_id: '', qty: 0, harga_satuan: 0 }]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItemRow = (index: number, field: keyof OutgoingItem, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'product_id') {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          item.harga_satuan = prod.harga_jual;
        }
      }

      updated[index] = item;
      return updated;
    });
  };

  const calculateTotalNilai = () => {
    return items.reduce((acc, item) => acc + (item.qty * item.harga_satuan), 0);
  };

  const handleSubmit = (status: 'draft' | 'selesai') => {
    setErrorMessage(null);
    if (!customerId) {
      setErrorMessage('Pelanggan (Customer) wajib dipilih!');
      return;
    }
    if (items.some((i) => !i.product_id || i.qty <= 0)) {
      setErrorMessage('Semua item kain harus dipilih dan Qty > 0!');
      return;
    }

    // Check stock availability
    for (const item of items) {
      const prod = products.find((p) => p.id === item.product_id);
      if (prod && prod.stok_saat_ini < item.qty && !businessInfo.allow_negative_stock) {
        setErrorMessage(
          `Stok tidak mencukupi untuk ${prod.nama}. Stok tersedia: ${prod.stok_saat_ini} ${prod.unit?.simbol || 'Roll'}, Dibutuhkan: ${item.qty}`
        );
        return;
      }
    }

    const txItems = items.map((i) => ({
      product_id: i.product_id,
      qty: i.qty,
      qty_surat_jalan: i.qty,
      qty_aktual: i.qty,
      harga_satuan: i.harga_satuan,
      subtotal: i.qty * i.harga_satuan,
    }));

    try {
      const createdTx = addTransaction({
        tipe: 'keluar',
        tanggal,
        customer_id: customerId,
        nomor_referensi: nomorPoCustomer,
        keterangan,
        total_nilai: calculateTotalNilai(),
        status,
        items: txItems as any,
      });

      setSuccessMessage(
        `Pengiriman Barang Keluar (${createdTx.nomor_transaksi}) berhasil dibuat! Surat Jalan otomatis diterbitkan.`
      );
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal membuat transaksi pengiriman');
    }
  };

  const resetForm = () => {
    setNomorPoCustomer('');
    setKeterangan('');
    setItems([{ product_id: '', qty: 10, harga_satuan: 0 }]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Form Pengiriman</p>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-[#FF5C5C]" />
            Pengeluaran Barang & Surat Jalan
          </h1>
        </div>
      </div>

      {/* Error & Success Banners */}
      {errorMessage && (
        <div className="p-4 bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 rounded-2xl flex items-center justify-between text-xs text-[#FF5C5C]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="font-bold underline">Tutup</button>
        </div>
      )}

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
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-[#33343A]">
          <div>
            <label className="block text-xs font-bold text-[#9A9BA3] mb-1">Tanggal Kirim *</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full bg-[#2E2F35] text-xs text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9BA3] mb-1">Pelanggan / Customer *</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-[#2E2F35] text-xs text-white p-2.5 rounded-xl border border-[#33343A]"
            >
              <option value="">-- Pilih Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.nama} ({c.kode})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9BA3] mb-1">No. Sales Order / PO</label>
            <input
              type="text"
              value={nomorPoCustomer}
              onChange={(e) => setNomorPoCustomer(e.target.value)}
              placeholder="Contoh: SO-CUST-8812"
              className="w-full bg-[#2E2F35] text-xs text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
        </div>

        {/* Multi-Item Entries Table with Real-time Stock Badge */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">Detail Barang Kain Keluar</h3>
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
                  <th className="py-2.5 px-2">Pilih Kain</th>
                  <th className="py-2.5 px-2 w-32">Stok Real-Time</th>
                  <th className="py-2.5 px-2 w-28">Qty Kirim</th>
                  <th className="py-2.5 px-2 w-36">Harga Jual Satuan</th>
                  <th className="py-2.5 px-2 w-36">Subtotal</th>
                  <th className="py-2.5 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#33343A]">
                {items.map((item, index) => {
                  const selectedProd = products.find((p) => p.id === item.product_id);
                  const isStockInsufficient = selectedProd && selectedProd.stok_saat_ini < item.qty;

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
                              {p.nama} ({p.sku})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Real-time Stock Badge next to item */}
                      <td className="py-2 px-2">
                        {selectedProd ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isStockInsufficient ? 'bg-[#FF5C5C]/20 text-[#FF5C5C]' : 'bg-[#2ECC71]/20 text-[#2ECC71]'
                            }`}
                          >
                            Sisa: {selectedProd.stok_saat_ini} {selectedProd.unit?.simbol || 'Roll'}
                          </span>
                        ) : (
                          <span className="text-[#6B6C75] text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItemRow(index, 'qty', parseFloat(e.target.value) || 0)}
                          className={`w-full text-xs font-bold p-2 rounded-xl border ${
                            isStockInsufficient ? 'bg-[#FF5C5C]/20 border-[#FF5C5C] text-[#FF5C5C]' : 'bg-[#2E2F35] text-white border-[#33343A]'
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
                        {formatRupiah(item.qty * item.harga_satuan)}
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

        {/* Actions Footer */}
        <div className="pt-4 border-t border-[#33343A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#9A9BA3]">Total Nilai Barang Keluar:</p>
            <h3 className="text-xl font-extrabold text-[#6C5CE7]">{formatRupiah(calculateTotalNilai())}</h3>
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
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white font-bold text-xs shadow-lg shadow-[#6C5CE7]/25 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Terbitkan & Potong Stok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

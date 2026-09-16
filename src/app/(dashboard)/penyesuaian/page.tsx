'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, Check, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { formatNumberIndonesian } from '@/lib/utils/format';

export default function PenyesuaianStokPage() {
  const { products, addTransaction } = useApp();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [stokFisik, setStokFisik] = useState('');
  const [alasan, setAlasan] = useState('Stok Opname Rutin');
  const [keterangan, setKeterangan] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const currentStok = selectedProduct ? selectedProduct.stok_saat_ini : 0;
  const numStokFisik = parseFloat(stokFisik) || 0;
  const selisih = selectedProduct ? numStokFisik - currentStok : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !stokFisik) return;

    addTransaction({
      tipe: 'penyesuaian',
      tanggal: new Date().toISOString().slice(0, 10),
      keterangan: `Penyesuaian Stok Opname: ${alasan}. ${keterangan}`,
      total_nilai: 0,
      status: 'selesai',
      items: [
        {
          product_id: selectedProductId,
          qty: numStokFisik, // In adjustment, qty is target physical stock
          qty_aktual: numStokFisik,
          harga_satuan: selectedProduct?.harga_beli || 0,
          subtotal: 0,
          keterangan: `Selisih opname: ${selisih > 0 ? '+' : ''}${selisih} (${alasan})`,
        },
      ] as any,
    });

    setSuccessMessage(`Stok ${selectedProduct?.nama} berhasil disesuaikan menjadi ${numStokFisik}!`);
    setSelectedProductId('');
    setStokFisik('');
    setKeterangan('');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Audit Fisik Pergudangan</p>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-[#FF8A3D]" />
          Penyesuaian Stok (Stok Opname)
        </h1>
      </div>

      {successMessage && (
        <div className="p-4 bg-[#2ECC71]/15 border border-[#2ECC71]/40 rounded-2xl text-xs text-[#2ECC71] font-bold">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-5 shadow-xl text-xs">
        <div>
          <label className="block text-[#9A9BA3] font-bold mb-1">Pilih Kain yang Di-opname *</label>
          <select
            required
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-[#2E2F35] text-white p-3 rounded-xl border border-[#33343A]"
          >
            <option value="">-- Pilih Produk Kain --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} ({p.sku}) - Stok Sistem: {p.stok_saat_ini} {p.unit?.simbol || 'Roll'}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="p-4 bg-[#2A2B30] rounded-2xl border border-[#33343A] grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[#9A9BA3] text-[11px]">Stok Sistem</p>
              <p className="text-lg font-black text-white">{currentStok}</p>
            </div>
            <div>
              <p className="text-[#9A9BA3] text-[11px]">Stok Fisik Diinput</p>
              <p className="text-lg font-black text-[#6C5CE7]">{numStokFisik}</p>
            </div>
            <div>
              <p className="text-[#9A9BA3] text-[11px]">Selisih Audit</p>
              <p className={`text-lg font-black ${selisih < 0 ? 'text-[#FF5C5C]' : selisih > 0 ? 'text-[#2ECC71]' : 'text-[#9A9BA3]'}`}>
                {selisih > 0 ? `+${selisih}` : selisih}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Hasil Hitung Fisik Gudang *</label>
            <input
              type="number"
              required
              value={stokFisik}
              onChange={(e) => setStokFisik(e.target.value)}
              placeholder="Jumlah fisik di rak"
              className="w-full bg-[#2E2F35] text-white p-3 rounded-xl border border-[#33343A]"
            />
          </div>

          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Alasan Penyesuaian *</label>
            <select
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="w-full bg-[#2E2F35] text-white p-3 rounded-xl border border-[#33343A]"
            >
              <option value="Stok Opname Rutin">Stok Opname Rutin</option>
              <option value="Barang Cacat / Rusak">Barang Cacat / Rusak</option>
              <option value="Barang Hilang / Selisih">Barang Hilang / Selisih</option>
              <option value="Koreksi Salah Input">Koreksi Salah Input</option>
              <option value="Retur Pelanggan">Retur Pelanggan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[#9A9BA3] font-bold mb-1">Catatan Tambahan</label>
          <textarea
            rows={3}
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Keterangan kondisi fisik kain..."
            className="w-full bg-[#2E2F35] text-white p-3 rounded-xl border border-[#33343A]"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white font-bold flex items-center gap-2 shadow-lg shadow-[#6C5CE7]/25"
          >
            <Check className="w-4 h-4" /> Commit Penyesuaian Stok
          </button>
        </div>
      </form>
    </div>
  );
}

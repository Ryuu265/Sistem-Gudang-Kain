'use client';

import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { formatNumberIndonesian } from '@/lib/utils/format';

export default function KategoriPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [warnaLabel, setWarnaLabel] = useState('#6C5CE7');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingId(null);
    setKode(`KAT-${String(categories.length + 1).padStart(2, '0')}`);
    setNama('');
    setDeskripsi('');
    setWarnaLabel('#6C5CE7');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingId(cat.id);
    setKode(cat.kode);
    setNama(cat.nama);
    setDeskripsi(cat.deskripsi || '');
    setWarnaLabel(cat.warna_label || '#6C5CE7');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !kode) return;

    if (editingId) {
      updateCategory(editingId, { kode, nama, deskripsi, warna_label: warnaLabel });
    } else {
      addCategory({ kode, nama, deskripsi, warna_label: warnaLabel, is_active: true });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    setErrorMessage(null);
    const success = deleteCategory(id);
    if (!success) {
      setErrorMessage(`Gagal menghapus kategori "${name}": Masih dipakai oleh kain aktif di katalog!`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Master Data</p>
          <h1 className="text-2xl font-extrabold text-white">Kategori & Jenis Kain</h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 rounded-2xl flex items-center justify-between text-xs text-[#FF5C5C]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-bold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="font-bold underline">Tutup</button>
        </div>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category_id === cat.id && p.is_active);
          const totalStok = catProducts.reduce((acc, p) => acc + p.stok_saat_ini, 0);

          return (
            <div key={cat.id} className="p-5 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: `${cat.warna_label}20`, color: cat.warna_label }}
                  >
                    {cat.kode}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditModal(cat)} className="p-1.5 text-[#9A9BA3] hover:text-white rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.nama)} className="p-1.5 text-[#FF5C5C] hover:bg-[#FF5C5C]/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-white">{cat.nama}</h3>
                <p className="text-xs text-[#9A9BA3]">{cat.deskripsi || 'Tidak ada deskripsi'}</p>
              </div>

              <div className="pt-3 border-t border-[#33343A] flex items-center justify-between text-xs">
                <div>
                  <p className="text-[#6B6C75] text-[10px]">Jumlah Produk</p>
                  <p className="font-bold text-white">{catProducts.length} Kain</p>
                </div>
                <div className="text-right">
                  <p className="text-[#6B6C75] text-[10px]">Total Stok Rak</p>
                  <p className="font-bold text-[#6C5CE7]">{formatNumberIndonesian(totalStok)} Unit</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#232428] border border-[#33343A] rounded-3xl p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#33343A] pb-3">
              <h3 className="font-extrabold text-base text-white">
                {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#9A9BA3] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#9A9BA3] font-bold mb-1">Kode Kategori *</label>
                <input
                  type="text"
                  required
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                />
              </div>

              <div>
                <label className="block text-[#9A9BA3] font-bold mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Cotton Combed"
                  className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                />
              </div>

              <div>
                <label className="block text-[#9A9BA3] font-bold mb-1">Pilih Warna Label (Hex)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={warnaLabel}
                    onChange={(e) => setWarnaLabel(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-[#2E2F35] border border-[#33343A] cursor-pointer"
                  />
                  <span className="font-mono text-white">{warnaLabel}</span>
                </div>
              </div>

              <div>
                <label className="block text-[#9A9BA3] font-bold mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#33343A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2E2F35] text-white font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white font-bold"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

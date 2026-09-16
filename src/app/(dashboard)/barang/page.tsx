'use client';

import React, { useState } from 'react';
import { 
  Package, Plus, Search, Filter, FileSpreadsheet, Download, 
  Copy, Archive, Edit, History, X, Check, AlertCircle, Layers 
} from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { formatNumberIndonesian, formatRupiah, getStockStatus, formatDateShort } from '@/lib/utils/format';
import { exportToExcel, exportToCSV } from '@/lib/utils/export';
import { Product } from '@/types';

export default function MasterBarangPage() {
  const { products, categories, units, addProduct, updateProduct, archiveProduct, duplicateProduct, stockMovements } = useApp();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockCardProduct, setStockCardProduct] = useState<Product | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // New Product Form State
  const [formSku, setFormSku] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formUnitId, setFormUnitId] = useState('');
  const [formWarna, setFormWarna] = useState('');
  const [formHargaBeli, setFormHargaBeli] = useState('');
  const [formHargaJual, setFormHargaJual] = useState('');
  const [formStokMinimum, setFormStokMinimum] = useState('10');
  const [formLokasiRak, setFormLokasiRak] = useState('');
  const [formFotoUrl, setFormFotoUrl] = useState('');

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.warna.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;

    const status = getStockStatus(p.stok_saat_ini, p.stok_minimum).badgeVariant;
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formCategoryId || !formUnitId || !formWarna) return;

    const sku = formSku || `KN-${Date.now().toString().slice(-6)}`;

    addProduct({
      sku,
      nama: formNama,
      category_id: formCategoryId,
      unit_id: formUnitId,
      warna: formWarna,
      harga_beli: parseFloat(formHargaBeli) || 0,
      harga_jual: parseFloat(formHargaJual) || 0,
      stok_minimum: parseFloat(formStokMinimum) || 10,
      lokasi_rak: formLokasiRak || 'Rak General',
      foto_url: formFotoUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&auto=format&fit=crop',
      is_active: true,
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      nama: formNama,
      category_id: formCategoryId,
      unit_id: formUnitId,
      warna: formWarna,
      harga_beli: parseFloat(formHargaBeli),
      harga_jual: parseFloat(formHargaJual),
      stok_minimum: parseFloat(formStokMinimum),
      lokasi_rak: formLokasiRak,
    });

    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormSku('');
    setFormNama('');
    setFormCategoryId('');
    setFormUnitId('');
    setFormWarna('');
    setFormHargaBeli('');
    setFormHargaJual('');
    setFormStokMinimum('10');
    setFormLokasiRak('');
    setFormFotoUrl('');
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormSku(p.sku);
    setFormNama(p.nama);
    setFormCategoryId(p.category_id);
    setFormUnitId(p.unit_id);
    setFormWarna(p.warna);
    setFormHargaBeli(String(p.harga_beli));
    setFormHargaJual(String(p.harga_jual));
    setFormStokMinimum(String(p.stok_minimum));
    setFormLokasiRak(p.lokasi_rak || '');
  };

  const handleExportExcel = () => {
    const exportData = filteredProducts.map((p) => ({
      SKU: p.sku,
      'Nama Kain': p.nama,
      Kategori: p.category?.nama || 'Uncategorized',
      Warna: p.warna,
      Stok: p.stok_saat_ini,
      Satuan: p.unit?.simbol || 'Roll',
      'Harga Beli': p.harga_beli,
      'Harga Jual': p.harga_jual,
      'Lokasi Rak': p.lokasi_rak || '-',
    }));
    exportToExcel(exportData, 'Master_Kain_Stok');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Katalog Master</p>
          <h1 className="text-2xl font-extrabold text-white">Stok & Master Kain</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-[#232428] hover:bg-[#2A2B30] border border-[#33343A] text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2ECC71]" />
            Export Excel
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white text-xs font-bold transition-all shadow-lg shadow-[#6C5CE7]/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Kain Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[#232428] rounded-2xl border border-[#33343A] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9BA3]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari SKU, nama kain, warna..."
            className="w-full bg-[#2E2F35] text-xs text-white placeholder-[#6B6C75] pl-9 pr-4 py-2.5 rounded-xl border border-[#33343A] focus:outline-none focus:border-[#6C5CE7]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#2E2F35] text-xs text-white px-3 py-2.5 rounded-xl border border-[#33343A] focus:outline-none focus:border-[#6C5CE7]"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nama}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#2E2F35] text-xs text-white px-3 py-2.5 rounded-xl border border-[#33343A] focus:outline-none focus:border-[#6C5CE7]"
          >
            <option value="all">Semua Status Stok</option>
            <option value="success">Stok Aman</option>
            <option value="warning">Stok Menipis</option>
            <option value="danger">Stok Habis</option>
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white border-collapse">
            <thead>
              <tr className="border-b border-[#33343A] text-[#9A9BA3] text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Kain</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Warna</th>
                <th className="py-3 px-3">Stok Saat Ini</th>
                <th className="py-3 px-3">Lokasi Rak</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33343A]">
              {filteredProducts.map((p) => {
                const status = getStockStatus(p.stok_saat_ini, p.stok_minimum);

                return (
                  <tr key={p.id} className="hover:bg-[#2A2B30] transition-colors">
                    {/* Kain Name & Image */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A1B1F] border border-[#33343A] overflow-hidden shrink-0 flex items-center justify-center">
                          {p.foto_url ? (
                            <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-[#6B6C75]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{p.nama}</p>
                          <p className="text-[11px] text-[#9A9BA3]">Beli: {formatRupiah(p.harga_beli)} | Jual: {formatRupiah(p.harga_jual)}</p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-3 font-mono text-xs text-[#9A9BA3]">{p.sku}</td>

                    {/* Category Badge */}
                    <td className="py-3 px-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: `${p.category?.warna_label || '#6C5CE7'}20`,
                          color: p.category?.warna_label || '#6C5CE7',
                        }}
                      >
                        {p.category?.nama || 'Kategori'}
                      </span>
                    </td>

                    {/* Warna Pill */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: p.kode_warna || '#fff' }}
                        />
                        <span className="text-xs text-white">{p.warna}</span>
                      </div>
                    </td>

                    {/* Stok Saat Ini (Read-Only) */}
                    <td className="py-3 px-3 font-black text-sm text-white">
                      {formatNumberIndonesian(p.stok_saat_ini)} <span className="text-xs font-normal text-[#9A9BA3]">{p.unit?.simbol || 'Roll'}</span>
                    </td>

                    {/* Lokasi Rak */}
                    <td className="py-3 px-3 text-[#9A9BA3]">{p.lokasi_rak || '-'}</td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.colorClass}`}>
                        {status.label}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setStockCardProduct(p)}
                          className="p-1.5 rounded-lg bg-[#2E2F35] text-[#4A9BFF] hover:bg-[#33343A]"
                          title="Kartu Stok (Riwayat Ledger)"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-[#2E2F35] text-white hover:bg-[#33343A]"
                          title="Edit Info Kain"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => duplicateProduct(p.id)}
                          className="p-1.5 rounded-lg bg-[#2E2F35] text-[#2ECC71] hover:bg-[#33343A]"
                          title="Duplikat Kain"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => archiveProduct(p.id)}
                          className="p-1.5 rounded-lg bg-[#2E2F35] text-[#FF5C5C] hover:bg-[#33343A]"
                          title="Arsip / Nonaktifkan"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#232428] border border-[#33343A] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#33343A] pb-3">
              <h3 className="font-extrabold text-base text-white">
                {editingProduct ? 'Edit Master Kain' : 'Tambah Master Kain Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 rounded-lg text-[#9A9BA3] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">SKU Kain (Auto/Unik)</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="Contoh: KN-CC-30S-BLK"
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>

                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Nama Kain *</label>
                  <input
                    type="text"
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="Cotton Combed 30s Hitam"
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Kategori Kain *</label>
                  <select
                    required
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Satuan Kain *</label>
                  <select
                    required
                    value={formUnitId}
                    onChange={(e) => setFormUnitId(e.target.value)}
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  >
                    <option value="">Pilih Satuan</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.nama} ({u.simbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Warna *</label>
                  <input
                    type="text"
                    required
                    value={formWarna}
                    onChange={(e) => setFormWarna(e.target.value)}
                    placeholder="Hitam Jet Black"
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>

                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Harga Beli (Rp)</label>
                  <input
                    type="number"
                    value={formHargaBeli}
                    onChange={(e) => setFormHargaBeli(e.target.value)}
                    placeholder="115000"
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>

                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    value={formHargaJual}
                    onChange={(e) => setFormHargaJual(e.target.value)}
                    placeholder="135000"
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Stok Minimum Peringatan</label>
                  <input
                    type="number"
                    value={formStokMinimum}
                    onChange={(e) => setFormStokMinimum(e.target.value)}
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>

                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Lokasi Rak Gudang</label>
                  <input
                    type="text"
                    value={formLokasiRak}
                    onChange={(e) => setFormLokasiRak(e.target.value)}
                    placeholder="Rak A-01"
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-[#33343A]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#2E2F35] text-white font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white font-bold"
                >
                  Simpan Kain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kartu Stok (Ledger Drawer / Modal) */}
      {stockCardProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#232428] border border-[#33343A] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#33343A] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white">Kartu Stok: {stockCardProduct.nama}</h3>
                <p className="text-xs text-[#9A9BA3]">SKU: {stockCardProduct.sku} | Saldo Akhir: <span className="text-[#2ECC71] font-bold">{stockCardProduct.stok_saat_ini} {stockCardProduct.unit?.simbol || 'Roll'}</span></p>
              </div>
              <button onClick={() => setStockCardProduct(null)} className="p-1 rounded-lg text-[#9A9BA3] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-2">
              <table className="w-full text-left text-xs text-white border-collapse">
                <thead>
                  <tr className="border-b border-[#33343A] text-[#9A9BA3]">
                    <th className="py-2">Tanggal</th>
                    <th className="py-2">Tipe Mutasi</th>
                    <th className="py-2 text-right">Masuk</th>
                    <th className="py-2 text-right">Keluar</th>
                    <th className="py-2 text-right">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#33343A]">
                  <tr className="hover:bg-[#2A2B30]">
                    <td className="py-2 text-[#9A9BA3]">16/09/2026</td>
                    <td className="py-2 text-[#2ECC71] font-bold">Barang Masuk (Initial)</td>
                    <td className="py-2 text-right text-[#2ECC71]">+100</td>
                    <td className="py-2 text-right text-[#9A9BA3]">0</td>
                    <td className="py-2 text-right font-bold text-white">{stockCardProduct.stok_saat_ini}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

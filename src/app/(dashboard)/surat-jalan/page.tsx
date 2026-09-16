'use client';

import React, { useState } from 'react';
import { 
  FileText, Printer, Share2, CheckCircle, Clock, Truck, 
  X, AlertTriangle, Eye, Upload, Filter, Search, RotateCcw 
} from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { formatDateShort, formatNumberIndonesian } from '@/lib/utils/format';
import { generateSuratJalanPDF } from '@/lib/pdf/surat-jalan-pdf';
import { DeliveryNote } from '@/types';

export default function SuratJalanPage() {
  const { deliveryNotes, updateDeliveryNoteStatus, confirmDeliveryReceipt, businessInfo } = useApp();
  const [directionFilter, setDirectionFilter] = useState<'all' | 'keluar' | 'masuk'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Confirmation Modal State
  const [selectedDnForConfirm, setSelectedDnForConfirm] = useState<DeliveryNote | null>(null);
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiverName, setReceiverName] = useState('');
  const [returnItems, setReturnItems] = useState<Array<{ item_id: string; product_id: string; qty_retur: number; alasan: string }>>([]);

  const filteredNotes = deliveryNotes.filter((d) => {
    const matchesDirection = directionFilter === 'all' || d.arah === directionFilter;
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesSearch =
      (d.nomor_surat_jalan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.nama_penerima || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.customer?.nama || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDirection && matchesStatus && matchesSearch;
  });

  const handlePrintPDF = (dn: DeliveryNote) => {
    generateSuratJalanPDF({
      deliveryNote: dn,
      businessInfo,
      showPrices: false,
    });
  };

  const openConfirmModal = (dn: DeliveryNote) => {
    setSelectedDnForConfirm(dn);
    setReceiverName(dn.nama_penerima || '');
    setReceiptDate(new Date().toISOString().slice(0, 10));

    if (dn.transaction?.items) {
      setReturnItems(
        dn.transaction.items.map((i) => ({
          item_id: i.id,
          product_id: i.product_id,
          qty_retur: 0,
          alasan: '',
        }))
      );
    }
  };

  const submitReceiptConfirmation = () => {
    if (!selectedDnForConfirm || !receiverName) return;

    const activeReturns = returnItems.filter((r) => r.qty_retur > 0);

    confirmDeliveryReceipt(selectedDnForConfirm.id, {
      tanggal_terima: receiptDate,
      nama_penerima: receiverName,
      returns: activeReturns,
    });

    setSelectedDnForConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Dokumen Resmi Pergudangan</p>
          <h1 className="text-2xl font-extrabold text-white">Manajemen & Arsip Surat Jalan</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[#232428] rounded-2xl border border-[#33343A] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9BA3]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari No. SJ, penerima, customer..."
            className="w-full bg-[#2E2F35] text-xs text-white placeholder-[#6B6C75] pl-9 pr-4 py-2.5 rounded-xl border border-[#33343A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Direction Filter */}
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value as any)}
            className="bg-[#2E2F35] text-xs text-white px-3 py-2.5 rounded-xl border border-[#33343A]"
          >
            <option value="all">Semua Arah (Keluar & Masuk)</option>
            <option value="keluar">Surat Jalan Keluar (Sistem)</option>
            <option value="masuk">Surat Jalan Masuk (Pemasok)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#2E2F35] text-xs text-white px-3 py-2.5 rounded-xl border border-[#33343A]"
          >
            <option value="all">Semua Status</option>
            <option value="diterbitkan">Diterbitkan</option>
            <option value="dalam_pengiriman">Dalam Pengiriman</option>
            <option value="diterima">Diterima Sempurna</option>
            <option value="ditolak_sebagian">Ditolak / Retur</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white border-collapse">
            <thead>
              <tr className="border-b border-[#33343A] text-[#9A9BA3] text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">No. Surat Jalan</th>
                <th className="py-3 px-3">Arah</th>
                <th className="py-3 px-3">Tanggal Kirim</th>
                <th className="py-3 px-3">Tujuan / Penerima</th>
                <th className="py-3 px-3">Sopir / Kendaraan</th>
                <th className="py-3 px-3">Status Alur</th>
                <th className="py-3 px-3 text-right">Cetak & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33343A]">
              {filteredNotes.map((dn) => (
                <tr key={dn.id} className="hover:bg-[#2A2B30] transition-colors">
                  <td className="py-3 px-3 font-bold text-white">
                    {dn.nomor_surat_jalan || dn.nomor_sj_pemasok || 'DRAFT'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        dn.arah === 'keluar' ? 'bg-[#6C5CE7]/20 text-[#6C5CE7]' : 'bg-[#4A9BFF]/20 text-[#4A9BFF]'
                      }`}
                    >
                      SJ {dn.arah.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#9A9BA3]">{formatDateShort(dn.tanggal_kirim || dn.tanggal)}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-white">{dn.customer?.nama || dn.nama_penerima || '-'}</p>
                    <p className="text-[11px] text-[#9A9BA3] truncate max-w-xs">{dn.alamat_tujuan || '-'}</p>
                  </td>
                  <td className="py-3 px-3 text-[#9A9BA3]">
                    {dn.nama_sopir ? `${dn.nama_sopir} (${dn.nomor_kendaraan || '-'})` : '-'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        dn.status === 'diterima'
                          ? 'badge-success'
                          : dn.status === 'dalam_pengiriman'
                          ? 'badge-info'
                          : dn.status === 'ditolak_sebagian'
                          ? 'badge-warning'
                          : 'badge-purple'
                      }`}
                    >
                      {dn.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {dn.arah === 'keluar' && (
                        <button
                          onClick={() => handlePrintPDF(dn)}
                          className="px-3 py-1.5 rounded-xl bg-[#6C5CE7]/20 text-[#6C5CE7] hover:bg-[#6C5CE7]/30 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" /> PDF 3-Rangkap
                        </button>
                      )}

                      {dn.status === 'dalam_pengiriman' && (
                        <button
                          onClick={() => openConfirmModal(dn)}
                          className="px-3 py-1.5 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Konfirmasi Terima
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal with Return Quantity Inputs */}
      {selectedDnForConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#232428] border border-[#33343A] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#33343A] pb-3">
              <h3 className="font-extrabold text-base text-white">
                Konfirmasi Penerimaan SJ: {selectedDnForConfirm.nomor_surat_jalan}
              </h3>
              <button onClick={() => setSelectedDnForConfirm(null)} className="p-1 text-[#9A9BA3] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Tanggal Diterima *</label>
                  <input
                    type="date"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>

                <div>
                  <label className="block text-[#9A9BA3] font-bold mb-1">Nama Penerima *</label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
                  />
                </div>
              </div>

              {/* Retur Section */}
              <div className="p-3 bg-[#2A2B30] rounded-2xl border border-[#33343A] space-y-2">
                <p className="font-bold text-xs text-[#FF8A3D] flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" /> Ada Barang Ditolak / Retur?
                </p>
                <p className="text-[11px] text-[#9A9BA3]">
                  Jika penerima menolak sebagian item, isi Qty Retur. Stok akan otomatis diisi kembali lewat transaksi retur masuk.
                </p>

                {returnItems.map((r, idx) => (
                  <div key={r.item_id} className="grid grid-cols-3 gap-2 items-center pt-2">
                    <span className="text-white truncate">Item #{idx + 1}</span>
                    <input
                      type="number"
                      placeholder="Qty Retur"
                      value={r.qty_retur || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setReturnItems((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, qty_retur: val } : item))
                        );
                      }}
                      className="bg-[#2E2F35] text-white p-2 rounded-xl border border-[#33343A]"
                    />
                    <input
                      type="text"
                      placeholder="Alasan retur..."
                      value={r.alasan}
                      onChange={(e) => {
                        const val = e.target.value;
                        setReturnItems((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, alasan: val } : item))
                        );
                      }}
                      className="bg-[#2E2F35] text-white p-2 rounded-xl border border-[#33343A]"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-[#33343A]">
                <button
                  type="button"
                  onClick={() => setSelectedDnForConfirm(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#2E2F35] text-white font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={submitReceiptConfirmation}
                  className="px-5 py-2.5 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-bold"
                >
                  Simpan Penerimaan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

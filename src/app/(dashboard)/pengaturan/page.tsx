'use client';

import React, { useState } from 'react';
import { Settings, Users, Truck, Shield, History, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { formatDateLong } from '@/lib/utils/format';

export default function PengaturanPage() {
  const { businessInfo, updateBusinessInfo, profiles, suppliers, customers, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'partners' | 'options' | 'audit'>('users');

  const toggleAllowNegativeStock = () => {
    updateBusinessInfo({ allow_negative_stock: !businessInfo.allow_negative_stock });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Konfigurasi Sistem</p>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#6C5CE7]" />
          Pengaturan, Pengguna & Audit Log
        </h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#33343A] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-[#6C5CE7] text-white' : 'text-[#9A9BA3] hover:text-white'
          }`}
        >
          Manajemen User ({profiles.length})
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'partners' ? 'bg-[#6C5CE7] text-white' : 'text-[#9A9BA3] hover:text-white'
          }`}
        >
          Master Supplier & Customer
        </button>

        <button
          onClick={() => setActiveTab('options')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'options' ? 'bg-[#6C5CE7] text-white' : 'text-[#9A9BA3] hover:text-white'
          }`}
        >
          Opsi & Aturan Stok
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'audit' ? 'bg-[#6C5CE7] text-white' : 'text-[#9A9BA3] hover:text-white'
          }`}
        >
          Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Users */}
      {activeTab === 'users' && (
        <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg">
          <h3 className="font-bold text-sm text-white">Daftar Pengguna & Peran Akses</h3>
          <table className="w-full text-left text-xs text-white border-collapse">
            <thead>
              <tr className="border-b border-[#33343A] text-[#9A9BA3] text-[11px] uppercase">
                <th className="py-2.5 px-3">Nama Lengkap</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Peran (Role)</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33343A]">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-[#2A2B30]">
                  <td className="py-3 px-3 font-bold text-white">{p.nama_lengkap}</td>
                  <td className="py-3 px-3 text-[#9A9BA3]">{p.email || 'user@gudangkain.id'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6C5CE7]/20 text-[#6C5CE7] uppercase">
                      {p.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold badge-success">Aktif</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Partners */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-3 shadow-lg">
            <h3 className="font-bold text-sm text-white">Master Supplier (5 Vendor)</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {suppliers.map((s) => (
                <div key={s.id} className="p-3 bg-[#2A2B30] rounded-xl text-xs space-y-1">
                  <p className="font-bold text-white">{s.nama} ({s.kode})</p>
                  <p className="text-[11px] text-[#9A9BA3]">Up: {s.kontak_person || '-'} | Telp: {s.telepon}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-3 shadow-lg">
            <h3 className="font-bold text-sm text-white">Master Customer (5 Pelanggan)</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {customers.map((c) => (
                <div key={c.id} className="p-3 bg-[#2A2B30] rounded-xl text-xs space-y-1">
                  <p className="font-bold text-white">{c.nama} ({c.kode})</p>
                  <p className="text-[11px] text-[#9A9BA3]">Up: {c.kontak_person || '-'} | Telp: {c.telepon}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Options */}
      {activeTab === 'options' && (
        <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-5 shadow-lg max-w-xl text-xs">
          <h3 className="font-bold text-sm text-white">Aturan & Kebijakan Pergudangan</h3>

          <div className="p-4 bg-[#2A2B30] rounded-2xl border border-[#33343A] flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-sm">Izinkan Stok Minus saat Barang Keluar</p>
              <p className="text-[11px] text-[#9A9BA3] max-w-sm">
                Bila nonaktif (default), transaksi keluar melebihi stok fisik akan ditolak secara ketat oleh database trigger.
              </p>
            </div>

            <button onClick={toggleAllowNegativeStock} className="text-[#6C5CE7] hover:scale-105 transition-transform">
              {businessInfo.allow_negative_stock ? (
                <ToggleRight className="w-10 h-10 text-[#6C5CE7]" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-[#6B6C75]" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-4 shadow-lg overflow-hidden">
          <h3 className="font-bold text-sm text-white">Riwayat Audit Sistem (Immutable)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white border-collapse">
              <thead>
                <tr className="border-b border-[#33343A] text-[#9A9BA3] text-[11px] uppercase">
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">Pengguna</th>
                  <th className="py-2.5 px-3">Aksi</th>
                  <th className="py-2.5 px-3">Tabel Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#33343A]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#2A2B30]">
                    <td className="py-2.5 px-3 text-[#9A9BA3]">{formatDateLong(log.created_at)}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{log.user_name || 'System'}</td>
                    <td className="py-2.5 px-3 font-mono text-[#2ECC71]">{log.aksi}</td>
                    <td className="py-2.5 px-3 text-[#9A9BA3]">{log.tabel} ({log.record_id || '-'})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

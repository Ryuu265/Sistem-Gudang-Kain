'use client';

import React, { useState } from 'react';
import { Building2, Save, Upload, CheckCircle } from 'lucide-react';
import { useApp } from '@/lib/store/app-context';

export default function InfoBisnisPage() {
  const { businessInfo, updateBusinessInfo } = useApp();

  const [namaBisnis, setNamaBisnis] = useState(businessInfo.nama_bisnis);
  const [logoUrl, setLogoUrl] = useState(businessInfo.logo_url || '');
  const [alamat, setAlamat] = useState(businessInfo.alamat || '');
  const [kota, setKota] = useState(businessInfo.kota || '');
  const [provinsi, setProvinsi] = useState(businessInfo.provinsi || '');
  const [kodePos, setKodePos] = useState(businessInfo.kode_pos || '');
  const [telepon, setTelepon] = useState(businessInfo.telepon || '');
  const [email, setEmail] = useState(businessInfo.email || '');
  const [npwp, setNpwp] = useState(businessInfo.npwp || '');
  const [website, setWebsite] = useState(businessInfo.website || '');
  const [catatanFooter, setCatatanFooter] = useState(businessInfo.catatan_footer || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo({
      nama_bisnis: namaBisnis,
      logo_url: logoUrl,
      alamat,
      kota,
      provinsi,
      kode_pos: kodePos,
      telepon,
      email,
      npwp,
      website,
      catatan_footer: catatanFooter,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <p className="text-xs font-semibold text-[#9A9BA3] uppercase tracking-wider">Identitas Usaha</p>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#6C5CE7]" />
          Info Bisnis & Kop Dokumen
        </h1>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#2ECC71]/15 border border-[#2ECC71]/40 rounded-2xl flex items-center gap-3 text-xs text-[#2ECC71] font-bold">
          <CheckCircle className="w-5 h-5" />
          <span>Informasi Bisnis berhasil diperbarui! Seluruh Surat Jalan & PDF Laporan akan otomatis menggunakan kop ini.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 bg-[#232428] rounded-3xl border border-[#33343A] space-y-5 shadow-xl text-xs">
        {/* Logo Upload Simulation */}
        <div className="flex items-center gap-5 p-4 bg-[#2A2B30] rounded-2xl border border-[#33343A]">
          <div className="w-16 h-16 rounded-2xl bg-[#1A1B1F] border border-[#33343A] overflow-hidden flex items-center justify-center shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-[#6B6C75]" />
            )}
          </div>
          <div className="space-y-1 flex-1">
            <label className="block font-bold text-white">URL Logo Usaha</label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Nama Bisnis / Perusahaan *</label>
            <input
              type="text"
              required
              value={namaBisnis}
              onChange={(e) => setNamaBisnis(e.target.value)}
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>

          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">NPWP Resmi</label>
            <input
              type="text"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
              placeholder="01.888.777.6-441.000"
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#9A9BA3] font-bold mb-1">Alamat Lengkap Kantor / Gudang</label>
          <textarea
            rows={2}
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Kota</label>
            <input
              type="text"
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Provinsi</label>
            <input
              type="text"
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Kode Pos</label>
            <input
              type="text"
              value={kodePos}
              onChange={(e) => setKodePos(e.target.value)}
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Telepon Kantor</label>
            <input
              type="text"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Email Resmi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#9A9BA3] font-bold mb-1">Catatan Footer Dokumen (Syarat Penerimaan Surat Jalan)</label>
          <textarea
            rows={3}
            value={catatanFooter}
            onChange={(e) => setCatatanFooter(e.target.value)}
            className="w-full bg-[#2E2F35] text-white p-2.5 rounded-xl border border-[#33343A]"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white font-bold flex items-center gap-2 shadow-lg shadow-[#6C5CE7]/25"
          >
            <Save className="w-4 h-4" /> Simpan Info Bisnis
          </button>
        </div>
      </form>
    </div>
  );
}

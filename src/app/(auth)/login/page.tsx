'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@gudangkain.id');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1A1B1F] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#232428] border border-[#33343A] rounded-3xl p-8 space-y-6 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B61FF] to-[#6C5CE7] mx-auto flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#6C5CE7]/30">
            GK
          </div>
          <h1 className="text-2xl font-extrabold text-white">Sistem Gudang Kain</h1>
          <p className="text-xs text-[#9A9BA3]">Masuk ke akun pergudangan & distribusi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Email Pengguna</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9BA3]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2E2F35] text-white pl-10 pr-4 py-3 rounded-xl border border-[#33343A] focus:outline-none focus:border-[#6C5CE7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#9A9BA3] font-bold mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9BA3]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2E2F35] text-white pl-10 pr-4 py-3 rounded-xl border border-[#33343A] focus:outline-none focus:border-[#6C5CE7]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#6C5CE7] hover:bg-[#7D6FF0] text-white font-bold text-xs shadow-lg shadow-[#6C5CE7]/25 flex items-center justify-center gap-2 transition-all"
          >
            Masuk ke System <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-[#2A2B30] rounded-xl border border-[#33343A] text-center text-[11px] text-[#9A9BA3]">
          <p className="font-bold text-white mb-0.5">Akun Demostrasi Ready:</p>
          <p>Admin: <span className="text-[#6C5CE7] font-mono">admin@gudangkain.id</span></p>
          <p>Staf: <span className="text-[#2ECC71] font-mono">staff@gudangkain.id</span></p>
        </div>
      </div>
    </div>
  );
}

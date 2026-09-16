import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Sistem Gudang Kain - Distribusi & Manajemen Stok',
  description: 'Aplikasi sistem pergudangan dan distribusi kain resmi dengan akurasi stok realtime dan pencetakan surat jalan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="antialiased bg-[#1A1B1F] text-white font-sans">{children}</body>
    </html>
  );
}

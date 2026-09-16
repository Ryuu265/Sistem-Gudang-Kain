import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { DeliveryNote, BusinessInfo, TransactionItem } from '@/types';
import { formatDateShort, formatNumberIndonesian } from '../utils/format';

export async function generateSuratJalanPDF({
  deliveryNote,
  businessInfo,
  showPrices = false,
}: {
  deliveryNote: DeliveryNote;
  businessInfo: BusinessInfo;
  showPrices?: boolean;
}) {
  const doc = new jsPDF('p', 'mm', 'a4');

  const copies = [
    { label: 'RANGKAP 1: ASLI (UNTUK PENERIMA BARANG)', color: [46, 204, 113] },
    { label: 'RANGKAP 2: COPY 1 (ARSIP GUDANG)', color: [108, 92, 231] },
    { label: 'RANGKAP 3: COPY 2 (UNTUK SOPIR / EKSPEDISI)', color: [255, 138, 61] },
  ];

  // Generate QR Code Data URL
  const qrDataText = `SURAT JALAN: ${deliveryNote.nomor_surat_jalan || '-'}\nTANGGAL: ${deliveryNote.tanggal}\nTENTANG: Pengiriman Gudang Kain\nCEK: RESMI`;
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(qrDataText, { margin: 1, width: 100 });
  } catch (err) {
    console.warn('QR Code generation failed:', err);
  }

  copies.forEach((copy, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // 1. Copy Badge Header (Top Right)
    doc.setFillColor(copy.color[0], copy.color[1], copy.color[2]);
    doc.rect(120, 10, 76, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(copy.label, 158, 14.8, { align: 'center' });

    // 2. Business Header (Kop)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(26, 27, 31);
    doc.text(businessInfo.nama_bisnis.toUpperCase(), 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 90);
    const addr = `${businessInfo.alamat || ''}, ${businessInfo.kota || ''} ${businessInfo.provinsi || ''}`;
    doc.text(addr, 14, 25);
    doc.text(`Telp: ${businessInfo.telepon || '-'} | Email: ${businessInfo.email || '-'} | NPWP: ${businessInfo.npwp || '-'}`, 14, 29);

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // 3. Document Title & SJ Info Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(108, 92, 231);
    doc.text('SURAT JALAN', 14, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`No. Surat Jalan : `, 14, 46);
    doc.setFont('helvetica', 'bold');
    doc.text(deliveryNote.nomor_surat_jalan || 'DRAFT', 42, 46);

    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal Kirim   : ${formatDateShort(deliveryNote.tanggal_kirim || deliveryNote.tanggal)}`, 14, 51);

    // 4. Two Column Box: Pengirim & Penerima
    const boxY = 56;
    doc.setDrawColor(210, 210, 215);
    doc.setFillColor(248, 249, 250);
    
    // Left Box - Pengirim
    doc.roundedRect(14, boxY, 88, 30, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.text('PENGIRIM (GUDANG ASAL)', 18, boxY + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(businessInfo.nama_bisnis, 18, boxY + 11);
    doc.text(`Kontak : ${businessInfo.telepon || '-'}`, 18, boxY + 16);
    doc.text(`Kota   : ${businessInfo.kota || 'Bandung'}`, 18, boxY + 21);

    // Right Box - Penerima
    doc.roundedRect(108, boxY, 88, 30, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.text('PENERIMA (TUJUAN PENGIRIMAN)', 112, boxY + 6);
    doc.setFont('helvetica', 'normal');
    const custName = deliveryNote.customer?.nama || deliveryNote.nama_penerima || 'Customer';
    doc.text(custName.slice(0, 35), 112, boxY + 11);
    doc.text(`Up.    : ${deliveryNote.nama_penerima || '-'}`, 112, boxY + 16);
    const tujuan = (deliveryNote.alamat_tujuan || '-').slice(0, 45);
    doc.text(`Alamat : ${tujuan}`, 112, boxY + 21);
    doc.text(`Telp   : ${deliveryNote.telepon_tujuan || '-'}`, 112, boxY + 26);

    // 5. Vehicle & Delivery Details Bar
    const vehY = boxY + 33;
    doc.setFillColor(235, 237, 242);
    doc.rect(14, vehY, 182, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text(`Ekspedisi: ${deliveryNote.ekspedisi || 'Internal'}`, 18, vehY + 5.5);
    doc.text(`No. Polisi: ${deliveryNote.nomor_kendaraan || '-'}`, 70, vehY + 5.5);
    doc.text(`Sopir: ${deliveryNote.nama_sopir || '-'}`, 120, vehY + 5.5);
    doc.text(`Koli: ${deliveryNote.jumlah_koli || 1} Pcs`, 165, vehY + 5.5);

    // 6. Items Table
    const tableItems = deliveryNote.transaction?.items || [];
    const headers = ['No', 'SKU Kain', 'Nama Kain', 'Warna', 'Qty Kirim', 'Satuan', 'Keterangan'];
    if (showPrices) {
      headers.push('Harga (Rp)', 'Subtotal (Rp)');
    }

    const rows = tableItems.map((item: TransactionItem, i: number) => {
      const prod = item.product;
      const qtyStr = formatNumberIndonesian(item.qty_aktual || item.qty);
      const row = [
        String(i + 1),
        prod?.sku || 'SKU',
        prod?.nama || 'Nama Kain',
        prod?.warna || '-',
        qtyStr,
        prod?.unit?.simbol || 'Roll',
        item.keterangan || 'Kondisi Baik',
      ];
      if (showPrices) {
        row.push(formatNumberIndonesian(item.harga_satuan), formatNumberIndonesian(item.subtotal));
      }
      return row;
    });

    autoTable(doc, {
      startY: vehY + 11,
      head: [headers],
      body: rows.length > 0 ? rows : [['1', 'SKU-001', 'Cotton Combed 30s Black', 'Hitam', '50', 'Roll', 'Roll Mulus']],
      theme: 'grid',
      headStyles: {
        fillColor: [108, 92, 231],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [40, 40, 40],
      },
    });

    // 7. Notes & Terms
    const tableFinalY = (doc as any).lastAutoTable.finalY || 160;
    const notesY = Math.min(tableFinalY + 6, 210);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    const footerNotes = businessInfo.catatan_footer || 'Barang yang telah diterima sesuai surat jalan ini tidak dapat dikembalikan tanpa persetujuan.';
    doc.text(`Catatan Syarat Penerimaan: ${footerNotes}`, 14, notesY, { maxWidth: 140 });

    // QR Code Box (Bottom Right)
    if (qrCodeDataUrl) {
      doc.addImage(qrCodeDataUrl, 'PNG', 165, notesY - 3, 28, 28);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.text('Scan Pengecekan', 179, notesY + 26, { align: 'center' });
    }

    // 8. Signature Block (3 Columns)
    const sigY = notesY + 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);

    doc.text('Tanda Tangan Pengirim,', 22, sigY);
    doc.text('Tanda Tangan Sopir/Kurir,', 78, sigY);
    doc.text('Tanda Tangan Penerima,', 135, sigY);

    // Signature Line
    doc.line(18, sigY + 20, 62, sigY + 20);
    doc.line(74, sigY + 20, 118, sigY + 20);
    doc.line(130, sigY + 20, 174, sigY + 20);

    doc.text('( Bagian Gudang )', 25, sigY + 24);
    doc.text(`( ${deliveryNote.nama_sopir || 'Sopir Ekspedisi'} )`, 76, sigY + 24);
    doc.text(`( ${deliveryNote.nama_penerima || 'Penerima'} )`, 134, sigY + 24);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('Tgl: ___/___/2026', 136, sigY + 28);
  });

  const sjNumberClean = (deliveryNote.nomor_surat_jalan || 'SJ-DRAFT').replace(/\//g, '-');
  doc.save(`Surat_Jalan_${sjNumberClean}.pdf`);
}

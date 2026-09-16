import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BusinessInfo } from '@/types';
import { formatDateShort, formatRupiah, formatNumberIndonesian } from './format';

/**
 * Export data to Excel (.xlsx) file
 */
export function exportToExcel(data: any[], fileName: string, sheetName: string = 'Data') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Export data to CSV file
 */
export function exportToCSV(data: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export structured report to PDF with Kop Business
 */
export function exportReportToPDF({
  title,
  period,
  businessInfo,
  headers,
  rows,
  fileName,
}: {
  title: string;
  period?: string;
  businessInfo: BusinessInfo;
  headers: string[];
  rows: (string | number)[][];
  fileName: string;
}) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Business Header (Kop Dokumen)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(businessInfo.nama_bisnis.toUpperCase(), 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const addressText = `${businessInfo.alamat || ''}, ${businessInfo.kota || ''} ${businessInfo.provinsi || ''} ${businessInfo.kode_pos || ''}`;
  doc.text(addressText, 14, 23);
  doc.text(`Telp: ${businessInfo.telepon || '-'} | Email: ${businessInfo.email || '-'} | NPWP: ${businessInfo.npwp || '-'}`, 14, 27);

  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, 30, 196, 30);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(108, 92, 231); // Primary Purple
  doc.text(title.toUpperCase(), 14, 38);

  if (period) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Periode: ${period}`, 14, 43);
  }

  // Table
  autoTable(doc, {
    startY: period ? 47 : 42,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [108, 92, 231],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
  });

  // Footer Signature Block
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  if (finalY < 230) {
    const sigY = finalY + 15;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    doc.text('Dibuat Oleh,', 25, sigY);
    doc.text('Diperiksa Oleh,', 90, sigY);
    doc.text('Disetujui Oleh,', 155, sigY);

    doc.line(20, sigY + 25, 60, sigY + 25);
    doc.line(85, sigY + 25, 125, sigY + 25);
    doc.line(150, sigY + 25, 190, sigY + 25);

    doc.text('( Staf Gudang )', 27, sigY + 29);
    doc.text('( Kepala Gudang )', 90, sigY + 29);
    doc.text('( Manager Ops )', 155, sigY + 29);
  }

  doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

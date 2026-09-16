import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format number with Indonesian locale (1.250,5)
 */
export function formatNumberIndonesian(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format currency to Rupiah (Rp 1.250.000)
 */
export function formatRupiah(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return 'Rp 0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format date to DD/MM/YYYY
 */
export function formatDateShort(dateStr?: string | Date | null): string {
  if (!dateStr) return '-';
  try {
    const dateObj = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(dateObj, 'dd/MM/yyyy', { locale: id });
  } catch (err) {
    return String(dateStr);
  }
}

/**
 * Format date to long Indonesian date (16 September 2026)
 */
export function formatDateLong(dateStr?: string | Date | null): string {
  if (!dateStr) return '-';
  try {
    const dateObj = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(dateObj, 'd MMMM yyyy', { locale: id });
  } catch (err) {
    return String(dateStr);
  }
}

/**
 * Format date & time (16 September 2026, 14:30 WIB)
 */
export function formatDateTimeIndonesian(dateStr?: string | Date | null): string {
  if (!dateStr) return '-';
  try {
    const dateObj = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(dateObj, "d MMMM yyyy, HH:mm 'WIB'", { locale: id });
  } catch (err) {
    return String(dateStr);
  }
}

/**
 * Calculate stock status badge info
 */
export function getStockStatus(stok: number, minStok: number): {
  label: 'Habis' | 'Menipis' | 'Aman';
  colorClass: string;
  badgeVariant: 'danger' | 'warning' | 'success';
} {
  if (stok <= 0) {
    return { label: 'Habis', colorClass: 'badge-danger', badgeVariant: 'danger' };
  }
  if (stok <= minStok) {
    return { label: 'Menipis', colorClass: 'badge-warning', badgeVariant: 'warning' };
  }
  return { label: 'Aman', colorClass: 'badge-success', badgeVariant: 'success' };
}

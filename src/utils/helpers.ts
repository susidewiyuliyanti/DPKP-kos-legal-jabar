import QRCode from 'qrcode';
import { KosData, DukcapilResult, LaporanIlegal } from '../types';
import { INITIAL_KOS_LIST, INITIAL_LAPORAN_LIST } from '../data/initialKos';

export const STORAGE_KEY_KOS = 'KOS_LEGAL_JABAR';
export const STORAGE_KEY_LAPORAN = 'KOS_LEGAL_LAPORAN';

export function getStoredKosList(): KosData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_KOS, JSON.stringify(INITIAL_KOS_LIST));
      return INITIAL_KOS_LIST;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY_KOS, JSON.stringify(INITIAL_KOS_LIST));
    return INITIAL_KOS_LIST;
  } catch {
    return INITIAL_KOS_LIST;
  }
}

export function saveStoredKosList(list: KosData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_KOS, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save kos data to localStorage', err);
  }
}

export function getStoredLaporanList(): LaporanIlegal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAPORAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LAPORAN, JSON.stringify(INITIAL_LAPORAN_LIST));
      return INITIAL_LAPORAN_LIST;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_LAPORAN_LIST;
  } catch {
    return INITIAL_LAPORAN_LIST;
  }
}

export function saveStoredLaporanList(list: LaporanIlegal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAPORAN, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save laporan to localStorage', err);
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

// Simulasi Verifikasi Dukcapil Kemendagri & Disdukcapil Jabar
export function simulateDukcapilCheck(nik: string, namaLengkap?: string): DukcapilResult {
  const cleanNik = nik.trim().replace(/\D/g, '');

  if (cleanNik.length !== 16) {
    return {
      valid: false,
      nik: cleanNik,
      pesan: 'Format NIK harus tepat 16 digit angka.'
    };
  }

  const provCode = cleanNik.substring(0, 2);
  if (provCode !== '32') {
    return {
      valid: false,
      nik: cleanNik,
      pesan: `Kode Provinsi (${provCode}) bukan Jawa Barat (Kode 32). Silakan pastikan NIK KTP domisili Jawa Barat atau KTP Nasional valid.`
    };
  }

  const kabCode = cleanNik.substring(0, 4);
  let kabupatenNama = 'Jawa Barat';
  if (kabCode === '3273') kabupatenNama = 'Kota Bandung';
  else if (kabCode === '3204') kabupatenNama = 'Kabupaten Bandung';
  else if (kabCode === '3217') kabupatenNama = 'Kab. Bandung Barat';
  else if (kabCode === '3277') kabupatenNama = 'Kota Cimahi';
  else if (kabCode === '3271') kabupatenNama = 'Kota Bogor';
  else if (kabCode === '3201') kabupatenNama = 'Kabupaten Bogor';
  else if (kabCode === '3276') kabupatenNama = 'Kota Depok';
  else if (kabCode === '3275') kabupatenNama = 'Kota Bekasi';
  else if (kabCode === '3216') kabupatenNama = 'Kabupaten Bekasi';
  else if (kabCode === '3278') kabupatenNama = 'Kota Tasikmalaya';
  else if (kabCode === '3206') kabupatenNama = 'Kabupaten Tasikmalaya';
  else if (kabCode === '3211') kabupatenNama = 'Kabupaten Sumedang';
  else if (kabCode === '3207') kabupatenNama = 'Kabupaten Ciamis';

  // Extract tanggal lahir dari NIK: DDMMYY (digits 7-12)
  const rawDay = parseInt(cleanNik.substring(6, 8), 10);
  const rawMonth = parseInt(cleanNik.substring(8, 10), 10);
  const rawYear = parseInt(cleanNik.substring(10, 12), 10);

  let gender = 'Laki-laki';
  let day = rawDay;
  if (rawDay > 40) {
    gender = 'Perempuan';
    day = rawDay - 40;
  }

  const birthYear = rawYear > 30 ? 1900 + rawYear : 2000 + rawYear;
  const birthStr = `${day.toString().padStart(2, '0')}-${rawMonth.toString().padStart(2, '0')}-${birthYear}`;

  return {
    valid: true,
    nik: cleanNik,
    namaLengkap: namaLengkap || 'Terdaftar di Database Kependudukan Dukcapil',
    provinsi: 'Jawa Barat (Kode 32)',
    kabupaten: kabupatenNama,
    jenisKelamin: gender,
    tanggalLahir: birthStr,
    pesan: 'Data NIK Valid & Terverifikasi melalui Gate API Dukcapil Kemendagri / Disdukcapil Jabar.'
  };
}

// Generate Data URL for QR Code
export async function generateQrCodeUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0B3D91', // Official Government Blue
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Error generating QR Code', err);
    return '';
  }
}

// Export data to CSV
export function exportKosToCSV(data: KosData[]): void {
  const headers = [
    'No Izin',
    'Nama Kos',
    'Pemilik',
    'NIK',
    'WhatsApp',
    'Alamat Lokasi',
    'Kabupaten/Kota',
    'Jumlah Kamar',
    'Kamar Terisi',
    'Kamar Kosong',
    'Status Verifikasi',
    'Status Pajak Daerah',
    'Masa Berlaku Izin',
    'Tanggal Pendaftaran'
  ];

  const rows = data.map((item) => [
    `"${item.no_izin}"`,
    `"${item.nama.replace(/"/g, '""')}"`,
    `"${item.pemilik.replace(/"/g, '""')}"`,
    `'${item.nik}`,
    `'${item.wa}`,
    `"${item.lokasi.replace(/"/g, '""')}"`,
    `"${item.kabupaten}"`,
    item.jumlah_kamar,
    item.kamar_terisi,
    item.jumlah_kamar - item.kamar_terisi,
    `"${item.status}"`,
    `"${item.pajak_status}"`,
    `"${item.izin_valid_until}"`,
    `"${item.tanggal_daftar}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `DATA_KOS_LEGAL_JABAR_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

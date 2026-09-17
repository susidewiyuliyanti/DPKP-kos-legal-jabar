export type StatusVerifikasi = 'Terverifikasi' | 'Menunggu Verifikasi' | 'Ditolak';
export type StatusPajak = 'Lunas' | 'Belum Bayar' | 'Jatuh Tempo';
export type UserRole = 'admin' | 'owner' | 'warga';

export interface KosData {
  id: string;
  nama: string;
  pemilik: string;
  nik: string;
  wa: string;
  lokasi: string;
  kabupaten: string;
  kecamatan?: string;
  jumlah_kamar: number;
  kamar_terisi: number;
  status: StatusVerifikasi;
  foto_ktp_base64: string;
  foto_bangunan_base64: string;
  pajak_status: StatusPajak;
  izin_valid_until: string;
  no_izin: string;
  tanggal_daftar: string;
  harga_per_bulan?: number;
  fasilitas?: string[];
  lat?: number;
  lng?: number;
  catatan_petugas?: string;
  va_bjb?: string;
  terakhir_bayar_pajak?: string;
}

export interface LaporanIlegal {
  id: string;
  nama_kos_terduga: string;
  alamat_lengkap: string;
  kabupaten: string;
  nama_pelapor: string;
  kontak_pelapor: string;
  deskripsi: string;
  foto_base64?: string;
  tanggal_lapor: string;
  status: 'Menunggu Investigasi' | 'Dalam Peninjauan Satpol PP' | 'Terbukti Ilegal' | 'Selesai';
}

export interface DukcapilResult {
  valid: boolean;
  nik: string;
  namaLengkap?: string;
  provinsi?: string;
  kabupaten?: string;
  jenisKelamin?: string;
  tanggalLahir?: string;
  pesan: string;
}

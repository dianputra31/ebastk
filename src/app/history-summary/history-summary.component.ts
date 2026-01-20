import { Component, OnInit, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import SignaturePad from 'signature_pad';
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  


@Component({
  selector: 'app-history-summary',
  templateUrl: './history-summary.component.html',
  styleUrls: ['./history-summary.component.scss']
})
export class HistorySummaryComponent implements OnInit, AfterViewInit {
HiThere: string = 'User';
HiEmail: string = 'Email';
sekarang: string = '';
isLoading: boolean = false;
@ViewChild('signatureCanvas') canvas!: ElementRef<HTMLCanvasElement>;
signaturePad!: SignaturePad;
errlog:string = '';
sampleDataVendor: VendorDetailResponse | null = null;
currentDate: Date = new Date(); // Mendapatkan tanggal dan waktu saat ini
bastk_timestamp: string | null | undefined;

// Modal properties
isSignatureModalOpen: boolean = false;
modalTitle: string = '';
currentSignatureType: 'pengirim' | 'penerima' | null = null;
pengirimSignature: string | null = null;
penerimaSignature: string | null = null;
isDrawingMode: boolean = true; // true = drawing, false = preview
uploadError: string = ''; // Pesan error saat upload gagal
sampleDataInfo: UnitDetailResponse | null = null;
bastk_status: string = "draft";
isButtonDisabled: boolean = false;


  constructor(private router:Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {

    this.infoUnit();
    
    this.HiThere = localStorage.getItem('username') || 'User';
    this.HiEmail = localStorage.getItem('email') || 'Email';

    this.sekarang = this.formatTanggalWIB(new Date());

    

  }

  ngAfterViewInit(): void {
    // Canvas akan diinisialisasi saat modal dibuka
  }


    async infoUnit() {
    // this.isLoading = true;

    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/detail-unit?unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<UnitDetailResponse>(endpoint);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.vendor.id) {
        this.sampleDataInfo = response;  
        this.bastk_status = this.sampleDataInfo.bastk_status;
        
        // Tambahkan base URL jika belum ada
        const baseUrl = 'https://admin-tribik.rask.co.id';
        this.pengirimSignature = this.sampleDataInfo.signsender_url 
          ? (this.sampleDataInfo.signsender_url.startsWith('http') 
              ? this.sampleDataInfo.signsender_url 
              : baseUrl + this.sampleDataInfo.signsender_url)
          : null;
        this.penerimaSignature = this.sampleDataInfo.signbastk_url 
          ? (this.sampleDataInfo.signbastk_url.startsWith('http') 
              ? this.sampleDataInfo.signbastk_url 
              : baseUrl + this.sampleDataInfo.signbastk_url)
          : null;
        
        this.bastk_timestamp = this.sampleDataInfo?.bastk_timestamp;
      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }

    } catch (error) {
      this.isButtonDisabled = false;
      // this.authService.logout();
      if (axios.isAxiosError(error)) {
        // Cek status kode dari respons
        if (error.response && error.response.status === 401) {
          this.errlog = 'Username atau password salah.';
        } else {
          this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
        }
      } else {
        this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
      }
      console.error('Error during login:', error);
    }
  }


  openSignatureModal(type: 'pengirim' | 'penerima') {
    this.currentSignatureType = type;
    this.modalTitle = type === 'pengirim' ? 'Pengirim Unit' : 'Penerima Unit';
    
    // Cek apakah sudah ada tanda tangan tersimpan
    const existingSignature = type === 'pengirim' ? this.pengirimSignature : this.penerimaSignature;
    
    if (existingSignature) {
      // Jika sudah ada, tampilkan mode preview
      this.isDrawingMode = false;
    } else {
      // Jika belum ada, tampilkan mode drawing
      this.isDrawingMode = true;
    }
    
    this.isSignatureModalOpen = true;
    
    // Inisialisasi signature pad setelah modal terbuka
    setTimeout(() => {
      if (this.isDrawingMode && this.canvas) {
        this.signaturePad = new SignaturePad(this.canvas.nativeElement, {
          backgroundColor: 'rgb(255,255,255)',
          penColor: 'rgb(0, 0, 0)'
        });
      }
    }, 100);
  }

  closeSignatureModal() {
    this.isSignatureModalOpen = false;
    this.currentSignatureType = null;
    this.isDrawingMode = true;
  }

  editSignature() {
    this.isDrawingMode = true;
    setTimeout(() => {
      if (this.canvas) {
        this.signaturePad = new SignaturePad(this.canvas.nativeElement, {
          backgroundColor: 'rgb(255,255,255)',
          penColor: 'rgb(0, 0, 0)'
        });
      }
    }, 100);
  }


  clear() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  save() {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      alert('Tanda tangan masih kosong');
      return;
    }

    const dataURL = this.signaturePad.toDataURL('image/jpeg', 0.8);
    
    // Simpan berdasarkan tipe
    if (this.currentSignatureType === 'pengirim') {
      this.pengirimSignature = dataURL;
    } else if (this.currentSignatureType === 'penerima') {
      this.penerimaSignature = dataURL;
    }
    
    console.log('Signature saved:', dataURL.substring(0, 50) + '...'); // Debug
    
    // Tutup modal setelah save
    this.closeSignatureModal();
  }

  formatTanggalWIB(date: Date): string {
    // Array nama bulan singkat
    const bulanSingkat = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                         'Juli', 'Agustus', 'Septembre', 'Oktober', 'November', 'Desember'];

    // Ambil komponen tanggal
    const tanggal = date.getDate();
    const bulan = bulanSingkat[date.getMonth()];
    const tahun = date.getFullYear();

    // Ambil jam dan menit dengan penyesuaian WIB (UTC+7)
    // Karena Date() default pakai waktu lokal browser, kita sesuaikan ke WIB:
    // WIB = UTC+7, jadi kita hitung waktu UTC lalu tambah 7 jam
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const waktuWIB = new Date(utc + (3600000 * 7));

    const jam = waktuWIB.getHours().toString().padStart(2, '0');
    const menit = waktuWIB.getMinutes().toString().padStart(2, '0');

    return `${tanggal} ${bulan} ${tahun}, ${jam}:${menit} WIB`;
  }

  backToRiwayatPage(){
    this.router.navigate(['/riwayat']);
  }

  backToInspeksiPage(){
    this.router.navigate(['/inspeksi-unit', this.router.url.split('/').pop()]);
  }

async downloadDokUnit(a:string){
  this.isLoading = true;
    const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
    try {
        const endpoint = `/document/?unit_id=${unit_id}`; // Endpoint API
        await this.apiClient.downloadPdf(endpoint, 'document_bastk.pdf');
      // proses download file...
        } catch (error) {
      // handle error
    } finally {
      this.isLoading = false;
    }
  }

}

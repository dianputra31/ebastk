import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';

@Component({
  selector: 'app-inspection-summary',
  templateUrl: './inspection-summary.component.html',
  styleUrls: ['./inspection-summary.component.scss']
})
export class InspectionSummaryComponent implements OnInit {
HiThere: string = 'User';
HiEmail: string = 'Email';
sekarang: string = '';
isLoading: boolean = false;

  constructor(private router:Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
    
    this.HiThere = localStorage.getItem('username') || 'User';
    this.HiEmail = localStorage.getItem('email') || 'Email';

    this.sekarang = this.formatTanggalWIB(new Date());

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

  backToTugasPage(){
    this.router.navigate(['/tugas']);
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspection-summary',
  templateUrl: './inspection-summary.component.html',
  styleUrls: ['./inspection-summary.component.scss']
})
export class InspectionSummaryComponent implements OnInit {
  HiThere: string = 'User';
  HiEmail: string = 'Email';
  sekarang: string = '';

  constructor(private router:Router) { }

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

}

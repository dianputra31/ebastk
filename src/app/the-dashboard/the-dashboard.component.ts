import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiClientService } from '../services/api.client';
import { NewApiResponse  } from '../../assets/models/list-dashboard.model'; // Sesuaikan dengan path yang benar  
import axios from 'axios';
import { NoahService } from '../noah.service';

@Component({
  selector: 'app-the-dashboard',
  templateUrl: './the-dashboard.component.html',
  styleUrls: ['./the-dashboard.component.scss']
})
export class TheDashboardComponent implements OnInit {
  HiThere: string = 'User';
  HiEmail: string = 'Email';
  HiLocation: string = 'Branch';
  errlog:string = '';
  sampleDataDashboard: NewApiResponse | null = null;
  isButtonDisabled: boolean = false;
  isLoading: boolean = false;
  currentDateTime: string = '';
  activeChipIndex: number = 0; // Indeks chip yang aktif  

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private noahService: NoahService) { }

  ngOnInit(): void {

    this.HiThere = localStorage.getItem('username') || 'User';
    this.HiEmail = localStorage.getItem('email') || 'Email';
    this.HiLocation = localStorage.getItem('branch') || 'Branch';
    this.listDashboard();

    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }


  goesToInputUnit(){
    window.location.href = '/unit-input';
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index;
    // Emit filter status first, then navigate
    this.noahService.emitFilterStatus(this.activeChipIndex.toString());
    // Small delay to ensure service emission is processed
    setTimeout(() => {
      this.router.navigate(['/tugas']);
    }, 50);
  } 

  updateDateTime() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('id-ID', options);
    // Ganti semua titik menjadi titik dua
    let timeStr = now.toLocaleTimeString('id-ID', { hour12: false });
    timeStr = timeStr.replace(/\./g, ':');
    this.currentDateTime = `${dateStr} ${timeStr}`;
  }

  async listDashboard() {
  
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const endpoint = `/get-dashboard`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.get<NewApiResponse>(endpoint);
      console.log('Data posted:', response);

      // Jika login berhasil, simpan data ke localStorage
      if (response) {
        this.sampleDataDashboard = response;  
        console.log('Dashboard:', this.sampleDataDashboard);
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
      this.isLoading = false;
    }
  }

}

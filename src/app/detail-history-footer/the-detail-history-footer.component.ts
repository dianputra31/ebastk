import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';


@Component({
  selector: 'app-detail-history-footer',
  templateUrl: './the-detail-history-footer.component.html',
  styleUrls: ['./the-detail-history-footer.component.scss']
})
export class TheDetailHistoryFooterComponent implements OnInit {
  errlog:string = '';
  payload: any = null;

  constructor(private router:Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
  }

    async downloadDokUnit(a:string){ 
    const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
    // alert(unit_id);
    try {
      const endpoint = `/document/?unit_id=${unit_id}`; // Endpoint API
      const response = await this.apiClient.downloadPdf(endpoint, 'document_bastk.pdf');
      return true;
    }catch(error){
      return false;
    }
  }


  goesToSummary(){
    const unit_id = this.router.url.split('/').pop();
    this.router.navigate(['/inspection-summary'+'/'+unit_id]);
  }

  async goesToRevision(){
    const unit_id = this.router.url.split('/').pop();

    try {
      this.payload = {
        unit_id: unit_id,
      }
      const page = 1; // Parameter yang ingin dikirim
      const endpoint = `/request_revision/`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.post<any>(endpoint, this.payload);

      // Jika login berhasil, simpan data ke localStorage
      if (response) {
        this.router.navigate(['/tugas']);
      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }

      return true; // Return true if the operation was successful

    } catch (error) {
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
      // this.isLoading = false;
    }
    return false; // Default return value

  }

}

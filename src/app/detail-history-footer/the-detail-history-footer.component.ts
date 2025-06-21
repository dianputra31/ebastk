import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
isModalOpen: boolean = false;
isLoading: boolean = false;


  constructor(private router:Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
  }

  async downloadDokUnit(a:string){ 
    this.isLoading = true;
    const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
    // alert(unit_id);
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


  goesToSummary(){
    const unit_id = this.router.url.split('/').pop();
    this.router.navigate(['/inspection-summary'+'/'+unit_id]);
  }

  async goesToRevision(alasan: string){
    const unit_id = this.router.url.split('/').pop();

    try {
      this.payload = {
        unit_id: unit_id,
        revision_notes: alasan
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


  openModal() {
    this.isModalOpen = true; // Membuka modal
  }

  closeModal() {
    this.isModalOpen = false; // Set modal tertutup
  }

  onModalClose() {
    this.closeModal(); // Menutup modal
  }


  onModalConfirm(alasan: string) {
    this.goesToRevision(alasan);
    this.isModalOpen = false; // Tutup modal
    this.closeModal(); // Menutup modal
    // this.router.navigate(['/your-target-route']); // Redirect ke halaman yang diinginkan
    const unit_id = this.router.url.split('/').pop();


    
  }

}

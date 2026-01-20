import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import { UnitDetailResponse } from 'src/assets/models/detail-unit.model';

@Component({
  selector: 'app-detail-unit-input',
  templateUrl: './detail-unit-input.component.html',
  styleUrls: ['./detail-unit-input.component.scss']
})
export class DetailUnitInputComponent implements OnInit {
  currentRoute: string='';  
  activeTab: string='/dashboard';  
  @Input() stepNow: string = 'unit-input'; // Tab aktif default
  labelfooter_top: string = '01.';
  labelfooter_bottom: string = 'Kelengkapan Data';
  isModalOpen: boolean = false;
  isModalErrorOpen: boolean = false;
  errlog:string = '';
  payload: any = null;
  unit_id: any = '';
  sampleData: UnitDetailResponse | null = null;
  bastk_status: string = '';
  errMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
    // this.router.events.subscribe(event => {  
      const unit_id = this.router.url.split('/').pop();
      this.unit_id = unit_id;

          // if (event instanceof NavigationEnd) {  
            this.currentRoute = this.router.url; // Mendapatkan URL saat ini  
            this.activeTab = this.currentRoute;
            

            if(this.currentRoute.startsWith('/unit-input')){
              this.labelfooter_top = ''
              this.labelfooter_bottom = 'Terjadwal'
            }
            // alert(this.activeTab)
          // }  
        // });
        
       
  }

  // Tab aktif default  
  
  setActiveTab(tab: string) {  
    this.activeTab = tab;  
    this.router.navigate(['/' + tab]);
    // Tambahkan logika navigasi di sini jika diperlukan  
  } 
  
  logout(){
    this.authService.logout();
    window.location.replace('/login');
  }

  nextStep(){
    const unit_id = this.router.url.split('/').pop();
    // if(this.stepNow==='inspeksi-unit' + '/' + unit_id){
    //   this.router.navigate(['/exterior-inspection'+'/'+unit_id]);
    // }else{
      this.openModal();
    // }
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



  // Fungsi ini akan dipanggil ketika tombol di modal ditekan
  onModalConfirm() {
    this.isModalOpen = false; // Tutup modal
    this.closeModal(); // Menutup modal
    const unit_id = this.router.url.split('/').pop();


    this.saveStep(1).then(success => {
      if (success) {
        localStorage.removeItem('mobilizationUnitNew');
        window.location.href = '/tugas';
      }
    });
    
    
    
  }



async saveStep(a: number) {


  if (a == 1) {
    this.isLoading = false;
    const unitPayload = localStorage.getItem('mobilizationUnitNew');

    if (unitPayload) {
      const parsedUnitPayload = JSON.parse(unitPayload);
      this.payload = parsedUnitPayload;

      // 🔧 Reset modal & pesan sebelum validasi
      this.isModalErrorOpen = false;
      this.errMessage = "";

      // 🔎 Validasi field wajib (gabungan)
      const fieldMap: Record<string, string> = {
        police_number: "No Polisi",
        // variant_model: "Model",
        unit_type: "Unit",
        unit_category: "Kategori",
        color: "Warna"
      };

      const missingFields: string[] = [];

      for (const key of Object.keys(fieldMap)) {
        if (
          this.payload[key] === "" ||
          this.payload[key] === null ||
          this.payload[key] === undefined
        ) {
          missingFields.push(fieldMap[key]);
        }
      }

      if (missingFields.length > 0) {
        this.errMessage = `${missingFields.join(", ")} harus diisi`;
        this.isModalErrorOpen = true;
        return false; // Stop function, jangan lanjut ke try{}
      }
    }
  }

  this.errlog = "";
  this.isLoading = true;
  this.isModalErrorOpen = false;

  try {
    const endpoint = `/process/`;
    const response = await this.apiClient.post<any>(endpoint, this.payload);

    if (response && response.message === 'Success') {
      this.isLoading = false;
      return true;
    } else {
      this.isLoading = false;
      this.errlog = 'Username atau password salah';
      return false;
    }
  } catch (error) {
    this.isModalErrorOpen = true;
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        this.errlog = 'Username atau password salah.';
      } else {
        this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
      }
    } else {
      this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
    }
    console.error('Error during login:', error);
    this.errMessage = String(error);
  }
  this.isLoading = false;
  return false;
}




  backStep(){
    window.history.back(); 
  }

}

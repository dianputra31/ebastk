import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import { UnitDetailResponse } from 'src/assets/models/detail-unit.model';

@Component({
  selector: 'app-detail-terjadwal',
  templateUrl: './detail-terjadwal.component.html',
  styleUrls: ['./detail-terjadwal.component.scss']
})
export class DetailTerjadwalComponent implements OnInit {
  currentRoute: string='';  
  activeTab: string='/dashboard';  
  @Input() stepNow: string = 'detil-terjadwal'; // Tab aktif default
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
            

            if(this.currentRoute.startsWith('/detil-terjadwal')){
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


    this.infoUnitTerjadwal();
    

    
  }



  async infoUnitTerjadwal() {
    this.isLoading = true;
      const unitData = {
        page: '1'
      };
      this.errlog = "";
      try {
        const page = 1; // Parameter yang ingin dikirim
        const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
        const endpoint = `/info-mobilisasi-unit?mobilization_unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
        const response = await this.apiClient.get<UnitDetailResponse>(endpoint);
        // console.log('Data posted:', response.vendor.id);
        this.unit_id = unit_id;
        


        // Jika login berhasil, simpan data ke localStorage
        if (response) {
          // this.sampleData = response;  
          
          this.errlog = "";
          this.isLoading = true;
          this.isModalErrorOpen = false;

          if(this.stepNow==='detil-terjadwal'){
            this.saveStep(1).then(success => {
              if (success) {
                // console.log('here success');
                // this.router.navigate(['/inspeksi-unit' + '/' + unit_id])
                window.location.href = '/tugas';
              } else {
                // Error sudah ditangani di saveStep, modal sudah muncul
                console.log('Save step failed, error modal should be shown');
              }
            });
          }

        }else{
          console.log('here failed')
          this.errlog = 'Username atau password salah';
        }
  
      } catch (error) {
        this.isLoading = false;
        this.isModalErrorOpen = true;
        
        if (axios.isAxiosError(error)) {
          // Cek status kode dari respons
          if (error.response && error.response.status === 401) {
            this.errMessage = 'Username atau password salah.';
          } else {
            this.errMessage = 'Terjadi kesalahan, silakan coba lagi.';
          }
        } else {
          this.errMessage = 'Terjadi kesalahan, silakan coba lagi.';
        }
        console.error('Error during infoUnitTerjadwal:', error);
      }
  }
    

async saveStep(a: number) {

  const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL


  if (a == 1) {
    this.isLoading = false;
    const unitPayload = localStorage.getItem('mobilizationUnit_' + unit_id);

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

    console.log('Response received:', response);

    // Cek apakah ada error message dari API (meskipun status 200/201)
    if (response && (response.msg || response.message)) {
      const errorMsg = response.msg || response.message;
      
      // Jika message bukan "Success", berarti ada error
      if (errorMsg !== 'Success') {
        // Cek apakah ada kata kunci error
        const errorKeywords = ['belum', 'sudah', 'tidak', 'gagal', 'error', 'null'];
        const hasError = errorKeywords.some(keyword => 
          errorMsg.toLowerCase().includes(keyword.toLowerCase())
        );
        
          this.isLoading = false;
          this.isModalErrorOpen = true;
          this.errMessage = errorMsg;
          return false;
        
      }
    }

    if (response && response.message === 'Success') {
      this.isLoading = false;
      return true;
    } else {
      this.isLoading = false;
      this.errlog = response.message || 'Terjadi kesalahan tak terduga.';
      return false;
    }
  } catch (error) {
    this.isModalErrorOpen = true;
    this.isLoading = false;
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Ambil pesan error dari response API
        const errorMsg = error.response.data?.msg || error.response.data?.message;
        
        console.log('Error response:', error.response.status, error.response.data);
        console.log('Error message extracted:', errorMsg);
        
        if (error.response.status === 201 && errorMsg) {
          // Error 201 dengan pesan khusus
          this.errMessage = errorMsg;
        } else if (error.response.status === 401) {
          this.errMessage = 'Username atau password salah.';
        } else if (errorMsg) {
          // Error lainnya yang punya pesan dari API
          this.errMessage = errorMsg;
        } else {
          this.errMessage = 'Terjadi kesalahan, silakan coba lagi.';
        }
      } else {
        this.errMessage = 'Terjadi kesalahan, silakan coba lagi.';
      }
    } else {
      this.errMessage = 'Terjadi kesalahan, silakan coba lagi.';
    }
    console.error('Error during process:', error);
    console.log('isModalErrorOpen:', this.isModalErrorOpen);
    console.log('errMessage:', this.errMessage);
    return false;
  }

}




  backStep(){
    window.history.back(); 
  }

}

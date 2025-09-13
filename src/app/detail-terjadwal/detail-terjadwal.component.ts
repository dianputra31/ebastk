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
          

          if(this.stepNow==='detil-terjadwal'){
            this.saveStep(1).then(success => {
              if (success) {
                console.log('here success');
                // this.router.navigate(['/inspeksi-unit' + '/' + unit_id])
                window.location.href = '/tugas';
              }
            });
          }

        }else{
          console.log('here failed')
          this.errlog = 'Username atau password salah';
        }
  
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
      }
  }
    

  async saveStep(a: number) {
    const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL

    if(a == 1){
      const unitPayload = localStorage.getItem('mobilizationUnit_' + unit_id);



      if (unitPayload) {
        console.log('unitPayload', unitPayload);
        const parsedUnitPayload = JSON.parse(unitPayload);
        this.payload = parsedUnitPayload;
      }
    }



      console.log("LAST_PAYLOAD:::::",this.payload);

      // this.payload.bastk_status = 'submit';
      // this.payload = {"unit_id": this.unit_id,"bastk_status": "submit","questions": []}
    

    

    this.errlog = "";
    this.isLoading = true;
    this.isModalErrorOpen = false;
    try {
      const page = 1; // Parameter yang ingin dikirim
      const endpoint = `/process/`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.post<any>(endpoint, this.payload);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.message === 'Success') {
        this.isLoading = false;
        return true;
      }else{
        this.isLoading = false;
        this.errlog = 'Username atau password salah';
        return false;
      }

      // return true; // Return true if the operation was successful

    } catch (error) {
      this.isModalErrorOpen = true;
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
      this.errMessage = String(error);
      // this.isLoading = false;
    }
    this.isLoading = false;
    return false; // Default return value
  }


  backStep(){
    window.history.back(); 
  }

}

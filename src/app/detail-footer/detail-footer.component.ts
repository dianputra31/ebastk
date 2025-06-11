import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import { UnitDetailResponse } from 'src/assets/models/detail-unit.model';

@Component({
  selector: 'app-detail-footer',
  templateUrl: './detail-footer.component.html',
  styleUrls: ['./detail-footer.component.scss']
})
export class DetailFooterComponent implements OnInit {
  currentRoute: string='';  
  activeTab: string='/dashboard';  
  @Input() stepNow: string = 'kelengkapan-data'; // Tab aktif default
  labelfooter_top: string = '01.';
  labelfooter_bottom: string = 'Kelengkapan Data';
  isModalOpen: boolean = false;
  errlog:string = '';
  payload: any = null;
  unit_id: any = '';
  sampleData: UnitDetailResponse | null = null;
  bastk_status: string = '';

  constructor(private router: Router, private authService: AuthService,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
    // this.router.events.subscribe(event => {  
      const unit_id = this.router.url.split('/').pop();
      this.unit_id = unit_id;

          // if (event instanceof NavigationEnd) {  
            this.currentRoute = this.router.url; // Mendapatkan URL saat ini  
            this.activeTab = this.currentRoute;
            

            if(this.currentRoute.startsWith('/detil-tugas')){
              this.labelfooter_top = '01.'
              this.labelfooter_bottom = 'Kelengkapan Data'
            }else if(this.currentRoute.startsWith('/inspeksi-unit')){
              //  alert("HELL NO");
              this.labelfooter_top = '02.';
              this.labelfooter_bottom = 'Inspeksi Unit';
            }else if(this.currentRoute.startsWith('/exterior-inspection')){
              this.labelfooter_top = '02 A';
              this.labelfooter_bottom = 'Exterior Inspection';
            }else if(this.currentRoute.startsWith('/interior-inspection')){
              this.labelfooter_top = '02 B';
              this.labelfooter_bottom = 'Interior Inspection';
            }else if(this.currentRoute.startsWith('/engine-inspection')){
              this.labelfooter_top = '02 C';
              this.labelfooter_bottom = 'Engine Inspection';
            }else if(this.currentRoute.startsWith('/unit-photos')){
              this.labelfooter_top = '02 D';
              this.labelfooter_bottom = 'Unit Photos';
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
    // alert(unit_id)
    if(this.stepNow==='inspeksi-unit' + '/' + unit_id){
      this.router.navigate(['/exterior-inspection'+'/'+unit_id]);
    }else{
      this.openModal();
    }
    // if(this.stepNow==='inspeksi-unit'){
    //   this.router.navigate(['/exterior-inspection']);
    // }else if(this.stepNow==='exterior-inspection'){
    //   this.router.navigate(['/interior-inspection']);
    // }else if(this.stepNow==='interior-inspection'){
    //   this.router.navigate(['/engine-inspection']);
    // }else if(this.stepNow==='engine-inspection'){
    //   this.router.navigate(['/unit-photos']);
    // }else if(this.stepNow==='unit-photos'){
    //   this.router.navigate(['/detil-tugas']);
    // }else if(this.stepNow==='detil-tugas'){
    //   this.router.navigate(['/inspeksi-unit']);
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
    // this.router.navigate(['/your-target-route']); // Redirect ke halaman yang diinginkan
    const unit_id = this.router.url.split('/').pop();


    this.infoUnit();
    // alert(unit_id)
    // alert(this.stepNow)
    

    
  }



  async infoUnit() {
    
      const unitData = {
        page: '1'
      };
      this.errlog = "";
      try {
        const page = 1; // Parameter yang ingin dikirim
        const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
        const endpoint = `/detail-unit?unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
        const response = await this.apiClient.getOther<UnitDetailResponse>(endpoint);
        // console.log('Data posted:', response.vendor.id);
        this.unit_id = unit_id;


        // Jika login berhasil, simpan data ke localStorage
        if (response && response.vendor.id) {
          this.sampleData = response;  
          if(response.bastk_status === 'revision'){
            this.bastk_status = 'submit';
          }else{
            this.bastk_status = 'draft';
          }


          if(this.stepNow==='inspeksi-unit'){
            // this.router.navigate(['/exterior-inspection/'+unit_id]);
            window.location.href = '/exterior-inspection/' + unit_id;
          }else if(this.stepNow==='exterior-inspection'){
            this.saveStep(1).then(success => {
              if (!success) {
                // this.router.navigate(['/interior-inspection' + '/' + unit_id]);
                // this.router.navigate(['/inspeksi-unit' + '/' + unit_id])
                window.location.href = '/inspeksi-unit/' + unit_id;
              }
            });
          }else if(this.stepNow==='interior-inspection'){
            this.saveStep(2).then(success => {
              if (!success) {
                // this.router.navigate(['/engine-inspection' + '/' + unit_id]);
                // this.router.navigate(['/inspeksi-unit' + '/' + unit_id])
                window.location.href = '/inspeksi-unit/' + unit_id;
              }
            });
          }else if(this.stepNow==='engine-inspection'){
            this.saveStep(3).then(success => {
              if (!success) {
                // this.router.navigate(['/unit-photos'+'/'+unit_id]);
                // this.router.navigate(['/inspeksi-unit' + '/' + unit_id])
                window.location.href = '/inspeksi-unit/' + unit_id;
              }
            });
          }else if(this.stepNow==='unit-photos'){
              this.saveStep(4).then(success => {
              if (!success) {
                // this.router.navigate(['/unit-photos'+'/'+unit_id]);
                // this.router.navigate(['/inspection-summary'+'/'+unit_id]);
                window.location.href = '/inspection-summary/' + unit_id;
              }
            });
          }else if(this.stepNow==='detil-tugas'){
            window.location.href = '/inspeksi-unit/' + unit_id;
            // this.router.navigate(['/inspeksi-unit'+'/'+unit_id]);
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
      const exteriorPayload = localStorage.getItem('exteriorPayload');
      const unitPayload = localStorage.getItem('payloadUnit_' + unit_id);

      if (exteriorPayload) {
        this.payload = JSON.parse(exteriorPayload);
      }

      if (unitPayload) {
        console.log('unitPayload', unitPayload);
        const parsedUnitPayload = JSON.parse(unitPayload);

        // Jika payload awal belum ada, pakai unitPayload sebagai dasar
        if (!this.payload) {
          this.payload = parsedUnitPayload;
        } else {
          // Gabungkan payload existing dengan unitPayload
          this.payload = {
            ...this.payload,
            ...parsedUnitPayload
          };
      }
      // this.payload = JSON.parse(this.payload);
      this.payload.bastk_status = this.bastk_status;
    }
      // return payload !== null; // Return true if payload exists, false otherwise
    }else if(a == 2){
      this.payload = localStorage.getItem('interiorPayload');
      const interiorPayload = localStorage.getItem('interiorPayload');
      const unitPayload = localStorage.getItem('payloadUnit_' + unit_id);

      if (interiorPayload) {
        this.payload = JSON.parse(interiorPayload);
      }

      if (unitPayload) {
          console.log('unitPayload', unitPayload);
          const parsedUnitPayload = JSON.parse(unitPayload);

          // Jika payload awal belum ada, pakai unitPayload sebagai dasar
          if (!this.payload) {
            this.payload = parsedUnitPayload;
          } else {
            // Gabungkan payload existing dengan unitPayload
            this.payload = {
              ...this.payload,
              ...parsedUnitPayload
            };
        }
        this.payload.bastk_status = this.bastk_status;
      }
    }else if(a == 3){
      this.payload = localStorage.getItem('enginePayload');
      const enginePayload = localStorage.getItem('enginePayload');
      const unitPayload = localStorage.getItem('payloadUnit_' + unit_id);

      if (enginePayload) {
        this.payload = JSON.parse(enginePayload);
      }

      if (unitPayload) {
          console.log('unitPayload', unitPayload);
          const parsedUnitPayload = JSON.parse(unitPayload);

          // Jika payload awal belum ada, pakai unitPayload sebagai dasar
          if (!this.payload) {
            this.payload = parsedUnitPayload;
          } else {
            // Gabungkan payload existing dengan unitPayload
            this.payload = {
              ...this.payload,
              ...parsedUnitPayload
            };
        }
        this.payload.bastk_status = this.bastk_status;
      }
    }else if(a == 4){
      const unit_id = this.router.url.split('/').pop();
      this.unit_id = unit_id;
      this.payload = localStorage.getItem('enginePayload');
      this.payload = JSON.parse(this.payload);
      this.payload.bastk_status = 'submit';
      // this.payload = {"unit_id": this.unit_id,"bastk_status": "submit","questions": []}
    }



    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const endpoint = `/input-bastk/`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.post<any>(endpoint, this.payload);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.vendor.id) {
        
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


  backStep(){
    window.history.back(); 
  }

}

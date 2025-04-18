import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth.service';

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

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {  
      const unit_id = this.router.url.split('/').pop();
      console.log(unit_id)

          if (event instanceof NavigationEnd) {  
            this.currentRoute = this.router.url; // Mendapatkan URL saat ini  
            this.activeTab = this.currentRoute;
            

            if(this.currentRoute.startsWith('/detil-tugas')){
              this.labelfooter_top = '01.'
              this.labelfooter_bottom = 'Kelengkapan Data'
            }else if(this.currentRoute.startsWith('/inspeksi-unit')){
              this.labelfooter_top = '02.';
              this.labelfooter_bottom = 'Inspeksi Unit Kendaraan';
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
          }  
        });
        
        
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
    // alert(unit_id)
    // alert(this.stepNow)
    

    if(this.stepNow==='inspeksi-unit'){
      this.router.navigate(['/exterior-inspection/'+unit_id]);
    }else if(this.stepNow==='exterior-inspection'){
      this.router.navigate(['/interior-inspection'+'/'+unit_id]);
    }else if(this.stepNow==='interior-inspection'){
      this.router.navigate(['/engine-inspection'+'/'+unit_id]);
    }else if(this.stepNow==='engine-inspection'){
      this.router.navigate(['/unit-photos'+'/'+unit_id]);
    }else if(this.stepNow==='unit-photos'){
      this.router.navigate(['/inspection-summary'+'/'+unit_id]);
    }else if(this.stepNow==='detil-tugas'){
      this.router.navigate(['/inspeksi-unit'+'/'+unit_id]);
    }
  }


  backStep(){
    window.history.back(); 
  }

}

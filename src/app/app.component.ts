import { Component, ViewChild, HostListener  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';  
import { filter } from 'rxjs/operators';  
import { AuthService } from './auth.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ebastk';
  isDetailView: boolean = false;  
  loggedIn: string | null | undefined;
  currentRoute: string='';  
  watchThisStep: string='';  
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;
  activeChipIndex = 0;
  isLogin = false;
  isLoading: boolean = true;


  // loggedIn:boolean = false;

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const infoVendorPanel = document.getElementById('infoVendorPanel');
  //   const infoKendaraanPanel = document.getElementById('infoKendaraanPanel');
  //   const infoDokumenPanel = document.getElementById('infoDokumenPanel');
  //   const infoLainnyaPanel = document.getElementById('infoLainnyaPanel');

  //   if (infoKendaraanPanel && this.isElementInViewport(infoKendaraanPanel)) {
  //     this.setActiveChip(1); // Set active chip to "Info Kendaraan"
  //   } else if (infoVendorPanel && this.isElementInViewport(infoVendorPanel)) {
  //     this.setActiveChip(0); // Set active chip to "Info Vendor"
  //   } else if (infoDokumenPanel && this.isElementInViewport(infoDokumenPanel)) {
  //     this.setActiveChip(2); // Set active chip to "Info Dokumen"
  //   } else if (infoLainnyaPanel && this.isElementInViewport(infoLainnyaPanel)) {
  //     this.setActiveChip(3); // Set active chip to "Info Lainnya"
  //   }
  // }

  constructor(private router: Router, private authService: AuthService) {}  

  ngOnInit() {
    this.loggedIn = localStorage.getItem('userToken');
    if(this.loggedIn!==''){
      this.authService.login();
    }


    

    this.router.events.subscribe(event => {  
      if (event instanceof NavigationEnd) {  
        this.currentRoute = this.router.url; // Mendapatkan URL saat ini  
       
        if(this.currentRoute ==='/detil-tugas'){
          this.isDetailView = true; 
          this.watchThisStep = 'detil-tugas'; 
        }else if(this.currentRoute ==='/dashboard' || this.currentRoute ==='/tugas' || this.currentRoute ==='/inspection-summary'|| this.currentRoute ==='/riwayat'){
          this.isDetailView = false;  
        }else{
          this.isDetailView = true;  
        }


          if(this.currentRoute ==='/inspeksi-unit'){
            this.watchThisStep = 'inspeksi-unit';
          }else if(this.currentRoute ==='/exterior-inspection'){
            this.watchThisStep = 'exterior-inspection';
          }else if(this.currentRoute ==='/interior-inspection'){
            this.watchThisStep = 'interior-inspection';
          }else if(this.currentRoute ==='/engine-inspection'){
            this.watchThisStep = 'engine-inspection';
          }else if(this.currentRoute ==='/photos-inspection'){
            this.watchThisStep = 'photos-inspection';
          }else if(this.currentRoute ==='/unit-photos'){
            this.watchThisStep = 'unit-photos';
          }


        console.log("currentRoute==>", this.currentRoute)
        console.log("isDetailView==>", this.isDetailView)
      }  
    });  
  }



  // isElementInViewport(el: HTMLElement) {
  //   const rect = el.getBoundingClientRect();
  //   return (
  //     rect.top >= 0 &&
  //     rect.left >= 0 &&
  //     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
  //     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  //   );
  // }

  setActiveChip(menu: any) {
    switch (menu) {
      case 'Info Vendor':
        this.activeChipIndex = 0;
        break;
      case 'Info Kendaraan':
        this.activeChipIndex = 1;
        break;
      case 'Dokumen dan Kelengkapan Lainnya':
        this.activeChipIndex = 2;
        break;
      case 'Keterangan Lainnya':
        this.activeChipIndex = 3;
        break;
      default:
        this.activeChipIndex = 0; // Atau nilai default lainnya
    }
  }



  onMenuChange(menu: string) {
    if (menu === 'Info Vendor') {
      const panel = document.getElementById('infoVendorPanel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth' });
      }
    }else if (menu === 'Info Kendaraan') {
      const panel = document.getElementById('infoKendaraanPanel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth' });
      }
    }else if (menu === 'Dokumen dan Kelengkapan Lainnya') {
      const panel = document.getElementById('infoDokumenPanel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth' });
      }
    }else if (menu === 'Keterangan Lainnya') {
      const panel = document.getElementById('infoLainnyaPanel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

    get isLoggedIn(): boolean {  
      return this.authService.isLoggedIn(); // Memeriksa status login  
    } 
  
    // Metode untuk mengubah nilai isDetailView saat navigasi  
    navigateToDetailView() {  
      this.isDetailView = true;  
    }  
    
    navigateToMainView() {  
      this.isDetailView = false;  
      console.log("isDetailView==>", this.isDetailView)
    }  


    onSuccessLogin(value:any){
      this.isLogin = value;
      if(this.isLogin){
        // window.location.reload()
         this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
  
    }

}

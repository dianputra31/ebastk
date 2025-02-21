import { Component, ViewChild, HostListener  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';  
import { filter } from 'rxjs/operators';  
import { AuthService } from './auth.service';
import { MatAccordion } from '@angular/material/expansion';
import * as jQuery from 'jquery';

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



  constructor(private router: Router, private authService: AuthService) {}  


  ngOnInit() {
    this.isLogin = localStorage.getItem('userToken') !== null;
  
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
        
        const detailRoutes = ['/detil-tugas', '/detil-riwayat'];
        const mainRoutes = ['/dashboard', '/tugas', '/inspection-summary', '/riwayat'];
        const stepRoutes: { [key: string]: string } = {
          '/inspeksi-unit': 'inspeksi-unit',
          '/exterior-inspection': 'exterior-inspection',
          '/interior-inspection': 'interior-inspection',
          '/engine-inspection': 'engine-inspection',
          '/photos-inspection': 'photos-inspection',
          '/unit-photos': 'unit-photos'
        };
  
        this.isDetailView = !mainRoutes.includes(this.currentRoute) || detailRoutes.includes(this.currentRoute);
        this.watchThisStep = stepRoutes[this.currentRoute] || 'detil-tugas';
      }
    });
  }


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
    const panels: { [key: string]: string } = {
      'Info Vendor': 'infoVendorPanel',
      'Info Kendaraan': 'infoKendaraanPanel',
      'Dokumen dan Kelengkapan Lainnya': 'infoDokumenPanel',
      'Keterangan Lainnya': 'infoLainnyaPanel',
      'rw-info': 'rw-info',
      'rw-exterior': 'rw-exterior',
      'rw-interior': 'rw-interior',
      'rw-engine': 'rw-engine',
      'rw-photos': 'rw-photos'
    };
  

  
    // Sembunyikan semua panel rw-*
    const rwPanels = ['rw-info', 'rw-exterior', 'rw-interior', 'rw-engine', 'rw-photos'];
    if (rwPanels.includes(menu)) {
      rwPanels.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === menu ? 'block' : 'none';
      });
    }

    // Scroll ke panel yang sesuai
    const panel = document.getElementById(panels[menu]);
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth' });
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



    getCurrentView(): string {
      const dtTugasRoutes = [
        '/detil-tugas', '/inspeksi-unit', '/exterior-inspection',
        '/interior-inspection', '/engine-inspection', '/unit-photos'
      ];
      
      const mainRoutes = ['/dashboard', '/tugas', '/profil', '/riwayat'];
    
      if (dtTugasRoutes.includes(this.currentRoute)) return 'dt-tugas';
      if (this.currentRoute === '/detil-riwayat') return 'dt-riwayat';
      if (mainRoutes.includes(this.currentRoute)) return 'main';
      
      return 'none';
    }

}

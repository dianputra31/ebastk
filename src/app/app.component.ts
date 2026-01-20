import { Component, ViewChild, HostListener  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';  
import { filter } from 'rxjs/operators';  
import { AuthService } from './auth.service';
import { NoahService } from './noah.service';
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

  noah: string = '';
  noahloc: string = '';
  noahdate: string = '';
  noahdoneby: string = '';
  noahdonedate: string = '';
  filterStatus: string = '';
  isMobilisasiRoute = false;
  activePanel: string = '';


  constructor(private router: Router, private authService: AuthService, private noahService: NoahService) {}  


  onActivePanelChange(panelId:any) {
    this.activePanel = panelId;
  }

  ngOnInit() {
   
    this.isLogin = localStorage.getItem('userToken') !== null;
    // alert("HERE WE GO" + this.isLogin);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
        this.isMobilisasiRoute = this.currentRoute.startsWith('/mobilisasi');

        const detailRoutes = ['/detil-tugas', '/detil-riwayat'];
        const mainRoutes = ['/dashboard', '/tugas', '/inspection-summary', '/riwayat', '/input-unit', '/history-summary'];
        const stepRoutes: { [key: string]: string } = {
          '/inspeksi-unit': 'inspeksi-unit',
          '/exterior-inspection': 'exterior-inspection',
          '/interior-inspection': 'interior-inspection',
          '/engine-inspection': 'engine-inspection',
          '/photos-inspection': 'photos-inspection',
          '/detil-terjadwal': 'detil-terjadwal',
          '/unit-photos': 'unit-photos'
        };

        const matchedRoute = Object.keys(stepRoutes).find(key => this.currentRoute.startsWith(key));
        this.watchThisStep = matchedRoute ? stepRoutes[matchedRoute] : 'detil-tugas';
  
        this.isDetailView = !mainRoutes.includes(this.currentRoute) || detailRoutes.includes(this.currentRoute);
   
      }
    });

    this.noahService.noah$.subscribe(noah => {
      this.noah = noah;
    });

    this.noahService.noahloc$.subscribe(noahloc => {
      this.noahloc = noahloc;
    });

    this.noahService.noahdate$.subscribe(noahdate => {
      this.noahdate = noahdate;
    });

    this.noahService.noahdoneby$.subscribe(noahdoneby => {
      this.noahdoneby = noahdoneby;
    });

    this.noahService.noahdonedate$.subscribe(noahdonedate => {
      this.noahdonedate = noahdonedate;
    });

    this.noahService.filterstatus$.subscribe(noah => {
      this.filterStatus = noah;
    });

  }


  setActiveChip(menu: any) {
    console.log('Selected menu:', menu);
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


  setNoah(noah: any) {
    // console.log('Selected noah:', noah);
    this.noah = noah;
  } 

  setFilterStatus(filterstatus: any) {
    // console.log('Selected filterstatus:', filterstatus);
    this.filterStatus = filterstatus;
  }
    





  onMenuChange(menu: string) {
    console.log('Selected menu:', menu);
    // alert(menu);
    const panels: { [key: string]: string } = {
      'Info Vendor': 'infoVendorPanel',
      'Info Kendaraan': 'infoKendaraanPanel',
      'Dokumen dan Kelengkapan Lainnya': 'infoDokumenPanel',
      'Keterangan Lainnya': 'infoLainnyaPanel',
      'rw-info': 'rw-info',
      'rw-exterior': 'rw-exterior',
      'rw-interior': 'rw-interior',
      'rw-engine': 'rw-engine',
      'rw-photos': 'rw-photos',
      'Bagian Luar': 'ft-exterior',
      'Bagian Dalam': 'ft-interior',
      'Bagian Mesin': 'ft-mesin',
      'Foto Minus': 'ft-minus',
      'Foto Sitem': 'ft-sistem',
      [menu]: menu // Dynamically add the menu key-value pair
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
    // console.log("selected scroll panel:", panels[menu]);
    if (panel) {
      // console.log("selected panel:", menu);
      panel.scrollIntoView({ behavior: 'smooth' });
    }

  }
  

  
    onFilterChange(a: string){
      // console.log("HAHAHAHAHA::::::",a);
    }

    onFilterHistoryChange(a: string){
      // console.log("HAHAHAHAHA::::::",a);
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
      if (this.currentRoute.startsWith('/detil-tugas/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/detil-terjadwal/')) return 'dt-terjadwal';
      if (this.currentRoute.startsWith('/inspeksi-unit/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/unit-input/')) return 'dt-unit-input';
      if (this.currentRoute.startsWith('/exterior-inspection/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/interior-inspection/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/engine-inspection/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/unit-photos/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/detil-riwayat/')) return 'dt-riwayat';

      const routeMappings: { [key: string]: string } = {
      '/detil-tugas': 'dt-tugas',
      '/detil-terjadwal': 'dt-terjadwal',
      '/inspeksi-unit': 'dt-tugas',
      '/unit-input': 'dt-unit-input',
      '/exterior-inspection': 'dt-tugas',
      '/interior-inspection': 'dt-tugas',
      '/engine-inspection': 'dt-tugas',
      '/unit-photos': 'dt-tugas',
      '/detil-riwayat': 'dt-riwayat',
      '/dashboard': 'main',
      '/tugas': 'main',
      '/profil': 'main',
      '/riwayat': 'main'
      };

      return routeMappings[this.currentRoute] || 'none';
    }


    getCurrentRouterView(): string {
      if (this.currentRoute.startsWith('/detil-tugas/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/detil-terjadwal/')) return 'dt-terjadwal';
      if (this.currentRoute.startsWith('/unit-input/')) return 'dt-unit-input';
      if (this.currentRoute.startsWith('/inspeksi-unit/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/exterior-inspection/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/interior-inspection/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/engine-inspection/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/unit-photos/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/detil-riwayat/')) return 'dt-riwayat';
      if (this.currentRoute.startsWith('/inspection-summary/')) return 'dt-tugas';
      if (this.currentRoute.startsWith('/history-summary/')) return 'dt-tugas';

      const routeMappings: { [key: string]: string } = {
      '/detil-tugas': 'dt-tugas',
      '/inspeksi-unit': 'dt-tugas',
      '/unit-input': 'dt-unit-input',
      '/exterior-inspection': 'dt-tugas',
      '/interior-inspection': 'dt-tugas',
      '/engine-inspection': 'dt-tugas',
      '/inspection-summary': 'dt-tugas',
      '/history-summary': 'dt-tugas',
      '/unit-photos': 'dt-tugas',
      '/detil-riwayat': 'dt-riwayat',
      '/dashboard': 'maincontent',
      '/login': 'maincontent',
      '/tugas': 'main',
      '/profil': 'main',
      '/riwayat': 'main'
      };

      //alert("HERER");

      return routeMappings[this.currentRoute] || 'none';
    }

}

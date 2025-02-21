import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // activeChipIndex: number = 0; // Indeks chip yang aktif  
  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  
  currentRoute: string='/dashboard';  
  selectedPanel: string='';
  @Output() menuChange = new EventEmitter<string>();
  @Input() activeChipIndex: number = 0;
  
  constructor(private router: Router,  private authService: AuthService) { }

  ngOnInit(): void {
    // Update currentRoute setiap kali ada perubahan navigasi
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });

    // this.router.events.subscribe(event => {  
    //   if (event instanceof NavigationEnd) {  
    //     this.currentRoute = this.router.url; // Mendapatkan URL saat ini  
    //   }  
    // });  
    console.log("activeChipIndex==>", this.activeChipIndex);
  }


  onMenuSelected(menu: string) {
    this.menuChange.emit(menu);
  }

  getCurrentView(): string {
    switch (this.currentRoute) {
      case '/dashboard':
        return 'dashboard';
      case '/tugas':
        return 'tugas';
      case '/inspeksi-unit':
        return 'nomenu';
      case '/exterior-inspection':
        return 'exterior';
      case '/interior-inspection':
        return 'interior';
      case '/engine-inspection':
        return 'engine';
      case '/unit-photos':
        return 'photos';
      case '/riwayat':
        return 'riwayat';
      case '/inspeksi-unit':
        return 'nomenu';
      case '/inspection-summary':
        return 'nomenu';
      default:
        return 'other';
    }
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index;  
  }  

  
  toggleDropdown() {  
    this.isDropdownOpen = !this.isDropdownOpen;  
  } 

  toggleCategoryDropdown() {  
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;  
    this.isSortDropdownOpen = false;
  }  

  toggleSortDropdown() {  
    this.isSortDropdownOpen = !this.isSortDropdownOpen;  
    this.isCategoryDropdownOpen = false; 
  }  
  
  selectCategory(category: string) {  
    console.log('Selected category:', category);  
    this.isCategoryDropdownOpen = false; // Menutup dropdown setelah memilih kategori  
  }  
  
  selectSort(sortingBy: string) {  
    console.log('Selected sortingBy:', sortingBy);  
    this.isSortDropdownOpen = false; // Menutup dropdown setelah memilih kategori  
  }  

  isDashboard(): boolean {  
    return this.currentRoute === '/dashboard';  
  }  

  isRiwayat(): boolean {  
    return this.currentRoute === '/riwayat';  
  }  
  

  isInspectionSummary(): boolean {  
    return this.currentRoute === '/inspection-summary';  
  }  
  
  isTugas(): boolean {  
    return this.currentRoute === '/tugas';  
  }  

  goBack(): void {
    // window.history.back();
    if(this.currentRoute==='/detil-tugas'){
      this.router.navigate(['/tugas'])
    }else{
      this.router.navigate(['/detil-tugas'])
    }

  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(){
    this.authService.logout();
    window.location.replace('/login');
  }

  scrollToPanel(panelName: string) {
    this.selectedPanel = panelName;
    
  }

  // activeTab: string = 'dashboard'; 
  
  // setActiveTab(tab: string) {  
  //   this.activeTab = tab;  
  // }  

}

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
  @Output() filterChange = new EventEmitter<string>();
  @Output() filterHistoryChange = new EventEmitter<string>();
  @Input() activeChipIndex: number = 0;
  HiThere: string = 'User';
  HiEmail: string = 'Email';
  subCategory: { [key: string]: string[] } = {};

  @Input() activeNoah: string = '';
  @Input() activeLoc: string = '';
  @Input() activeDatetime: string = '';
  @Input() activeDoneBy: string = '';
  @Input() activeDoneDate: string = '';

  
  constructor(private router: Router,  private authService: AuthService) { }

  ngOnInit(): void {
    // this.activeNoah = 'HELLO WORLD';
    console.log("activeNoah::", this.activeNoah);
    // Update currentRoute setiap kali ada perubahan navigasi
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });

    this.HiThere = localStorage.getItem('username') || 'User';
    this.HiEmail = localStorage.getItem('email') || 'Email';
    // localStorage.getItem('userToken');
    // localStorage.getItem('refresh_token');

    // this.router.events.subscribe(event => {  
    //   if (event instanceof NavigationEnd) {  
    //     this.currentRoute = this.router.url; // Mendapatkan URL saat ini  
    //   }  
    // });  
    console.log("activeChipIndex==>", this.activeChipIndex);
    // {"Exterior":["DEPAN","KUNCI KONTAK"],"Engine":["ENGINE"],"Interior":["DEPAN"]}
    console.log("subCategory::", localStorage.getItem('subCategory'));
    this.subCategory = JSON.parse(localStorage.getItem('subCategory') || '{}');
  }


  onMenuSelected(menu: string) {
    this.menuChange.emit(menu);
  }

  filterTugasChange(a: string) {
    this.filterChange.emit(a);
  }

  onInputChange(event: any) {
     this.filterHistoryChange.emit(event);
  }

  getCurrentView(): string {
    return this.currentRoute.split('/')[1] ? `/${this.currentRoute.split('/')[1]}` : this.currentRoute;
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

  isDetailRiwayat(): boolean {  
    return this.currentRoute.startsWith('/detil-riwayat');  
  }  
  

  isInspectionSummary(): boolean {  
    return this.currentRoute === '/inspection-summary';  
  }  
  
  isTugas(): boolean {  
    return this.currentRoute === '/tugas';  
  }  

  goBack(): void {
    const unit_id = this.router.url.split('/').pop();
    // window.history.back();
    if (this.currentRoute.startsWith('/detil-tugas')) {
      this.router.navigate(['/tugas']);
    } else if (this.currentRoute.startsWith('/inspeksi-unit')) {
      this.router.navigate(['/detil-tugas' + '/' + unit_id]);
    } else if (this.currentRoute.startsWith('/exterior-inspection')) {
      this.router.navigate(['/inspeksi-unit' + '/' + unit_id]);
    } else if (this.currentRoute.startsWith('/interior-inspection')) {
      // this.router.navigate(['/exterior-inspection' + '/' + unit_id]);
      this.router.navigate(['/inspeksi-unit' + '/' + unit_id]);
    } else if (this.currentRoute.startsWith('/engine-inspection')) {
      // this.router.navigate(['/interior-inspection' + '/' + unit_id]);
      this.router.navigate(['/inspeksi-unit' + '/' + unit_id]);
    }  else if (this.currentRoute.startsWith('/unit-photos')) {
      // this.router.navigate(['/engine-inspection' + '/' + unit_id]);
      this.router.navigate(['/inspeksi-unit' + '/' + unit_id]);
    }  else if (this.currentRoute.startsWith('/inspection-summary')) {
      this.router.navigate(['/unit-photos' + '/' + unit_id]);
    } else if (this.currentRoute.startsWith('/detil-riwayat')) {
      this.router.navigate(['/riwayat']);
    } else {
      this.router.navigate(['/detil-tugas']);
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

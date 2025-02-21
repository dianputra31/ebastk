import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-the-menu-of-detil-tugas',
  templateUrl: './the-menu-of-detil-tugas.component.html',
  styleUrls: ['./the-menu-of-detil-tugas.component.scss']
})
export class TheMenuOfDetilTugasComponent implements OnInit {
  @Output() menuSelected = new EventEmitter<string>();
  @Input() activeChipIndex: number = 0;

  // activeChipIndex: number = 0; // Indeks chip yang aktif  
  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  

  constructor() { }

  ngOnInit(): void {
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    const menuItems = ['Info Vendor', 'Info Kendaraan', 'Dokumen dan Kelengkapan Lainnya', 'Keterangan Lainnya'];
    this.menuSelected.emit(menuItems[index]);
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


}

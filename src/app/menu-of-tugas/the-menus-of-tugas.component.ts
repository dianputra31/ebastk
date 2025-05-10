import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-the-menus-of-tugas',
  templateUrl: './the-menus-of-tugas.component.html',
  styleUrls: ['./the-menus-of-tugas.component.scss']
})
export class TheMenusOfTugasComponent implements OnInit {
  @Output() filterTugasChange = new EventEmitter<string>();

  activeChipIndex: number = 0; // Indeks chip yang aktif  
  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  

  constructor() { }

  ngOnInit(): void {
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
    this.filterTugasChange.emit(sortingBy);

  }  


}

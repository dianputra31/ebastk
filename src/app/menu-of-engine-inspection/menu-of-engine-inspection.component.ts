import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-of-engine-inspection',
  templateUrl: './menu-of-engine-inspection.component.html',
  styleUrls: ['./menu-of-engine-inspection.component.scss']
})
export class MenuOfEngineInspectionComponent implements OnInit {
  @Output() chipSelected = new EventEmitter<number>();


  activeChipIndex: number = 0; // Indeks chip yang aktif  
  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  

  constructor() { }

  ngOnInit(): void {
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    this.chipSelected.emit(index);
  }  

}

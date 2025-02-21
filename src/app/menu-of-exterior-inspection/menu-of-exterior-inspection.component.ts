import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-of-exterior-inspection',
  templateUrl: './menu-of-exterior-inspection.component.html',
  styleUrls: ['./menu-of-exterior-inspection.component.scss']
})
export class MenuOfExteriorInspectionComponent implements OnInit {
  @Output() chipSelected = new EventEmitter<number>();
  @Output() panelToScroll = new EventEmitter<string>();


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


  scrollToPanel(panelName: string) {
    this.panelToScroll.emit(panelName);
  }

}

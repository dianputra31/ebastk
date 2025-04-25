import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-menu-of-interior-inspection',
  templateUrl: './menu-of-interior-inspection.component.html',
  styleUrls: ['./menu-of-interior-inspection.component.scss']
})
export class MenuOfInteriorInspectionComponent implements OnInit {

  @Output() panelToScroll = new EventEmitter<string>();
  @Output() menuSelected = new EventEmitter<string>();


  activeChipIndex: number = 0; // Indeks chip yang aktif  
  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  

  @Input() availableChip: { [key: string]: string[] } = {};
  
  constructor() { }

  ngOnInit(): void {
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    const menuItems =  this.availableChip['Interior'];
    this.menuSelected.emit(menuItems[index]);
  } 

}

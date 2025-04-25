import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-menu-of-engine-inspection',
  templateUrl: './menu-of-engine-inspection.component.html',
  styleUrls: ['./menu-of-engine-inspection.component.scss']
})
export class MenuOfEngineInspectionComponent implements OnInit {
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

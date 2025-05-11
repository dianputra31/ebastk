import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-menu-of-photos-inspection',
  templateUrl: './menu-of-photos-inspection.component.html',
  styleUrls: ['./menu-of-photos-inspection.component.scss']
})
export class MenuOfPhotosInspectionComponent implements OnInit {
  @Output() menuSelected = new EventEmitter<string>();
  @Input() activeChipIndex: number = 0;

  @Output() chipSelected = new EventEmitter<number>();


  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  

  constructor() { }

  ngOnInit(): void {
  }


  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    const menuItems = ['Bagian Luar', 'Bagian Dalam', 'Bagian Mesin', 'Foto Minus', 'Foto Sistem'];
    this.menuSelected.emit(menuItems[index]);
  }  


}

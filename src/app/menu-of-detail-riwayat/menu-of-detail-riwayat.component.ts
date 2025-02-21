import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-of-detail-riwayat',
  templateUrl: './menu-of-detail-riwayat.component.html',
  styleUrls: ['./menu-of-detail-riwayat.component.scss']
})
export class MenuOfDetailRiwayatComponent implements OnInit {
  @Output() chipSelected = new EventEmitter<number>();
  @Output() panelToScroll = new EventEmitter<string>();
  @Output() menuSelected = new EventEmitter<string>();


  activeChipIndex: number = 0; // Indeks chip yang aktif  
  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  

  constructor() { }

  ngOnInit(): void {
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    const menuItems = ['rw-info', 'rw-exterior', 'rw-interior', 'rw-engine', 'rw-photos'];
    this.menuSelected.emit(menuItems[index]);
  }  


  scrollToPanel(panelName: string) {
    this.panelToScroll.emit(panelName);
  }

}

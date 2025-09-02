import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PanelSyncService } from '../panel.service';

@Component({
  selector: 'app-menu-of-photos-inspection',
  templateUrl: './menu-of-photos-inspection.component.html',
  styleUrls: ['./menu-of-photos-inspection.component.scss']
})
export class MenuOfPhotosInspectionComponent implements OnInit {
@Output() menuSelected = new EventEmitter<string>();
@Input() activeChipIndex: number = 0;

@Output() chipSelected = new EventEmitter<number>();
activePanel: string = '';


  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  

  constructor(private panelSync: PanelSyncService) { 
    // this.panelSync.panel$.subscribe(panelId => {
    //   console.log("HEADER WE GOO===>", panelId);
    //   this.activePanel = panelId;

    //   // Update activeChipIndex sesuai panel aktif
    //   const idx = this.availableChip['Exterior']?.findIndex(chip => chip === panelId);
    //   if (idx !== -1 && idx !== undefined) {
    //     this.activeChipIndex = idx;
    //   }
    // });
  }

  ngOnInit(): void {
  }


  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    const menuItems = ['Bagian Luar', 'Bagian Dalam', 'Bagian Mesin', 'Foto Minus', 'Foto Sistem'];
    this.menuSelected.emit(menuItems[index]);
  }  


}

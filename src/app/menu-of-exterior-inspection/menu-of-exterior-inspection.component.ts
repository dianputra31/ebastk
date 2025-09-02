import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PanelSyncService } from '../panel.service';

@Component({
  selector: 'app-menu-of-exterior-inspection',
  templateUrl: './menu-of-exterior-inspection.component.html',
  styleUrls: ['./menu-of-exterior-inspection.component.scss']
})
export class MenuOfExteriorInspectionComponent implements OnInit {
// @Output() chipSelected = new EventEmitter<number>();
@Output() panelToScroll = new EventEmitter<string>();
@Output() menuSelected = new EventEmitter<string>();
// @Input() activePanel: string = '';


  activeChipIndex: number = 0; // Indeks chip yang aktif  
  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  

  
  @Input() availableChip: { [key: string]: string[] } = {};
  activePanel: string = '';


  constructor(private panelSync: PanelSyncService) { 
    this.panelSync.panel$.subscribe(panelId => {
      console.log("HEADER WE GOO===>", panelId);
      this.activePanel = panelId;

      // Update activeChipIndex sesuai panel aktif
      const idx = this.availableChip['Exterior']?.findIndex(chip => chip === panelId);
      if (idx !== -1 && idx !== undefined) {
        this.activeChipIndex = idx;
      }
    });
  }

  ngOnInit(): void {
    console.log("availableChip::", this.availableChip);
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    const menuItems =  this.availableChip['Exterior'];
    this.menuSelected.emit(menuItems[index]);

    // this.chipSelected.emit(index);
  }  


  scrollToPanel(panelName: string) {
    this.panelToScroll.emit(panelName);
  }

}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PanelSyncService } from '../panel.service';

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
activePanel: string = '';

  @Input() availableChip: { [key: string]: string[] } = {};
  
  constructor(private panelSync: PanelSyncService) { 
    this.panelSync.panel$.subscribe(panelId => {
      this.activePanel = panelId;

      // Update activeChipIndex sesuai panel aktif
      const idx = this.availableChip['Interior']?.findIndex(chip => chip === panelId);
      if (idx !== -1 && idx !== undefined) {
        this.activeChipIndex = idx;
      }
    });
  }

  ngOnInit(): void {
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    const menuItems =  this.availableChip['Interior'];
    this.menuSelected.emit(menuItems[index]);
  } 

}

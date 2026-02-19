import { Component, OnInit, Output, EventEmitter, Input, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { PanelSyncService } from '../panel.service';

@Component({
  selector: 'app-menu-of-interior-inspection',
  templateUrl: './menu-of-interior-inspection.component.html',
  styleUrls: ['./menu-of-interior-inspection.component.scss']
})
export class MenuOfInteriorInspectionComponent implements OnInit, AfterViewInit {

@Output() panelToScroll = new EventEmitter<string>();
@Output() menuSelected = new EventEmitter<string>();
@ViewChildren('chipEl') chipElements!: QueryList<ElementRef>;


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
        this.scrollActiveChipIntoView();
      }
    });
  }

  ngOnInit(): void {
    if (this.availableChip['Interior']) {
      this.availableChip['Interior'] = this.sortChipsByCustomOrder(this.availableChip['Interior']);
    }
  }

  sortChipsByCustomOrder(chips: string[]): string[] {
    const categoryOrder = ['depan', 'tengah', 'belakang'];

    const sorted: string[] = [];

    categoryOrder.forEach(orderCategory => {
      const matchingChip = chips.find(chip => chip.toLowerCase() === orderCategory);
      if (matchingChip) {
        sorted.push(matchingChip);
      }
    });

    chips.forEach(chip => {
      if (!categoryOrder.includes(chip.toLowerCase())) {
        sorted.push(chip);
      }
    });

    return sorted;
  }

  ngAfterViewInit() {
    this.scrollActiveChipIntoView();
  }

  scrollActiveChipIntoView() {
    setTimeout(() => {
      const chip = this.chipElements?.get(this.activeChipIndex);
      if (chip) {
        chip.nativeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 0);
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index; 
    const menuItems =  this.availableChip['Interior'];
    this.menuSelected.emit(menuItems[index]);
  } 

}

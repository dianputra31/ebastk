import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-engine-inspection',
  templateUrl: './engine-inspection.component.html',
  styleUrls: ['./engine-inspection.component.scss']
})
export class EngineInspectionComponent implements OnInit {

  isModalOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openModal() {
    this.isModalOpen = true; // Membuka modal
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interior-inspection',
  templateUrl: './interior-inspection.component.html',
  styleUrls: ['./interior-inspection.component.scss']
})
export class InteriorInspectionComponent implements OnInit {
  isModalOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openModal() {
    this.isModalOpen = true; // Membuka modal
  }

}

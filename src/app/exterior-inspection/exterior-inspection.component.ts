import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-exterior-inspection',
  templateUrl: './exterior-inspection.component.html',
  styleUrls: ['./exterior-inspection.component.scss']
})
export class ExteriorInspectionComponent implements AfterViewInit {
  isModalOpen: boolean = false;
  @Input() panelName: string = '';

  @ViewChild('kelengkapanUmum') kelengkapanUmum: ElementRef | undefined;
  @ViewChild('infoVendor') infoVendor: ElementRef | undefined;
  @ViewChild('keteranganLainnya') keteranganLainnya: ElementRef | undefined;

  constructor() { }

  ngAfterViewInit() {
    this.scrollToPanel(this.panelName);
  }

  scrollToPanel(panelName: string) {
    if (!panelName) return;

    let element: ElementRef | undefined = undefined;

    switch (panelName) {
      case 'Kelengkapan Umum':
        element = this.kelengkapanUmum;
        break;
      case 'Info Vendor':
        element = this.infoVendor;
        break;
      case 'Keterangan Lainnya':
        element = this.keteranganLainnya;
        break;
      // Tambahkan lebih banyak kasus sesuai kebutuhan
    }

    if (element) {
      element.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnInit(): void {
  }

  openModal() {
    this.isModalOpen = true; // Membuka modal
  }

}

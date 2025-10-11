import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-the-vendor-modal',
  templateUrl: './the-vendor-modal.component.html',
  styleUrls: ['./the-vendor-modal.component.scss']
})
export class TheVendorModalComponent {

  @Input() vendors: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectVendor = new EventEmitter<any>();

  filterText: string = '';
  page: number = 1;
  pageSize: number = 10;

  get filteredVariants() {
    let filtered = this.vendors.filter(v =>
      v.vendor_name.toLowerCase().includes(this.filterText.toLowerCase()) 
    );
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(
      this.vendors.filter(v =>
        v.vendor_name.toLowerCase().includes(this.filterText.toLowerCase())
      ).length / this.pageSize
    );
  }

  select(v: any) {
    this.selectVendor.emit(v);
    this.close.emit();
  }
}

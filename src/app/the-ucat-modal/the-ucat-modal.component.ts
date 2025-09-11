import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-the-ucat-modal',
  templateUrl: './the-ucat-modal.component.html',
  styleUrls: ['./the-ucat-modal.component.scss']
})
export class TheUcatModalComponent {

  @Input() brands: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectBrand = new EventEmitter<any>();

  filterText: string = '';
  page: number = 1;
  pageSize: number = 10;

  get filteredVariants() {
    let filtered = this.brands.filter(v =>
      v.category_name.toLowerCase().includes(this.filterText.toLowerCase()) 
    );
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(
      this.brands.filter(v =>
        v.category_name.toLowerCase().includes(this.filterText.toLowerCase())
      ).length / this.pageSize
    );
  }

  select(v: any) {
    this.selectBrand.emit(v);
    this.close.emit();
  }
}

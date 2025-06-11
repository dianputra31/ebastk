import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-the-tipe-modal',
  templateUrl: './the-tipe-modal.component.html',
  styleUrls: ['./the-tipe-modal.component.scss']
})
export class TheTipeModalComponent {
  @Input() variants: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectVariant = new EventEmitter<any>();

  filterText: string = '';
  page: number = 1;
  pageSize: number = 10;

  get filteredVariants() {
    let filtered = this.variants.filter(v =>
      v.variant_name.toLowerCase().includes(this.filterText.toLowerCase()) ||
      v.model_name.toLowerCase().includes(this.filterText.toLowerCase())
    );
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(
      this.variants.filter(v =>
        v.variant_name.toLowerCase().includes(this.filterText.toLowerCase())
      ).length / this.pageSize
    );
  }

  select(v: any) {
    this.selectVariant.emit(v);
    this.close.emit();
  }
}
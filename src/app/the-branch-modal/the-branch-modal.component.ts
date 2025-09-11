import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-the-branch-modal',
  templateUrl: './the-branch-modal.component.html',
  styleUrls: ['./the-branch-modal.component.scss']
})
export class TheBranchModalComponent {

  @Input() branchs: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectBranch = new EventEmitter<any>();

  filterText: string = '';
  page: number = 1;
  pageSize: number = 10;

  get filteredVariants() {
    let filtered = this.branchs.filter(v =>
      v.branch_name.toLowerCase().includes(this.filterText.toLowerCase()) 
    );
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(
      this.branchs.filter(v =>
        v.branch_name.toLowerCase().includes(this.filterText.toLowerCase())
      ).length / this.pageSize
    );
  }

  select(v: any) {
    this.selectBranch.emit(v);
    this.close.emit();
  }
}

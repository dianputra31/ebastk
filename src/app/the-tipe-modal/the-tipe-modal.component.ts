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

  get groupedModels() {
    const groupedMap = new Map<string, any[]>();

    this.variants.forEach(variant => {
      const rawModel = (variant?.model_name || '').toString();
      const groupedModelName = rawModel.trim();

      if (!groupedModelName) {
        return;
      }

      if (!groupedMap.has(groupedModelName)) {
        groupedMap.set(groupedModelName, []);
      }

      groupedMap.get(groupedModelName)!.push(variant);
    });

    const search = this.filterText.toLowerCase();
    const groupedArray = Array.from(groupedMap.entries()).map(([modelName, variants]) => ({
      modelName,
      variants
    }));

    const filteredGroups = groupedArray.filter(group =>
      group.modelName.toLowerCase().includes(search) ||
      group.variants.some(v =>
        (v?.variant_name || '').toLowerCase().includes(search) ||
        (v?.model_name || '').toLowerCase().includes(search)
      )
    );

    const start = (this.page - 1) * this.pageSize;
    return filteredGroups.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(
      this.getFilteredGroupCount() / this.pageSize
    );
  }

  getFilteredGroupCount() {
    const groupedMap = new Map<string, any[]>();

    this.variants.forEach(variant => {
      const rawModel = (variant?.model_name || '').toString();
      const groupedModelName = rawModel.trim();

      if (!groupedModelName) {
        return;
      }

      if (!groupedMap.has(groupedModelName)) {
        groupedMap.set(groupedModelName, []);
      }

      groupedMap.get(groupedModelName)!.push(variant);
    });

    const search = this.filterText.toLowerCase();
    return Array.from(groupedMap.entries()).filter(([modelName, variants]) =>
      modelName.toLowerCase().includes(search) ||
      variants.some(v =>
        (v?.variant_name || '').toLowerCase().includes(search) ||
        (v?.model_name || '').toLowerCase().includes(search)
      )
    ).length;
  }

  select(v: any) {
    this.selectVariant.emit(v);
    this.close.emit();
  }

  selectGroupedModel(group: { modelName: string; variants: any[] }) {
    const firstVariant = group.variants?.[0];
    if (firstVariant) {
      this.selectVariant.emit({
        ...firstVariant,
        grouped_model_name: group.modelName
      });
      this.close.emit();
    }
  }
}
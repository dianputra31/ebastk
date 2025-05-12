import { Component, OnInit, Input } from '@angular/core';
import { UnitDetailResponse } from 'src/assets/models/detail-unit.model';
import { VendorDetailResponse } from 'src/assets/models/vendor-detail.model';

@Component({
  selector: 'app-the-detail-history-info',
  templateUrl: './the-detail-history-info.component.html',
  styleUrls: ['./the-detail-history-info.component.scss']
})
export class TheDetailHistoryInfoComponent implements OnInit {
// @Input() sampleDataVendor: any;
@Input() sampleDataVendor: VendorDetailResponse | null = null;
@Input() sampleData: UnitDetailResponse | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}

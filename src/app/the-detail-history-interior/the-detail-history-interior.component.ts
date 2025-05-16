import { Component, OnInit, Input } from '@angular/core';
import { UnitDetailResponse } from 'src/assets/models/detail-unit.model';

@Component({
  selector: 'app-the-detail-history-interior',
  templateUrl: './the-detail-history-interior.component.html',
  styleUrls: ['./the-detail-history-interior.component.scss']
})
export class TheDetailHistoryInteriorComponent implements OnInit {
@Input() sampleData: UnitDetailResponse | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}

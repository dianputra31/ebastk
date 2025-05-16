import { Component, OnInit, Input } from '@angular/core';
import { UnitDetailResponse } from 'src/assets/models/detail-unit.model';

@Component({
  selector: 'app-the-detail-history-exterior',
  templateUrl: './the-detail-history-exterior.component.html',
  styleUrls: ['./the-detail-history-exterior.component.scss']
})
export class TheDetailHistoryExteriorComponent implements OnInit {
@Input() sampleData: UnitDetailResponse | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { UnitDetailResponse } from 'src/assets/models/detail-unit.model';

@Component({
  selector: 'app-the-detail-history-engine',
  templateUrl: './the-detail-history-engine.component.html',
  styleUrls: ['./the-detail-history-engine.component.scss']
})
export class TheDetailHistoryEngineComponent implements OnInit {
@Input() sampleData: UnitDetailResponse | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}

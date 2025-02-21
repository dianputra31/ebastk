import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-the-detail-history',
  templateUrl: './the-detail-history.component.html',
  styleUrls: ['./the-detail-history.component.scss']
})
export class TheDetailHistoryComponent implements OnInit {
  @Input() stepHistory: any;

  constructor() { }

  ngOnInit(): void {
  }

}

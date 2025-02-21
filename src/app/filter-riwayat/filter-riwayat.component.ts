import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-filter-riwayat',
  templateUrl: './filter-riwayat.component.html',
  styleUrls: ['./filter-riwayat.component.scss']
})
export class FilterRiwayatComponent implements OnInit {
  @Input() placeholder: string = 'cari unit';
  inputValue: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}

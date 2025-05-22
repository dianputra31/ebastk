import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoahService } from '../noah.service';

@Component({
  selector: 'app-filter-riwayat',
  templateUrl: './filter-riwayat.component.html',
  styleUrls: ['./filter-riwayat.component.scss']
})
export class FilterRiwayatComponent implements OnInit {
  @Input() placeholder: string = 'cari unit';
  @Output() inputChange: EventEmitter<string> = new EventEmitter<string>();
  inputValue: string = '';

  constructor(private noahService: NoahService) { } 

  ngOnInit(): void {
  }

  onInputChange(event: any) {
    this.inputValue = event.target.value;
    console.log(this.inputValue);
    this.inputChange.emit(this.inputValue);

    this.noahService.emitFilterRiwayat(this.inputValue);
  }

}

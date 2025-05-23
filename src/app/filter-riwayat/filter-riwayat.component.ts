import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoahService } from '../noah.service';

@Component({
  selector: 'app-filter-riwayat',
  templateUrl: './filter-riwayat.component.html',
  styleUrls: ['./filter-riwayat.component.scss']
})
export class FilterRiwayatComponent implements OnInit {
  @Input() placeholder: string = 'cari unit (Nopol/Tipe Unit)';
  @Output() inputChange: EventEmitter<string> = new EventEmitter<string>();
  inputValue: string = '';
  private debounceTimeout: any; // tambahkan ini
  private debounceDelay: number = 300; // waktu dalam milidetik


  constructor(private noahService: NoahService) { } 

  ngOnInit(): void {
  }

  onInputChange(event: any) {
  this.inputValue = event.target.value;
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(() => {
        this.noahService.emitFilterRiwayat(this.inputValue);
      }, 500); // delay 300ms, bisa diubah sesuai kebutuhan
    }

}

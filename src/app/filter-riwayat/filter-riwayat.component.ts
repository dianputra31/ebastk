import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoahService } from '../noah.service';
import { ApiVendorResponse } from 'src/assets/models/list-vendor.model';
import { VendorDetailResponse } from 'src/assets/models/vendor-detail.model';
import { ApiClientService } from '../services/api.client';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-riwayat',
  templateUrl: './filter-riwayat.component.html',
  styleUrls: ['./filter-riwayat.component.scss']
})
export class FilterRiwayatComponent implements OnInit {
  @Input() placeholder: string = 'cari unit (Nopol/Tipe Unit)...';
  @Output() inputChange: EventEmitter<string> = new EventEmitter<string>();
  inputValue: string = '';
  startDate: string = '';
  endDate: string = '';
  private debounceTimeout: any; // tambahkan ini
  private debounceDelay: number = 300; // waktu dalam milidetik
  isVendorModalOpen: boolean = false;
  vendors: ApiVendorResponse | null = null
  selectedVendor: string = '';
  selectedVendorName: string = '';
  selectedVendorId: string = '';
  sampleDataVendor: VendorDetailResponse | null = null;
  vendor_id: number | null = null;
  errlog:string = '';
  isButtonDisabled: boolean = false;
  isLoading: boolean = false;

  constructor(private noahService: NoahService, private authService: AuthService, private apiClient: ApiClientService, private modalService: NgbModal) { } 

  ngOnInit(): void {
    this.showVendor();
  }

  openVendorCategory() {
    this.isVendorModalOpen = true;
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

  onDateChange() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      // Emit filter dengan tanggal
      this.noahService.emitDateFilter(this.startDate, this.endDate);
    }, 500);
  }

  onVendorSelected(vendor: any) {
    this.selectedVendorName = vendor.vendor_name;
    this.selectedVendorId = vendor.id;
    this.selectedVendor = this.selectedVendorId;
    this.selectedVendorName = this.selectedVendorName;
    // Fetch vendor detail and assign to sampleDataVendor
    if (this.selectedVendorId) {
      // this.infoVendor(Number(this.selectedVendorId));
    } else {
      this.sampleDataVendor = null;
    }
    this.vendor_id = Number(this.selectedVendorId);
  }

   async showVendor() {
    const brand_name = {
      keyword: ''
    };
    this.errlog = "";
    try {
      const endpoint = `/vendor`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiVendorResponse>(endpoint);
      if (response) {
        this.vendors = response;

      }else{
        this.errlog = 'Username atau password salah';
      }
    } catch (error) {
      this.isButtonDisabled = false;
      if (axios.isAxiosError(error)) {
        // Cek status kode dari respons
        if (error.response && error.response.status === 401) {
          this.errlog = 'Username atau password salah.';
        } else {
          this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
        }
      } else {
        this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
      }
      this.isLoading = false;
    }
  }

  


}

import { Component, OnInit, Input } from '@angular/core';
import { UnitDetailResponse } from 'src/assets/models/detail-unit.model';
import { ApiVehicleTypeResponse } from 'src/assets/models/list-vehicle-tipe.model';
import { VendorDetailResponse } from 'src/assets/models/vendor-detail.model';
import axios from 'axios';
import { ApiClientService } from '../services/api.client';
import { ApiBrandResponse } from 'src/assets/models/list-brand.model';
import { ApiVariantResponse } from 'src/assets/models/list-variant.model';
import { ApiColorResponse } from 'src/assets/models/list-color.model';

@Component({
  selector: 'app-the-detail-history-info',
  templateUrl: './the-detail-history-info.component.html',
  styleUrls: ['./the-detail-history-info.component.scss']
})
export class TheDetailHistoryInfoComponent implements OnInit {
// @Input() sampleDataVendor: any;
@Input() sampleDataVendor: VendorDetailResponse | null = null;
@Input() sampleData: UnitDetailResponse | null = null;
pic: any = '';
vehicletype: ApiVehicleTypeResponse | null = null
brands: ApiBrandResponse | null = null
variants: ApiVariantResponse | null = null
colors: ApiColorResponse | null = null
selectedExpedition: string = '';
selectedVariant: string = '';
selectedColor: string = '';
selectedVehicType: string = '';
selectedBrand: string = '';
selectedLocation: string = '';
selectedOdo: string = '';
selectedTransmission: string = '';
selectedYear: string = '';
modelname: any = '';
payloadUnit: any = null;
variant_model_id: string = '';
brandid:any = '';
brandName:any = '';

errlog:string = '';
isButtonDisabled: boolean = false;
isLoading: boolean = false;

choices: [string, string][] = [
  ['Drive', 'Drive'],
  ['Derek', 'Derek'],
  ['No', 'No']
];

transmissionOptions: [string, string][] = [
  ['MT', 'Manual Transmission'],
  ['AT', 'Automatic Transmission'],
  // ['CVT', 'CVT'],
  ['EV', 'EV'],
  // ['Matic', 'Matic'],
  // ['Semi Automatic', 'Semi Automatic'],
  ['Tiptronic', 'Tiptronic']
  // ['AMT', 'AMT'],
  // ['Dual Clutch', 'Dual Clutch'],
  // ['Other', 'Other']
];

  constructor(private apiClient: ApiClientService) { }

  ngOnInit(): void {
    this.pic = this.sampleData?.mobilization_units[0].mobiliztion.pic;

    this.showVehicleType();
    this.showBrand();
    this.showColor();
  }

  async showVariant(brand_id: number) {
    const brand_name = {
      keyword: ''
    };
    this.errlog = "";
    try {
      const endpoint = `/brands-model?brand_id=${brand_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiVariantResponse>(endpoint);
      if (response) {
        this.variants = response;
        console.log('Variants:', this.variants);

        // Cek apakah sampleData?.variant_model?.id ada di results
        const variantId = this.sampleData?.variant_model?.id;
        const found = response.results.find((item: any) => item.id === variantId);

        if (found) {
          this.modelname = found.id;
        } else {
          this.modelname = "";
        }
      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }
    } catch (error) {
      this.isButtonDisabled = false;
      // this.authService.logout();
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
      console.error('Error during login:', error);
      this.isLoading = false;
    }
  }

  async showColor() {

    this.errlog = "";
    try {
      const endpoint = `/colors`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiColorResponse>(endpoint);
      if (response) {
        this.colors = response;
      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }
    } catch (error) {
      this.isButtonDisabled = false;
      // this.authService.logout();
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
      console.error('Error during login:', error);
      this.isLoading = false;
    }
  }

  async showVehicleType() {

    this.errlog = "";
    try {
      const endpoint = `/unit-type`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiVehicleTypeResponse>(endpoint);
      if (response) {
        this.vehicletype = response;
        this.brandName = this.sampleData?.brand.brand_name;

      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }
    } catch (error) {
      this.isButtonDisabled = false;
      // this.authService.logout();
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
      console.error('Error during login:', error);
      this.isLoading = false;
    }
  }


  async showBrand() {
    const brand_name = {
      keyword: ''
    };
    this.errlog = "";
    try {
      const endpoint = `/brands?keyword=${this.brandName}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiBrandResponse>(endpoint);
      if (response) {
        this.brands = response;  
        this.showVariant(this.brandid);
      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }
    } catch (error) {
      this.isButtonDisabled = false;
      // this.authService.logout();
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
      console.error('Error during login:', error);
      this.isLoading = false;
    }
  }



}

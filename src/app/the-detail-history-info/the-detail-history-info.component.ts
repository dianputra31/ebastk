import { Component, OnInit, Input } from '@angular/core';
import { UnitDetailResponse, UnitDocument } from 'src/assets/models/detail-unit.model';
import { ApiVehicleTypeResponse } from 'src/assets/models/list-vehicle-tipe.model';
import { VendorDetailResponse } from 'src/assets/models/vendor-detail.model';
import axios from 'axios';
import { ApiClientService } from '../services/api.client';
import { ApiBrandResponse } from 'src/assets/models/list-brand.model';
import { ApiVariantResponse } from 'src/assets/models/list-variant.model';
import { ApiColorResponse } from 'src/assets/models/list-color.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageGalleryModalComponent } from '../image-gallery-modal/image-gallery-modal.component';
import { Router } from '@angular/router';

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
unitdocuments: UnitDocument[] = [];
selectedKeur: string = '';
keur_notice: any = null;
tax_notice: any = null;
selectedKeurStatus: string = 'Tidak Ada';
keurDateString: string = '';
selectedStnkStatus: string = 'Tidak Ada';
stnkDateString: string = '';
HiLocation: string | undefined;

errlog:string = '';
isButtonDisabled: boolean = false;
isLoading: boolean = false;

adaTidakOptions = [
  'Ada',
  'Tidak Ada'
];

choices: [string, string][] = [
  ['Drive', 'Drive'],
  ['Derek', 'Derek'],
  ['No', 'No']
];

transmissionOptions: [string, string][] = [
  ['MT', 'Manual Transmission'],
  ['AT', 'Automatic Transmission'],
  // ['CVT', 'CVT'],
  // ['EV', 'EV'],
  // ['Matic', 'Matic'],
  // ['Semi Automatic', 'Semi Automatic'],
  ['Tiptronic', 'Tiptronic']
  // ['AMT', 'AMT'],
  // ['Dual Clutch', 'Dual Clutch'],
  // ['Other', 'Other']
];

  constructor(private apiClient: ApiClientService, private modalService: NgbModal, private router: Router) { }

  private normalizeDateForInput(dateValue: any): string {
    if (!dateValue || typeof dateValue !== 'string') return '';

    const parts = dateValue.trim().split('-');
    if (parts.length !== 3) return '';

    let day = '';
    let month = '';
    let year = '';

    if (parts[0].length === 4) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else if (parts[2].length === 4) {
      day = parts[0];
      month = parts[1];
      year = parts[2];
    } else {
      return '';
    }

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  formatNumber(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    return new Intl.NumberFormat('id-ID').format(value);
  }

  ngOnInit(): void {
    this.pic = this.sampleData?.mobilization_unit[0].mobilization.pic;
    console.log('this.sampleData?.brand.brand_name:', this.sampleData);
    
    // Initialize HiLocation from localStorage
    this.HiLocation = localStorage.getItem('branch') || 'Branch';
    
    // Initialize keur data and other fields
    if (this.sampleData) {
      this.selectedKeur = this.sampleData.keur || 'T/A';
      this.keur_notice = this.sampleData.keur_notice;
      this.tax_notice = this.sampleData.tax_notice;
      this.selectedKeurStatus = this.sampleData.keur === 'T/A' ? 'Tidak Ada' : 'Ada';
      
      // Normalize KEUR date ke yyyy-mm-dd untuk input date
      if (this.selectedKeur && this.selectedKeur !== 'T/A' && this.keur_notice) {
        this.keurDateString = this.normalizeDateForInput(this.keur_notice);
      }
      
      // Normalize STNK date and set status
      if (this.tax_notice) {
        this.stnkDateString = this.normalizeDateForInput(this.tax_notice);
        this.selectedStnkStatus = 'Ada';
      } else {
        this.selectedStnkStatus = 'Tidak Ada';
      }
      
      // Initialize ODO
      this.selectedOdo = this.sampleData.odo_meter ? String(this.sampleData.odo_meter) : '';
    }
    
    this.showVehicleType();
    this.showBrand();
    this.showColor();
  }


  async openGallery(a:string) {
console.log("openGallery tipeDoc:", a);
console.log("this.sampleData:", this.sampleData);
console.log("this.sampleData?.idcardsender_url:", this.sampleData?.idcardsender_url);
    try{

          const modalRef = this.modalService.open(ImageGalleryModalComponent, { size: 'lg' });
          modalRef.componentInstance.carName = this.sampleData?.display_name;
          modalRef.componentInstance.unitId = this.sampleData?.id;
          modalRef.componentInstance.tipeDoc = a;
          modalRef.componentInstance.isViewOnly = true;
          
          if(a=='BPKB'){
            modalRef.componentInstance.images =  this.sampleData?.unitdocuments.filter(doc => doc.file_type === 'BPKB');
          }else if(a=='STNK'){
            modalRef.componentInstance.images =  this.sampleData?.unitdocuments.filter(doc => doc.file_type === 'STNK');
          }else if(a=='SURATKUASA'){
            modalRef.componentInstance.images =  this.sampleData?.unitdocuments.filter(doc => doc.file_type === 'SURATKUASA');
          }else if(a=='BASTK'){
            modalRef.componentInstance.images =  this.sampleData?.unitdocuments.filter(doc => doc.file_type === 'BASTK');
          }else if(a=='KTP'){
            modalRef.componentInstance.images =  this.sampleData?.idcardsender_url;
          }else{
            modalRef.componentInstance.images =  this.sampleData?.unitdocuments.filter(doc => doc.file_type === 'LAINNYA');
          }
    }catch (error) {
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
    }
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
      // alert(this.sampleData?.brand.brand_name);
      const endpoint = `/brands?keyword=${this.sampleData?.brand.brand_name}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiBrandResponse>(endpoint);
      if (response) {
        this.brands = response;  
        this.showVariant(this.brands?.results[0].id);
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

import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand, UnitDocument  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { ApiBrandResponse } from '../../assets/models/list-brand.model';
import { ApiVariantResponse } from '../../assets/models/list-variant.model';
import { ApiColorResponse } from '../../assets/models/list-color.model';
import { ApiVehicleTypeResponse  } from '../../assets/models/list-vehicle-tipe.model';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';
import { trigger, style, transition, animate, stagger, query, animateChild } from '@angular/animations';
import { ApiClientService } from '../services/api.client';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { ImageGalleryModalComponent } from '../image-gallery-modal/image-gallery-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MobilisasiUnit, UnitDataMobilisasi } from 'src/assets/models/mobilisasi-unit.model';
import { ApiUnitCategoryResponse } from 'src/assets/models/list-unit-category.model';
import { NewApiBranchResponse } from 'src/assets/models/list-branch.model';
import { ApiVendorResponse } from 'src/assets/models/list-vendor.model';
declare var $: any;


@Component({
  selector: 'app-the-unit-input',
  templateUrl: './the-unit-input.component.html',
  styleUrls: ['./the-unit-input.component.scss']
})
export class TheUnitInputComponent implements OnInit {
  // isExpanded: boolean = true;
  expandedPanelIndex: number = 0; // Menyimpan index panel yang diperluas
  @Output() panelChange = new EventEmitter<string>();
  errlog:string = '';
  sampleData: UnitDetailResponse | null = null;
  sampleDataMobilisasi: MobilisasiUnit | null = null;
  sampleDataUnitMobilisasi: Record<string, string> = {};
  sampleDataVendor: VendorDetailResponse | null = null;
  currentDate: Date = new Date(); // Mendapatkan tanggal dan waktu saat ini
  @Input() fromDashboard:any;
  isButtonDisabled: boolean = false;
  isLoading: boolean = false;
  username: string = '';
  password: string = '';
  pic: string = '';
  tgl_mobilisasi: string = '';
  unit_id: any = '';
  unitdocuments: UnitDocument[] = [];
  bpkbDocuments: UnitDocument[] = [];
  stnkDocuments: UnitDocument[] = [];
  suratKuasaDocuments: UnitDocument[] = [];
  bastkVendorDocuments: UnitDocument[] = [];
  lainnyaDocuments: UnitDocument[] = [];
  display_name: string = '';
  keyword: string = '';
  brands: ApiBrandResponse | null = null
  variants: ApiVariantResponse | null = null
  colors: ApiColorResponse | null = null
  vehicletype: ApiVehicleTypeResponse | null = null
  unitcategory: ApiUnitCategoryResponse | null = null
  vendors: ApiVendorResponse | null = null
  branches: NewApiBranchResponse | null = null
  selectedExpedition: string = '';
  selectedVariant: string = '';
  selectedColor: string = '';
  selectedVehicType: string = '';
  selectedBrand: string = '';
  selectedUcat: string = '';
  selectedVendor: string = '';
  selectedLocation: string = localStorage.getItem('branch') || '';
  selectedBranch: string = '';
  selectedOdo: number | null = null;
  selectedCc: number | null = null;
  selectedNoka: string = '';
  selectedNosin: string = '';
  selectedTaxNoticeDate: string = '';
  selectedAssignmentNumber: string = '';
  selectedBpkbStatus: string = '';
  selectedTransmission: string = '';
  // selectedYear: string = '';
  bastk_file: string = '';
  proxy_file: string = '';
  // currentYear = new Date().getFullYear();
  modelname: any = '';
  payloadUnit: any = null;
  variant_model_id: string = '';
  brandid:any = '';
  isTipeModalOpen = false;
  isBrandModalOpen = false;
  isCopasModalOpen = false;
  isUcatModalOpen = false;
  isBranchModalOpen = false;
  selectedVariantName = '';
  selectedVariantId: string = '';
  selectedBrandName: string = '';
  selectedUcatName: string = '';
  selectedVendorName: string = '';
  selectedVendorId: string = '';
  selectedBranchName: string = '';
  selectedBrandId: string = '';
  selectedUcatId: string = '';
  licensePlatePart1: string = '';
  licensePlatePart2: string = '';
  licensePlatePart3: string = '';
  selectedBranchId: string = '';
  bastk_status: string = '';
  selectedBpkbNumber: string = '';
  selectedBpkbName: string = '';
  selectedKeur: string = '';
  keurDateString: string = '';
  stnkDateString: string = '';
  todayDateString: string = new Date().toISOString().split('T')[0];
  selectedPicPool: string = '';
  selectedPicPoolPhone: string = '';
  selectedNotes: string = '';
  selectedPicSender: string = '';
  selectedPicSenderPhone: string = '';
  selectedLicensePlate: string = '';
  objectKeys = Object.keys;
  selectedLimitPrice: number | null = null;
  selectedExamPrice: number | null = null;
  vendor_id: number | null = null;
  selectedMobilizationUnitId: number | null = null;
  currentYear: number = new Date().getFullYear();
// selectedYearDate: Date | null = null;
// maxYearDate: Date = new Date();
// maxYearDate: Date = new Date(new Date().getFullYear(), 11, 31); // 31 Desember tahun berjalan

selectedYear: number | null = null;
selectedYearDate: Date | null = null;
selectedPicPhoneSender: string = '';

years: number[] = [];

maxYearDate: Date = new Date(new Date().getFullYear(), 11, 31);

  choices: [string, string][] = [
    ['No', 'No'],
    ['No-Derek', 'No-Derek']
];



  bpkbOptions = [
    '7 HK',
    '14 HK',
    '21 HK',
    '25 HK',
    '28 HK',
    '30 HK',
    '40 HK',
    '60 HK',
    '90 HK',
    '120 HK'
  ];


  fuelOptions = [
    'Bensin',
    'Diesel',
    'Electric',
    'Hybrid',
    'Hidrogen'
  ];

  checkedTaxByOptions = [
    'Fisik',
    'Samsat Online'
  ];

  adaTidakOptions = [
    'Ada',
    'Tidak Ada'
  ];

  selectedBpkb: string | null = null;
  selectedFuel: string | null = null;
  selectedTaxBy: string | null = null;
  selectedStnk: string | null = null;
  selectedSph: string | null = null;
  selectedKwt: string | null = null;
  selectedForma: string | null = null;
  selectedFaktur: string | null = null;

transmissionOptions: [string, string][] = [
  ['MT', 'Manual'],
  ['AT', 'Automatic'],
  // ['CVT', 'CVT'],
  // ['EV', 'EV'],
  // ['Matic', 'Matic'],
  // ['Semi Automatic', 'Semi Automatic'],
  ['Tiptronic', 'Triptronic']
  // ['AMT', 'AMT'],
  // ['Dual Clutch', 'Dual Clutch'],
  // ['Other', 'Other']
];
  isVendorModalOpen: boolean = false;
  selectedLokasiUnit: any;
  

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const infoVendorPanel = document.getElementById('infoVendorPanel');
    const infoKendaraanPanel = document.getElementById('infoKendaraanPanel');
    const infoLainnyaPanel = document.getElementById('infoLainnyaPanel');

    if (infoKendaraanPanel && this.isElementInViewport(infoKendaraanPanel)) {
      this.panelChange.emit('Info Kendaraan');
    } else if (infoVendorPanel && this.isElementInViewport(infoVendorPanel)) {
      this.panelChange.emit('Info Vendor');
    }else if (infoLainnyaPanel && this.isElementInViewport(infoLainnyaPanel)) {
      this.panelChange.emit('Keterangan Lainnya');
    }
  }

  openTipeModal() {
    this.isTipeModalOpen = true;
  }

  openBrandModal() {
    this.isBrandModalOpen = true;
  }

  openCopasModal() {
    this.isCopasModalOpen = true;
  }

  openUnitCategory() {
    this.isUcatModalOpen = true;
  }

  openVendorCategory() {
    this.isVendorModalOpen = true;
  }

  openBranch() {
    this.isBranchModalOpen = true;
  }





chosenYearHandler(normalizedYear: Date, datepicker: any) {
  this.selectedYear = normalizedYear.getFullYear();
  this.selectedYearDate = new Date(this.selectedYear, 0, 1); // dummy date utk binding
  datepicker.close(); // tutup setelah pilih tahun
  console.log(this.selectedYear);
}

onYearSelected(event: any) {
  // Optional: handle if you want to react to dateChange
}

  onVariantSelected(variant: any) {
    this.selectedVariantName = variant.variant_name;
    this.selectedVariantId = variant.id;
    // lakukan logic lain, misal set ke form, dsb
    this.selectedVariant = this.selectedVariantId;
    this.savePayloadUnit();
  }

  onBrandSelected(brand: any) {
    this.selectedBrandName = brand.brand_name;
    this.selectedBrandId = brand.id;
    // lakukan logic lain, misal set ke form, dsb
    this.selectedBrand = this.selectedBrandId;
    this.showVariant(brand.id);
    this.selectedVariantName = '';
    this.savePayloadUnit();
  }

  onCopasSelected(item: any) {
    // this.selectedCopasName = item.name;
    // this.selectedCopasId = item.id;
    // lakukan logic lain, misal set ke form, dsb
  }

  onUcatSelected(brand: any) {
    this.selectedUcatName = brand.category_name;
    this.selectedUcatId = brand.id;
    // lakukan logic lain, misal set ke form, dsb
    this.selectedUcat = this.selectedUcatId;
    // this.showVariant();
    this.savePayloadUnit();
  }

  onVendorSelected(vendor: any) {
    this.selectedVendorName = vendor.vendor_name;
    this.selectedVendorId = vendor.id;
    this.selectedVendor = this.selectedVendorId;
    this.selectedVendorName = this.selectedVendorName;
    // Fetch vendor detail and assign to sampleDataVendor
    if (this.selectedVendorId) {
      this.infoVendor(Number(this.selectedVendorId));
    } else {
      this.sampleDataVendor = null;
    }
    this.vendor_id = Number(this.selectedVendorId);
  }

  onBranchSelected(brand: any) {
    this.selectedBranchName = brand.category_name;
    this.selectedBranchId = brand.id;
    // lakukan logic lain, misal set ke form, dsb
    this.selectedBranch = this.selectedBranchId;
    this.savePayloadUnit();
  }

  isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private modalService: NgbModal) { }

  ngOnInit(): void {
    
    this.showColor();
    this.showBranch();
    this.showVehicleType();
    this.showUnitCategory();
    this.showVendor();
    this.showBrand();

      const currentYear = new Date().getFullYear();
      const startYear = 1980; // batas bawah tahun
      for (let y = currentYear; y >= startYear; y--) {
        this.years.push(y);
      }
  }

  


  async showBrand() {
    const brand_name = {
      keyword: ''
    };
    this.errlog = "";
    try {
      const endpoint = `/brands?keyword=${this.keyword}`; // Menambahkan parameter ke endpoint
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


  async savePayloadUnit() {
    // Build payloadUnit only with fields that have values
    const payload: any = {
      mobilization_unit_id: 0,
      vendor: this.vendor_id
      // bastk_status: this.bastk_status
    };
    

    // if (this.selectedTaxNoticeDate) payload.assignment_date = this.selectedTaxNoticeDate;
    // if (this.selectedAssignmentNumber) payload.assignment_number = this.selectedAssignmentNumber;
    // if (this.selectedBranch) payload.branch = this.selectedBranch;

    // if (this.selectedMobilizationUnitId) payload.mobilization_unit_id = this.selectedMobilizationUnitId;
    if (this.selectedLicensePlate) payload.police_number = this.selectedLicensePlate.toUpperCase();
    if (this.selectedTransmission) payload.transmission = this.selectedTransmission;
    if (this.selectedFuel) payload.fuel = this.selectedFuel;
    if (this.selectedYear) payload.unit_year = this.selectedYear;
    if (this.bastk_file) payload.bastk_file = "";
    if (this.proxy_file) payload.proxy_file = "";
    if (this.selectedOdo) payload.odo_meter = this.selectedOdo;
    if (this.selectedCc) payload.cc = this.selectedCc;
    if (this.selectedLocation) payload.unit_location = this.selectedLocation;
    if (this.selectedExpedition) payload.expedition = this.selectedExpedition;
    if (this.selectedPicPool) payload.pic_pool = "";
    if (this.selectedPicPoolPhone) payload.pic_pool_phone = "";
    if (this.selectedPicSender) payload.pic_sender = this.selectedPicSender.toUpperCase();
    if (this.selectedPicSenderPhone) payload.pic_sender_phone = this.selectedPicSenderPhone;
    if (this.selectedNoka) payload.chassis_number = this.selectedNoka.toUpperCase();
    if (this.selectedNosin) payload.engine_number = this.selectedNosin.toUpperCase();
    if (this.selectedStnk) payload.stnk_status = this.selectedStnk;
    // if (this.selectedTaxNoticeDate) payload.tax_notice = this.selectedTaxNoticeDate;
    if (this.selectedTaxNoticeDate) payload.tax_notice = "-";
    if (this.selectedTaxBy) payload.tax_checked_by = "-";
    // if (this.selectedTaxBy) payload.tax_checked_by = this.selectedTaxBy;
    if (this.selectedBpkbNumber) payload.bpkb_number = this.selectedBpkbNumber;
    if (this.selectedBpkbNumber) payload.bpkb_number = "-";
    // if (this.selectedBpkbName) payload.bpkb_name = this.selectedBpkbName;
    if (this.selectedBpkbName) payload.bpkb_name = "-";
    if (this.selectedBpkbStatus) payload.bpkb = "-";
    // if (this.selectedBpkbStatus) payload.bpkb = this.selectedBpkbStatus;
    // if (this.selectedSph) payload.sph = this.selectedSph;
    // if (this.selectedKwt) payload.kwt = this.selectedKwt;
    // if (this.selectedForma) payload.form_a = this.selectedForma;
    // if (this.selectedFaktur) payload.faktur = this.selectedFaktur;
    if (this.selectedSph) payload.sph = "-";
    if (this.selectedKwt) payload.kwt = "-";
    if (this.selectedForma) payload.form_a = "-";
    if (this.selectedFaktur) payload.faktur = "-";
    if (this.selectedLimitPrice) payload.base_price = 0;
    // if (this.selectedLimitPrice) payload.base_price = this.selectedLimitPrice;
    // if (this.selectedExamPrice) payload.exam_price = this.selectedExamPrice;
    if (this.selectedExamPrice) payload.exam_price = 0;
    if (this.selectedBrand) payload.brand = this.selectedBrand;
    if (this.selectedBranch) payload.variant_model = this.selectedVariant;
    if (this.selectedVehicType) payload.unit_type = this.selectedVehicType;
    if (this.selectedUcat) payload.unit_category = this.selectedUcat;
    if (this.selectedColor) payload.color = this.selectedColor;
    if (this.selectedKeur === 'Ada') {
      if (this.keurDateString) {
        const parts = this.keurDateString.split('-');
        payload.keur = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    } else if (this.selectedKeur === 'Tidak Ada') {
      payload.keur = 'T/A';
    }
    if (this.selectedVariant) payload.variant_model = this.selectedVariant;
    if (this.selectedNotes) payload.notes = this.selectedNotes;

    if (this.selectedPicSender) payload.pic_sender = this.selectedPicSender.toUpperCase();
    if (this.selectedLokasiUnit) payload.unit_location = this.selectedLokasiUnit.toUpperCase();
    if (this.selectedPicPhoneSender) payload.pic_phone = this.selectedPicPhoneSender.toUpperCase();



    
    this.payloadUnit = payload;
    localStorage.setItem('mobilizationUnitNew', JSON.stringify(this.payloadUnit));
  }


  onBrandChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const brandId = selectedOption.getAttribute('data-brand-id');
    // Panggil fungsi showVariant dengan brandId yang dipilih
    this.showVariant(brandId);
    this.selectedBrand = brandId;
    this.savePayloadUnit();
    this.selectedVariantName = '';
  }

  onVariantChange(event : any) {
    // const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    // const brandId = selectedOption.getAttribute('data-id');
    // Panggil fungsi showVariant dengan brandId yang dipilih
    // this.selectedVariant = brandId;
    this.selectedVariant = this.selectedVariantId;
    this.savePayloadUnit();
  }

  onLokasiUnitChange(event : any) {
    const inputValue = event.target.value;
    this.selectedLokasiUnit = inputValue;
    this.savePayloadUnit();
  }

  onSenderChange(event : any) {
    const inputValue = event.target.value;
    this.selectedPicSender = inputValue;
    this.savePayloadUnit();
  }

  onPicPhoneChange(event : any) {
    const inputValue = event.target.value;
    this.selectedPicPhoneSender = inputValue;
    this.savePayloadUnit();
  }


  onExpeditionChange(event : any) {
    const selectedOption = event.target.selectedOptions; 
    this.selectedExpedition = selectedOption[0].value;
    this.savePayloadUnit();
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
          console.log(this.sampleData?.variant_model?.model_name)
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

  async showBranch() {

    this.errlog = "";
    try {
      const endpoint = `/branch`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<NewApiBranchResponse>(endpoint);
      if (response) {
        this.branches = response;
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

  async showUnitCategory() {

    this.errlog = "";
    try {
      const endpoint = `/unit-category`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiUnitCategoryResponse>(endpoint);
      if (response) {
        this.unitcategory = response;
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


  onColorChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const colorId = selectedOption.getAttribute('color-id');
    this.selectedColor = colorId;
    this.savePayloadUnit();
  }

  onTransmissionChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const transmission = selectedOption.getAttribute('transmission-id');
    this.selectedTransmission = transmission;
    this.savePayloadUnit();
  }

  onFuelChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const fuel = selectedOption.getAttribute('fuel-id');
    this.selectedFuel = fuel;
    this.savePayloadUnit();
  }

  onCheckedTaxBy(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const fuel = selectedOption.getAttribute('tax-checkedby-id');
    this.selectedTaxBy = fuel;
    this.savePayloadUnit();
  }

  onCheckedStnk(event : any) {
    // Langsung ambil value dari event atau dari this.selectedStnk yang sudah di-bind ngModel
    this.selectedStnk = event.target.value || this.selectedStnk;
    
    // Kosongkan stnkDateString jika pilihan "Tidak Ada"
    if (this.selectedStnk === 'Tidak Ada') {
      this.stnkDateString = '';
    }
    
    this.savePayloadUnit();
  }

  onCheckedKeur(event : any) {
    // Langsung ambil value dari event atau dari this.selectedKeur yang sudah di-bind ngModel
    this.selectedKeur = event.target.value || this.selectedKeur;
    
    // Kosongkan keurDateString jika pilihan "Tidak Ada"
    if (this.selectedKeur === 'Tidak Ada') {
      this.keurDateString = '';
    }
    
    this.savePayloadUnit();
  }

  onCheckedSph(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const fuel = selectedOption.getAttribute('sph-id');
    this.selectedSph = fuel;
    this.savePayloadUnit();
  }

  onCheckedKwt(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const fuel = selectedOption.getAttribute('kwt-id');
    this.selectedKwt = fuel;
    this.savePayloadUnit();
  }

  onCheckedForma(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const fuel = selectedOption.getAttribute('forma-id');
    this.selectedForma = fuel;
    this.savePayloadUnit();
  }

  onCheckedFaktur(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const fuel = selectedOption.getAttribute('faktur-id');
    this.selectedFaktur = fuel;
    this.savePayloadUnit();
  }

  onBranchChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const branchId = selectedOption.getAttribute('branch-id');
    this.selectedBranch = branchId;
    this.savePayloadUnit();
   }

  onBpkbChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const bpkb = selectedOption.getAttribute('bpkb-id');
    this.selectedBpkb = bpkb;
    this.selectedBpkbStatus = bpkb ? bpkb : '';
    this.savePayloadUnit();
    // Panggil fungsi showVariant dengan brandId yang dipilih
    // this.showVariant(colorId);
  } 


  onVehicTypeChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const dataName = selectedOption.getAttribute('data-name');
    const dataId = selectedOption.getAttribute('data-id');

    // this.selectedVehicType = dataName;
    this.selectedVehicType = dataId;
    this.savePayloadUnit();
    // Panggil fungsi showVariant dengan brandId yang dipilih
    // this.showVariant(colorId);
  }




  formatNumber(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    return new Intl.NumberFormat('id-ID').format(value);
  }

  onNumberInputOld(event: any) {
    const rawValue = event.target.value.replace(/\D/g, ''); // hapus semua non-digit
    this.selectedOdo = rawValue ? parseInt(rawValue, 10) : null;
    event.target.value = this.formatNumber(this.selectedOdo);
    this.savePayloadUnit();
}

onNumberInput(event: Event, fieldName: keyof this) {
  const input = event.target as HTMLInputElement;

  // Simpan posisi kursor sebelum format
  const selectionStart = input.selectionStart ?? input.value.length;

  // Ambil raw value
  const rawValue = input.value.replace(/\D/g, '');
  const numericValue = rawValue ? parseInt(rawValue, 10) : null;

  // Simpan ke property yang sesuai (gunakan index signature)
  (this as any)[fieldName] = numericValue;

  // Format ulang value untuk ditampilkan
  const formattedValue = this.formatNumber(numericValue);
  input.value = formattedValue;

  // Hitung pergeseran kursor
  const diff = formattedValue.length - rawValue.length;
  const newCursorPos = selectionStart + diff;

  // Restore posisi kursor
  setTimeout(() => {
    input.setSelectionRange(newCursorPos, newCursorPos);
  });

  this.savePayloadUnit();
}

  onAlphanumericInput(event: Event, fieldName: keyof this) {
    const input = event.target as HTMLInputElement;
    
    // Hapus semua karakter selain huruf dan angka, lalu uppercase
    let value = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Simpan ke property yang sesuai
    (this as any)[fieldName] = value;
    
    // Update input value
    input.value = value;
  }

  onLicensePlateInput(event: any, part: number, nextInput: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (part === 1) {
      // Part 1: Hanya huruf, max 2 karakter
      value = value.replace(/[^A-Za-z]/g, '').toUpperCase();
      this.licensePlatePart1 = value;
      input.value = value;
      
      // Auto-jump jika sudah 2 huruf
      if (value.length === 2 && nextInput) {
        nextInput.focus();
      }
    } else if (part === 2) {
      // Part 2: Hanya angka, max 4 karakter
      value = value.replace(/[^0-9]/g, '');
      this.licensePlatePart2 = value;
      input.value = value;
      
      // Auto-jump jika sudah 4 angka
      if (value.length === 4 && nextInput) {
        nextInput.focus();
      }
    } else if (part === 3) {
      // Part 3: Hanya huruf, max 3 karakter
      value = value.replace(/[^A-Za-z]/g, '').toUpperCase();
      this.licensePlatePart3 = value;
      input.value = value;
    }

    // Update selectedLicensePlate dengan format lengkap
    this.selectedLicensePlate = `${this.licensePlatePart1} ${this.licensePlatePart2} ${this.licensePlatePart3}`.trim();
    this.savePayloadUnit();
  }

  onChangeTextInput(event : any, num: number) {
    const inputValue = event.target.value; // Ambil nilai dari input text
    if(num==1){
      this.selectedLocation = inputValue;
    }else if(num==2){
      this.selectedOdo = inputValue;
    }else if(num==3){
      this.selectedNoka = inputValue;
    }else if(num==4){
      this.selectedNosin = inputValue;
    }else if(num==5){
      this.selectedTaxNoticeDate = inputValue;
    }else if(num==6){
      this.selectedAssignmentNumber = inputValue;
    }else if(num==7){
      this.selectedBpkbStatus = 'TRIBIK';
    }else if(num==8){
      this.selectedBpkbStatus = 'VENDOR';
    }else if(num==9){
       this.selectedBpkbNumber = inputValue;
    }else if(num==10){
       this.selectedBpkbName = inputValue;
    }else if(num==11){
       this.keurDateString = inputValue;
    }else if(num==12){
       this.selectedLimitPrice = inputValue;
    }else if(num==13){
       this.selectedExamPrice = inputValue;
    }else if(num==14){
      // alert(num);
      // console.log(num);
       this.selectedLicensePlate = inputValue;
    }else if(num==15){
      //  this.selectedPicPool = inputValue;
       this.selectedPicSender = inputValue;
    }else if(num==16){
      //  this.selectedPicPoolPhone = inputValue;
       this.selectedPicSenderPhone = inputValue;
    }else if(num==17){
      this.selectedNotes = inputValue;
    }else if(num==18){
      this.stnkDateString = inputValue;
    }else{
      // this.selectedYear = inputValue;
      const input = event.target as HTMLInputElement;
        let value = input.value;
        value = value.replace(/\D/g, '');

      // Potong max 4 digit
      if (value.length > 4) {
        value = value.slice(0, 4);
      }

      // Validasi range jika sudah 4 digit
      // if (value.length === 4) {
      //   const yearNum = parseInt(value, 10);
      //   if (yearNum < 1970) value = '1970';
      //   if (yearNum > this.currentYear) value = this.currentYear.toString();
      // }

    // this.selectedYear = value;
    // input.value = this.selectedYear;

    }
    this.savePayloadUnit();
  }



  onChangeVendor(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const vendorId = selectedOption.getAttribute('data-id');
    this.selectedExpedition = vendorId;
    this.vendor_id = vendorId ? parseInt(vendorId) : null;
    this.savePayloadUnit();
    // this.infoVendor(this.vendor_id);

    // Panggil fungsi showVariant dengan brandId yang dipilih
    // this.showVariant(colorId);
  }

  async infoVendor(id: number) {
  
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/vendor-detail?vendor_id=${id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<VendorDetailResponse>(endpoint);
      console.log('Data posted:', response);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.id) {
        this.sampleDataVendor = response;  
        console.log('Sample Data Vendor:', this.sampleDataVendor);
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


  onChipSelected(index: number) {
    this.expandedPanelIndex = index; // Set index panel yang diperluas
  }



}

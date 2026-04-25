import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand, UnitDocument  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { BalaiLelangResponse } from '../../assets/models/list-location.model';
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
import { CarModelResponse } from 'src/assets/models/list-brand-revised-model';
declare var $: any;


@Component({
  selector: 'app-the-detil-tugas',
  templateUrl: './the-detil-tugas.component.html',
  styleUrls: ['./the-detil-tugas.component.scss']
})
export class TheDetilTugasComponent implements OnInit, AfterViewInit, OnDestroy {
  // isExpanded: boolean = true;
  expandedPanelIndex: number = 0; // Menyimpan index panel yang diperluas
  @Output() panelChange = new EventEmitter<string>();
  errlog:string = '';
  sampleData: UnitDetailResponse | null = null;
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
  ktpDocuments: UnitDocument[] = [];
  bpkbDocuments: UnitDocument[] = [];
  stnkDocuments: UnitDocument[] = [];
  suratKuasaDocuments: UnitDocument[] = [];
  bastkVendorDocuments: UnitDocument[] = [];
  lainnyaDocuments: UnitDocument[] = [];
  display_name: string = '';
  keyword: string = '';
  brands: ApiBrandResponse | null = null
  // variants: ApiVariantResponse | null = null
  variants: CarModelResponse | null = null
  colors: ApiColorResponse | null = null
  vehicletype: ApiVehicleTypeResponse | null = null
  selectedExpedition: string = '';
  selectedVariant: string = '';
  selectedColor: string = '';
  selectedVehicType: string = '';
  selectedBrand: string = '';
  selectedLocation: string = '';
  selectedOdo: string = '';
  selectedNoka: string = '';
  selectedNotes: string = '';
  selectedNosin: string = '';
  selectedAssignmentDate: string = '';
  selectedAssignmentNumber: string = '';
  selectedBpkbStatus: string = '';
  selectedTransmission: string = '';
  selectedYear: string = '';
  modelname: any = '';
  payloadUnit: any = null;
  variant_model_id: string = '';
  brandid:any = '';
  isTipeModalOpen = false;
  isBrandModalOpen = false;
  selectedVariantName = '';
  selectedVariantId: string = '';
  selectedBrandName: string = '';
  selectedBrandId: string = '';
  bastk_status: string = '';
  notes: string = '';
  assignment_number: string = '';
  selectedKeur: string = '';
  keur_notice: any = null;
  tax_notice: any = null;
  selectedKeurStatus: string = 'Tidak Ada';
  keurDateString: string = '';
  selectedStnkStatus: string = 'Tidak Ada';
  stnkDateString: string = '';
  selectedPicSender: string = '';
  selectedLicensePlate: string = '';
  licensePlatePart1: string = '';
  licensePlatePart2: string = '';
  licensePlatePart3: string = '';

  choices: [string, string][] = [
  ['Drive', 'Drive'],
  ['Derek', 'Derek'],
  ['No', 'No']
];
  todayDateString: string = new Date().toISOString().split('T')[0];

  adaTidakOptions = [
    'Ada',
    'Tidak Ada'
  ];

transmissionOptions: [string, string][] = [
  ['MT', 'Manual'],
  ['AT', 'Automatic'],
  // ['CVT', 'CVT'],
  // ['EV', 'EV'],
  // ['Matic', 'Matic'],
  // ['Semi Automatic', 'Semi Automatic'],
  ['Tiptronic', 'Tiptronic']
  // ['AMT', 'AMT'],
  // ['Dual Clutch', 'Dual Clutch'],
  // ['Other', 'Other']
];
  selectedLokasiUnit: any;
  selectedPicPhoneSender: any;
  
  // MTF Vendor Detection & Select2 for Auction Houses
  isMandiriTunasFinance: boolean = false;
  auctionHouses: string[] = [];
  @ViewChild('auctionHouseSelect') auctionHouseSelect!: ElementRef;
  HiLocation: string | undefined;
  

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const infoVendorPanel = document.getElementById('infoVendorPanel');
    const infoKendaraanPanel = document.getElementById('infoKendaraanPanel');
    const infoLainnyaPanel = document.getElementById('infoLainnyaPanel');
    const infoDokumenPanel = document.getElementById('infoDokumenPanel');

    if (infoKendaraanPanel && this.isElementInViewport(infoKendaraanPanel)) {
      this.panelChange.emit('Info Kendaraan');
    } else if (infoVendorPanel && this.isElementInViewport(infoVendorPanel)) {
      this.panelChange.emit('Info Vendor');
    } else if (infoDokumenPanel && this.isElementInViewport(infoDokumenPanel)) {
      this.panelChange.emit('Dokumen dan Kelengkapan Lainnya');
    } else if (infoLainnyaPanel && this.isElementInViewport(infoLainnyaPanel)) {
      this.panelChange.emit('Keterangan Lainnya');
    }
  }

  openTipeModal() {
    this.isTipeModalOpen = true;
  }

  openBrandModal() {
    this.isBrandModalOpen = true;
  }

  onKeurChange(event : any) {
    const inputValue = event.target.value;
    this.keurDateString = inputValue;
    this.savePayloadUnit();
  }

  onStnkChange(event : any) {
    const inputValue = event.target.value;
    this.stnkDateString = inputValue;
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

  onCheckedKeur(event : any) {
    // Langsung ambil value dari event
    this.selectedKeurStatus = event.target.value;
    
    // Kosongkan keurDateString jika pilihan "Tidak Ada"
    if (this.selectedKeurStatus === 'Tidak Ada') {
      this.keurDateString = '';
    }
    
    this.savePayloadUnit();
    
  }

  onCheckedStnk(event : any) {
    // Langsung ambil value dari event
    this.selectedStnkStatus = event.target.value;
    
    // Kosongkan stnkDateString jika pilihan "Tidak Ada"
    if (this.selectedStnkStatus === 'Tidak Ada') {
      this.stnkDateString = '';
    }
    
    this.savePayloadUnit();
    
  }

  onVariantSelected(variant: any) {
    this.selectedVariantName = variant.grouped_model_name || variant.variant_name;
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

  isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

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
  
  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private modalService: NgbModal) { }

  // ngAfterViewInit(): void {
  //   // Inisialisasi select2
  //   $('#tipeSelect2').select2({
  //     placeholder: 'Pilih Tipe',
  //     width: 'resolve'
  //   });

  //   // Handle event select2
  //   $('#tipeSelect2').on('change', (e: any) => {
  //     const selectedId = e.target.value;
  //     this.selectedVariant = selectedId;
  //     this.savePayloadUnit();
  //   });
  // }
  
  ngOnInit(): void {
    this.infoUnit();
    this.showColor();
    this.showVehicleType();
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
      unit_id: this.unit_id,
      bastk_status: this.bastk_status
    };
    if (this.selectedColor) payload.color_id = this.selectedColor.toUpperCase();
    if (this.selectedYear) payload.unit_year = this.selectedYear;
    if (this.selectedExpedition) payload.expedition = this.selectedExpedition.toUpperCase();
    if (this.selectedTransmission) payload.transmission = this.selectedTransmission;
    if (this.selectedVehicType) payload.unit_type_id = this.selectedVehicType;
    if (this.selectedBrand) payload.brand_id = this.selectedBrand;
    if (this.selectedVariant) payload.variant_model_id = this.selectedVariant;
    if (this.selectedOdo) payload.odo_meter = this.selectedOdo;
    if (this.selectedLocation) payload.unit_location = this.selectedLocation.toUpperCase();
    if (this.selectedNoka) payload.chassis_number = this.selectedNoka.toUpperCase();
    if (this.selectedNosin) payload.engine_number = this.selectedNosin.toUpperCase();
    if (this.selectedAssignmentDate) payload.assignment_date = this.selectedAssignmentDate;
    if (this.selectedAssignmentNumber) payload.assignment_number = this.selectedAssignmentNumber.toUpperCase();
    if (this.selectedBpkbStatus) payload.bpkb_status = this.selectedBpkbStatus.toUpperCase();
    if (this.selectedBpkbStatus) payload.bpkb_status = this.selectedBpkbStatus.toUpperCase();
    if (this.selectedPicSender) payload.pic_sender = this.selectedPicSender.toUpperCase();
    if (this.selectedLokasiUnit) payload.unit_location = this.selectedLokasiUnit.toUpperCase();
    if (this.selectedPicPhoneSender) payload.pic_sender_phone = this.selectedPicPhoneSender.toUpperCase();
    if (this.selectedLicensePlate) payload.police_number = this.selectedLicensePlate;
    if (this.selectedVariantName) payload.brand_model_name  = this.selectedVariantName;

    if (this.selectedKeurStatus === 'Ada') {
      payload.keur = this.selectedKeurStatus;
      if (this.keurDateString) {
        const parts = this.keurDateString.split('-');
        payload.keur_notice = `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
    } else if (this.selectedKeurStatus === 'Tidak Ada') {
      payload.keur = 'T/A';
      payload.keur_notice = '';
    }

    if (this.selectedStnkStatus === 'Ada') {
      payload.stnk_status = this.selectedStnkStatus;
      if (this.stnkDateString) {
        const parts = this.stnkDateString.split('-');
        payload.tax_notice = `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
    } else if (this.selectedStnkStatus === 'Tidak Ada') {
      payload.stnk_status = 'T/A';
      payload.tax_notice = '';
    }

    if (this.selectedNotes) payload.notes = this.selectedNotes.toUpperCase();


        // this.selectedKeur = this.sampleData.keur || 'T/A';
        // this.selectedKeurStatus = this.sampleData.keur === 'T/A' ? 'Tidak Ada' : 'Ada';
        
        // // Convert keur date dari dd-mm-yyyy ke yyyy-mm-dd untuk input date
        // if (this.selectedKeur && this.selectedKeur !== 'T/A') {
        //   const parts = this.selectedKeur.split('-');
        //   if (parts.length === 3) {
        //     this.keurDateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
        //   }
        // }

    this.payloadUnit = payload;
    console.log('Payload Unit:', this.payloadUnit);
    localStorage.setItem('payloadUnit_' + this.unit_id, JSON.stringify(this.payloadUnit));
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
      const endpoint = `/brands-model-only?brand_id=${brand_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<CarModelResponse>(endpoint);
      if (response) {
        this.variants = response;
        console.log('Variants:', this.variants);

        // Cek apakah sampleData?.variant_model?.id ada di results
        const variantId = this.sampleData?.variant_model?.id;
        const found = response.results.find((item: any) => item.id === variantId);

        if (found) {
          this.modelname = this.sampleData?.variant_model?.model_name ? this.sampleData.variant_model.model_name : '';
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


  onColorChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const colorId = selectedOption.getAttribute('color-id');
    this.selectedColor = colorId;
    this.savePayloadUnit();
    // Panggil fungsi showVariant dengan brandId yang dipilih
    // this.showVariant(colorId);
  }

  onTransmissionChange(event : any) {
    const selectedOption = event.target.selectedOptions[0]; // Ambil option yang dipilih
    const transmission = selectedOption.getAttribute('transmission-id');
    this.selectedTransmission = transmission;
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

  formatNumber(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    return new Intl.NumberFormat('id-ID').format(value);
  }

  onAlphanumericInput(event: any, fieldName: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^A-Za-z0-9\-\/\.\(\)\*\s]/g, '');
    value = value.toUpperCase();

    if (fieldName === 'noka') {
      this.selectedNoka = value;
    } else if (fieldName === 'nosin') {
      this.selectedNosin = value;
    }

    input.value = value;
    this.savePayloadUnit();
  }

  onLicensePlatePaste(event: ClipboardEvent) {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';
    const cleaned = pastedText.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const match = cleaned.match(/^([A-Z]{1,2})(\d{1,4})([A-Z]{0,3})$/);

    if (match) {
      this.licensePlatePart1 = match[1].substring(0, 2);
      this.licensePlatePart2 = match[2].substring(0, 4);
      this.licensePlatePart3 = match[3].substring(0, 3);
      this.selectedLicensePlate = `${this.licensePlatePart1} ${this.licensePlatePart2} ${this.licensePlatePart3}`.trim();
      this.savePayloadUnit();
    }
  }

  onLicensePlateInput(event: any, part: number, nextInput: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (part === 1) {
      value = value.replace(/[^A-Za-z]/g, '').toUpperCase();
      this.licensePlatePart1 = value;
      input.value = value;
      if (value.length === 2 && nextInput) {
        nextInput.focus();
      }
    } else if (part === 2) {
      value = value.replace(/[^0-9]/g, '');
      this.licensePlatePart2 = value;
      input.value = value;
      if (value.length === 4 && nextInput) {
        nextInput.focus();
      }
    } else if (part === 3) {
      value = value.replace(/[^A-Za-z]/g, '').toUpperCase();
      this.licensePlatePart3 = value;
      input.value = value;
    }

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
      this.selectedAssignmentDate = inputValue;
    }else if(num==6){
      this.selectedAssignmentNumber = inputValue;
    }else if(num==7){
      this.selectedBpkbStatus = 'TRIBIK';
    }else if(num==8){
      this.selectedBpkbStatus = 'VENDOR';
    }else if(num==9){
      this.selectedNotes = inputValue;
    }else{
      this.selectedYear = inputValue;
    }
    this.savePayloadUnit();
  }

  async infoUnit() {
  this.HiLocation = localStorage.getItem('branch') || 'Branch';
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/detail-unit?unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<UnitDetailResponse>(endpoint);
      // console.log('Data posted:', response.vendor.id);
      this.unit_id = unit_id;

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.vendor.id) {
        this.sampleData = response;  

        if (this.sampleData?.police_number) {
          const cleaned = this.sampleData.police_number.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
          const match = cleaned.match(/^([A-Z]{1,2})(\d{1,4})([A-Z]{0,3})$/);
          if (match) {
            this.licensePlatePart1 = match[1].substring(0, 2);
            this.licensePlatePart2 = match[2].substring(0, 4);
            this.licensePlatePart3 = match[3].substring(0, 3);
            this.selectedLicensePlate = `${this.licensePlatePart1} ${this.licensePlatePart2} ${this.licensePlatePart3}`.trim();
          } else {
            this.selectedLicensePlate = this.sampleData.police_number;
          }
        }

        // console.log('Sample Data:', this.sampleData);
        // console.log('Unit Doc:', this.sampleData.unitdocuments);
        this.unitdocuments = this.sampleData.unitdocuments;
        this.display_name = this.sampleData.display_name;
        // this.bpkbDocuments: UnitDocument[] = this.unitdocuments.filter((document: UnitDocument) => document.file_type === 'BPKB');
        this.bpkbDocuments = this.unitdocuments.filter(doc => doc.file_type === 'BPKB');
        this.bastkVendorDocuments = this.unitdocuments.filter(doc => doc.file_type === 'BASTK');
        this.stnkDocuments = this.unitdocuments.filter(doc => doc.file_type === 'STNK');

        // Load STNK status dari stnk_status dan tanggal dari tax_notice
        const stnkValue = this.sampleData.stnk_status || 'T/A';
        this.selectedStnkStatus = stnkValue === 'T/A' ? 'Tidak Ada' : 'Ada';

        // Normalize STNK date ke yyyy-mm-dd untuk input date
        if (stnkValue && stnkValue !== 'T/A' && this.sampleData.tax_notice) {
          this.stnkDateString = this.normalizeDateForInput(this.sampleData.tax_notice);
          console.log('stnkDateString loaded:', this.stnkDateString);
        } else {
          this.stnkDateString = '';
        }

        this.infoVendor(this.sampleData.vendor.id);
        this.brandid = this.sampleData.brand.id;
        this.showBrand();




        let tgl_mobilisasi = '';
        if (this.sampleData.mobilization_unit && this.sampleData.mobilization_unit.length > 0 && this.sampleData.mobilization_unit[0].mobilization) {
          this.pic = this.sampleData.mobilization_unit[0].mobilization.pic;
          tgl_mobilisasi = this.sampleData.mobilization_unit[0].mobilization.assignment_date;
        } else {
          this.pic = '';
          const today = new Date();
          tgl_mobilisasi = today.toISOString().substring(0, 10);
        }
        console.log('pic tgl_mobilisasi:', this.tgl_mobilisasi);
        this.tgl_mobilisasi = (tgl_mobilisasi && tgl_mobilisasi.trim() !== '') 
          ? tgl_mobilisasi.substring(0, 10) 
          : new Date().toISOString().substring(0, 10); 
        
        // Format khusus untuk KTP dengan struktur lengkap
        this.ktpDocuments = this.sampleData.idcardsender_url ? [{
          id: 1,
          file_type: 'KTP',
          image_url: this.sampleData.idcardsender_url
        } as UnitDocument] : [];
        
        this.suratKuasaDocuments = this.unitdocuments.filter(doc => doc.file_type === 'SURATKUASA');
        this.lainnyaDocuments = this.unitdocuments.filter(doc => doc.file_type === 'LAINNYA');
        this.modelname = this.sampleData.variant_model.model_name ? this.sampleData.variant_model.model_name : '';
        this.selectedVariantName = this.modelname ;
        this.selectedBrandName = this.sampleData.brand.brand_name;
        this.selectedBpkbStatus = this.sampleData.bpkb_status || 'TRIBIK';
        // this.selectedVariantName = this.modelname + "-" +  this.sampleData.variant_model.variant_name;
        // console.log('bpkbDocuments:', this.bpkbDocuments);
        this.bastk_status = this.sampleData.bastk_status;
        this.notes = this.sampleData.notes || '';
        this.selectedKeur = this.sampleData.keur || 'T/A';
        this.keur_notice = this.sampleData.keur_notice;
        this.tax_notice = this.sampleData.tax_notice;
        this.selectedKeurStatus = this.sampleData.keur === 'T/A' ? 'Tidak Ada' : 'Ada';
        this.pic = this.sampleData.pic_sender || '';
        this.selectedLokasiUnit = this.sampleData.lokasi_unit || '';



        this.selectedNotes = this.sampleData.notes || '';
        
        // Normalize KEUR date ke yyyy-mm-dd untuk input date
        if (this.selectedKeur && this.selectedKeur !== 'T/A' && this.keur_notice) {
          this.keurDateString = this.normalizeDateForInput(this.keur_notice);
        }
        

        
        // Perbaiki: mobilization_unit bukan mobilization_units
        if (this.sampleData.mobilization_unit && this.sampleData.mobilization_unit.length > 0 && this.sampleData.mobilization_unit[0].mobilization) {
          // console.log('assignment_number:', this.sampleData.mobilization_unit[0].mobilization.assignment_number);
          this.assignment_number = this.sampleData.mobilization_unit[0].mobilization.assignment_number;
        }

        this.savePayloadUnit();

       
        // console.log('mobilization:', this.sampleData.mobilization_units[0].mobilization.first_published_at);
        // console.log('tgl_mobilisasi:', this.tgl_mobilisasi);
       

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
        
        // Check if vendor is MANDIRI TUNAS FINANCE
        const vendorNameUpper = (this.sampleDataVendor.vendor_name || '').toUpperCase();
        if (vendorNameUpper.includes('MANDIRI TUNAS FINANCE')) {
          this.isMandiriTunasFinance = true;
          this.loadAuctionHouses();
          // Initialize Select2 after data is loaded
          setTimeout(() => this.initializeSelect2(), 200);
        } else {
          // Reset if not MTF
          this.isMandiriTunasFinance = false;
          this.auctionHouses = [];
          this.selectedLokasiUnit = '';
          // Destroy Select2 if it was previously initialized
          if (typeof $ !== 'undefined' && this.auctionHouseSelect) {
            const selectElement = $(this.auctionHouseSelect.nativeElement);
            if (selectElement.data('select2')) {
              selectElement.select2('destroy');
            }
          }
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

  // Load auction houses from API
  async loadAuctionHouses(): Promise<void> {
    try {
      const endpoint = `/location-tribik`;
      const response = await this.apiClient.getOther<BalaiLelangResponse>(endpoint);
      if (response && response.results) {
        this.auctionHouses = response.results;
        console.log('Auction houses loaded:', this.auctionHouses.length);
        
        // Check if current unit_location exists in the auction houses and set as default
        const currentLocation = this.sampleData?.unit_location;
        if (currentLocation && this.auctionHouses.includes(currentLocation)) {
          this.selectedLokasiUnit = currentLocation;
          console.log('Pre-selected location:', currentLocation);
        }
      }
    } catch (error) {
      console.error('Error loading auction houses:', error);
    }
  }

  // Initialize Select2 dropdown
  initializeSelect2(): void {
    if (typeof $ === 'undefined') {
      console.error('jQuery is not loaded');
      return;
    }

    if (!this.auctionHouseSelect) {
      console.error('Auction house select element not found');
      return;
    }

    const selectElement = $(this.auctionHouseSelect.nativeElement);
    
    // Initialize Select2
    selectElement.select2({
      placeholder: 'Pilih atau cari lokasi Balai Lelang',
      allowClear: true,
      width: '100%'
    });

    // Update model when selection changes
    selectElement.on('change', (e: any) => {
      this.selectedLokasiUnit = e.target.value;
      this.onLokasiUnitChange({ target: { value: e.target.value } });
    });
  }

  ngAfterViewInit(): void {
    // Initialize Select2 after view is initialized if MTF vendor is detected
    if (this.isMandiriTunasFinance && this.auctionHouseSelect) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        this.initializeSelect2();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    // Clean up Select2 instance
    if (typeof $ !== 'undefined' && this.auctionHouseSelect) {
      const selectElement = $(this.auctionHouseSelect.nativeElement);
      if (selectElement.data('select2')) {
        selectElement.select2('destroy');
      }
    }
  }


  onChipSelected(index: number) {
    this.expandedPanelIndex = index; // Set index panel yang diperluas
  }

  async openGallery(a:string) {

    try{
      this.infoUnit();

          const modalRef = this.modalService.open(ImageGalleryModalComponent, { size: 'lg' });
          modalRef.componentInstance.carName = this.display_name;
          modalRef.componentInstance.unitId = this.unit_id;
          modalRef.componentInstance.tipeDoc = a;
          if(a=='BPKB'){
            modalRef.componentInstance.images = this.bpkbDocuments;
          }else if(a=='STNK'){
            modalRef.componentInstance.images = this.stnkDocuments;
          }else if(a=='SURATKUASA'){
            modalRef.componentInstance.images = this.suratKuasaDocuments;
          }else if(a=='BASTK'){
            modalRef.componentInstance.images = this.bastkVendorDocuments;
          }else if(a=='KTP'){
            modalRef.componentInstance.images = this.ktpDocuments;
          }else{
            modalRef.componentInstance.images = this.lainnyaDocuments;
          }
          
          // Refresh data setelah modal ditutup
          modalRef.result.then(
            (result) => {
              // Modal ditutup dengan result (misalnya setelah upload sukses)
              this.infoUnit();
            },
            (reason) => {
              // Modal ditutup dengan dismiss (klik X atau klik di luar)
              this.infoUnit();
            }
          );
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
    
    // modalRef.componentInstance.images = [
    //   'https://cdn.motor1.com/images/mgl/02EE3/s1/4x3/toyota-fortuner-gr-sport-indonesia.webp',
    //   'https://cdnmedia.insureka.co.id/images/Toyota_Fortuner_2023.width-800.jpg',
    //   'https://mediaindonesia.gumlet.io/news/2024/09/06/1725624407_f356aec8fa70ed94c237.jpeg?w=376&dpr=2.6',
    //   'https://assets.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p3/83/2024/09/11/Toyota-Fortuner-4x4-GR-S-3698456571.jpg',
    //   'https://imgcdnblog.carvaganza.com/wp-content/uploads/2020/06/Toyota-Fortuner-Facelift-2020-9.jpg',
    //   'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark.png,5,5,60)/photo/2023/08/01/whatsapp-image-2023-08-01-at-01-20230801013700.jpeg'
    // ];
}


}

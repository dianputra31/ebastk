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
declare var $: any;


@Component({
  selector: 'app-the-detil-terjadwal',
  templateUrl: './the-detil-terjadwal.component.html',
  styleUrls: ['./the-detil-terjadwal.component.scss']
})
export class TheDetilTerjadwalComponent implements OnInit {
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
  selectedExpedition: string = '';
  selectedVariant: string = '';
  selectedColor: string = '';
  selectedVehicType: string = '';
  selectedBrand: string = '';
  selectedUcat: string = '';
  selectedLocation: string = '';
  selectedOdo: number | null = null;
  selectedNoka: string = '';
  selectedNosin: string = '';
  selectedAssignmentDate: string = '';
  selectedAssignmentNumber: string = '';
  selectedBpkbStatus: string = '';
  selectedTransmission: string = '';
  selectedYear: string = '';
  currentYear = new Date().getFullYear();
  modelname: any = '';
  payloadUnit: any = null;
  variant_model_id: string = '';
  brandid:any = '';
  isTipeModalOpen = false;
  isBrandModalOpen = false;
  isUcatModalOpen = false;
  selectedVariantName = '';
  selectedVariantId: string = '';
  selectedBrandName: string = '';
  selectedUcatName: string = '';
  selectedBrandId: string = '';
  selectedUcatId: string = '';
  bastk_status: string = '';
  objectKeys = Object.keys;


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

  openUnitCategory() {
    this.isUcatModalOpen = true;
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

  onUcatSelected(brand: any) {
    this.selectedUcatName = brand.category_name;
    this.selectedUcatId = brand.id;
    // lakukan logic lain, misal set ke form, dsb
    this.selectedUcat = this.selectedUcatId;
    this.showVariant(brand.id);
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
    // const response = {
    //   unit_data: {
    //     "NOPOL": "B 1234 XYZ",
    //     "Nama": "Daihatsu Gran Max",
    //     "Jenis": "Pick Up",
    //     "Warna": "Silver",
    //     "Tahun": "2022",
    //     "No Rangka": "MHKA1234567890123",
    //     "No Mesin": "3SZ1234567",
    //     "PIC": "Dian Setiawan",
    //     "No Telp PIC": "081234567890",
    //     "Lokasi": "Autotranz Kelapa Gading",
    //     "Tanggal Masuk": "2025-09-10",
    //     "Status": "TERJADWAL",
    //     "Keterangan": "Unit baru, siap mobilisasi",
    //     "Vendor": "PT Trans Armada Indonesia",
    //     "Alamat Vendor": "Gading Kirana Block F10 No.1",
    //     "Kota Vendor": "Jakarta Utara",
    //     "Provinsi Vendor": "DKI Jakarta",
    //     "Kode Pos": "14240",
    //     "Email Vendor": "vendor@example.com",
    //     "Nama Sopir": "Samsul Bahri",
    //     "No Telp Sopir": "082134567891",
    //     "SIM Sopir": "B1234567XYZ",
    //     "Jenis SIM": "B1",
    //     "Tanggal Exp SIM": "2027-01-01",
    //     "Asuransi": "Allianz",
    //     "No Polis": "POL123456789",
    //     "Tanggal Exp Asuransi": "2026-12-31",
    //     "Jenis Bahan Bakar": "Bensin",
    //     "Kapasitas Mesin": "1300cc",
    //     "Transmisi": "Manual",
    //     "Jumlah Kursi": "2",
    //     "Panjang Unit": "4200mm",
    //     "Lebar Unit": "1650mm",
    //     "Tinggi Unit": "1900mm",
    //     "Berat Kosong": "1100kg",
    //     "Daya Angkut": "700kg",
    //     "Keterangan Tambahan": "Unit dilengkapi dengan AC",
    //     "Tanggal Service Terakhir": "2025-07-15",
    //     "Kilometer Sekarang": "15000 km",
    //     "Kilometer Service Berikut": "20000 km",
    //     "No GPS": "GPS-998877",
    //     "IMEI Tracker": "357896045612345",
    //     "Status GPS": "Aktif",
    //     "Tanggal Aktivasi GPS": "2024-10-01",
    //     "Masa Berlaku STNK": "2026-09-10",
    //     "Masa Berlaku KIR": "2025-12-31",
    //     "Masa Berlaku Pajak": "2026-09-10",
    //     "No BPKB": "BPKB1234567890",
    //     "Nama Pemilik": "PT Autotranz Indonesia",
    //     "Alamat Pemilik": "Jl. Raya Kelapa Gading No. 123",
    //     "No Telp Pemilik": "0211234567",
    //     "Email Pemilik": "owner@example.com",
    //     "Tanggal Dibeli": "2022-02-01",
    //     "Harga Beli": "150.000.000",
    //     "Depresiasi per Tahun": "10%",
    //     "Nilai Sekarang": "120.000.000"
    //   }
    // };

    // this.sampleDataUnitMobilisasi = response.unit_data;

    this.infoUnitTerjadwal();
    // this.infoUnit();
    this.showColor();
    this.showVehicleType();
    this.showUnitCategory();
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
    if (this.selectedColor) payload.color_id = this.selectedColor;
    if (this.selectedYear) payload.unit_year = this.selectedYear;
    if (this.selectedExpedition) payload.expedition = this.selectedExpedition;
    if (this.selectedTransmission) payload.transmission = this.selectedTransmission;
    if (this.selectedVehicType) payload.unit_type_id = this.selectedVehicType;
    if (this.selectedBrand) payload.brand_id = this.selectedBrand;
    if (this.selectedVariant) payload.variant_model_id = this.selectedVariant;
    if (this.selectedOdo) payload.odo_meter = this.selectedOdo;
    if (this.selectedLocation) payload.unit_location = this.selectedLocation;
    if (this.selectedNoka) payload.chassis_number = this.selectedNoka;
    if (this.selectedNosin) payload.engine_number = this.selectedNosin;
    if (this.selectedAssignmentDate) payload.assignment_date = this.selectedAssignmentDate;
    if (this.selectedAssignmentNumber) payload.assignment_number = this.selectedAssignmentNumber;
    if (this.selectedBpkbStatus) payload.bpkb_status = this.selectedBpkbStatus;

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


  formatNumber(value: any): string {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('id-ID').format(value);
  }

  onNumberInput(event: any) {
    const rawValue = event.target.value.replace(/\D/g, ''); // hapus semua non-digit
    this.selectedOdo = rawValue ? parseInt(rawValue, 10) : null;
    event.target.value = this.formatNumber(this.selectedOdo);
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
      if (value.length === 4) {
        const yearNum = parseInt(value, 10);
        if (yearNum < 1970) value = '1970';
        if (yearNum > this.currentYear) value = this.currentYear.toString();
      }

    this.selectedYear = value;
    input.value = this.selectedYear;

    }
    this.savePayloadUnit();
  }



  async infoUnitTerjadwal() {
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/info-mobilisasi-unit?mobilization_unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.get<MobilisasiUnit>(endpoint);
      this.unit_id = unit_id;

      // Jika login berhasil, simpan data ke localStorage
      if (response) {
        this.sampleDataMobilisasi = response;  
        this.sampleDataUnitMobilisasi = response.unit_data;  
        console.log('Sample Data Mobilisasi:', this.sampleDataMobilisasi);
        console.log('Sample Data Unit Mobilisasi:', this.sampleDataUnitMobilisasi);


        this.savePayloadUnit();

        let tgl_mobilisasi = '';

        // this.infoVendor(response.vendor.id);
        this.showBrand();

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

  async infoUnit() {
  
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/detail-unit?unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<UnitDetailResponse>(endpoint);
      console.log('Data posted:', response.vendor.id);
      this.unit_id = unit_id;

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.vendor.id) {
        this.sampleData = response;  
        console.log('Sample Data:', this.sampleData);
        console.log('Unit Doc:', this.sampleData.unitdocuments);
        this.unitdocuments = this.sampleData.unitdocuments;
        this.display_name = this.sampleData.display_name;
        // this.bpkbDocuments: UnitDocument[] = this.unitdocuments.filter((document: UnitDocument) => document.file_type === 'BPKB');
        this.bpkbDocuments = this.unitdocuments.filter(doc => doc.file_type === 'BPKB');
        this.bastkVendorDocuments = this.unitdocuments.filter(doc => doc.file_type === 'BASTK');
        this.stnkDocuments = this.unitdocuments.filter(doc => doc.file_type === 'STNK');
        this.suratKuasaDocuments = this.unitdocuments.filter(doc => doc.file_type === 'SURATKUASA');
        this.lainnyaDocuments = this.unitdocuments.filter(doc => doc.file_type === 'LAINNYA');
        this.modelname = this.sampleData.variant_model.model_name;
        this.selectedVariantName = this.modelname ;
        this.selectedBrandName = this.sampleData.brand.brand_name;
        this.selectedBpkbStatus = this.sampleData.bpkb_status || 'TRIBIK';
        // this.selectedVariantName = this.modelname + "-" +  this.sampleData.variant_model.variant_name;
        console.log('bpkbDocuments:', this.bpkbDocuments);
        this.bastk_status = this.sampleData.bastk_status;

        this.savePayloadUnit();

        let tgl_mobilisasi = '';
        if (this.sampleData.mobilization_units && this.sampleData.mobilization_units.length > 0 && this.sampleData.mobilization_units[0].mobiliztion) {
          this.pic = this.sampleData.mobilization_units[0].mobiliztion.pic;
          tgl_mobilisasi = this.sampleData.mobilization_units[0].mobiliztion.assignment_date;
        } else {
          this.pic = '';
          const today = new Date();
          tgl_mobilisasi = today.toISOString().substring(0, 10);
        }
        this.tgl_mobilisasi = tgl_mobilisasi.substring(0, 10);
        // console.log('mobiliztion:', this.sampleData.mobilization_units[0].mobiliztion.first_published_at);
        // console.log('tgl_mobilisasi:', this.tgl_mobilisasi);
        this.infoVendor(response.vendor.id);
        this.brandid = this.sampleData.brand.id;
        this.showBrand();

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
          }else{
            modalRef.componentInstance.images = this.lainnyaDocuments;
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

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
declare var $: any;


@Component({
  selector: 'app-the-detil-tugas',
  templateUrl: './the-detil-tugas.component.html',
  styleUrls: ['./the-detil-tugas.component.scss']
})
export class TheDetilTugasComponent implements OnInit {
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
  selectedKeurStatus: string = 'Tidak Ada';
  keurDateString: string = '';
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

  onKeurChange(event : any) {
    const inputValue = event.target.value;
    this.keurDateString = inputValue;
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

    if (this.selectedKeurStatus === 'Ada') {
      if (this.keurDateString) {
        const parts = this.keurDateString.split('-');
        payload.keur = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    } else if (this.selectedKeurStatus === 'Tidak Ada') {
      payload.keur = 'T/A';
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
        // console.log('Sample Data:', this.sampleData);
        // console.log('Unit Doc:', this.sampleData.unitdocuments);
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
        // console.log('bpkbDocuments:', this.bpkbDocuments);
        this.bastk_status = this.sampleData.bastk_status;
        this.notes = this.sampleData.notes || '';
        this.selectedKeur = this.sampleData.keur || 'T/A';
        this.selectedKeurStatus = this.sampleData.keur === 'T/A' ? 'Tidak Ada' : 'Ada';

        this.selectedNotes = this.sampleData.notes || '';
        
        // Convert keur date dari dd-mm-yyyy ke yyyy-mm-dd untuk input date
        if (this.selectedKeur && this.selectedKeur !== 'T/A') {
          const parts = this.selectedKeur.split('-');
          if (parts.length === 3) {
            this.keurDateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
        
        // Perbaiki: mobilization_unit bukan mobilization_units
        if (this.sampleData.mobilization_unit && this.sampleData.mobilization_unit.length > 0 && this.sampleData.mobilization_unit[0].mobilization) {
          // console.log('assignment_number:', this.sampleData.mobilization_unit[0].mobilization.assignment_number);
          this.assignment_number = this.sampleData.mobilization_unit[0].mobilization.assignment_number;
        }

        this.savePayloadUnit();

        let tgl_mobilisasi = '';
        if (this.sampleData.mobilization_unit && this.sampleData.mobilization_unit.length > 0 && this.sampleData.mobilization_unit[0].mobilization) {
          this.pic = this.sampleData.mobilization_unit[0].mobilization.pic;
          tgl_mobilisasi = this.sampleData.mobilization_unit[0].mobilization.assignment_date;
        } else {
          this.pic = '';
          const today = new Date();
          tgl_mobilisasi = today.toISOString().substring(0, 10);
        }
        this.tgl_mobilisasi = tgl_mobilisasi.substring(0, 10); 
        // console.log('mobilization:', this.sampleData.mobilization_units[0].mobilization.first_published_at);
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

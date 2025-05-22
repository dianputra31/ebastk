import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand, UnitDocument  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';
import { trigger, style, transition, animate, stagger, query, animateChild } from '@angular/animations';
import { ApiClientService } from '../services/api.client';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { ImageGalleryModalComponent } from '../image-gallery-modal/image-gallery-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoahService } from '../noah.service';
import { InspectionItemResponse } from '../../assets/models/list-inspection.model';


type GroupedItem = {
  [subCategory: string]: any[] & { open?: string };
};

type CategoryGroup = {
  item_category_chipname?: string;
  item_category_chiplabel?: string;
  item_category_url?: string;
  item_category_icon?: string;
  item_category_chipclass?: string;
  item_category_buttonclass?: string;
  item_category_buttonlabel?: string;
  item_posizione?: string;

  [subCategory: string]: any;
};

@Component({
  selector: 'app-the-detail-history',
  templateUrl: './the-detail-history.component.html',
  styleUrls: ['./the-detail-history.component.scss']
})
export class TheDetailHistoryComponent implements OnInit {
@Input() stepHistory: any;
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
@Output() noah = new EventEmitter<string>();
detailData: any[] = [];
groupedItems: { [key: string]: any[] } = {};
subCategory: { [category: string]: string[] } = {};
wwgombel: number = 1;
groupedSubItems: { [category: string]: CategoryGroup } = {};




  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private modalService: NgbModal, private noahService: NoahService) { }

  ngOnInit(): void {
    this.infoUnit();
    this.showGrouping();
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
        console.log('bpkbDocuments:', this.bpkbDocuments);

        /** NOAH HEADER */
        this.noahService.emitNoah(this.display_name);
        this.noahService.emitNoahLoc(this.sampleData.unit_location);
        this.noahService.emitNoahDate(this.sampleData.mobilization_units[0].mobiliztion.assignment_date);
        this.noahService.emitDoneBy(this.sampleData.mobilization_units[0].mobiliztion.pic);
        this.noahService.emitDoneDate(this.sampleData.mobilization_units[0].mobiliztion.assignment_date);

        // alert(this.sampleData.display_name);

        this.pic = this.sampleData.mobilization_units[0].mobiliztion.pic;
        const tgl_mobilisasi = this.sampleData.mobilization_units[0].mobiliztion.assignment_date;
        this.tgl_mobilisasi = tgl_mobilisasi.substring(0, 10);
        console.log('mobiliztion:', this.sampleData.mobilization_units[0].mobiliztion.first_published_at);
        console.log('tgl_mobilisasi:', this.tgl_mobilisasi);
        this.infoVendor(response.vendor.id);
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




  async showGrouping() {
    const unitData = {
      page: '1'
    };
    this.errlog = "";
  
    try {
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/get-detail?unit_id=${unit_id}`; // Endpoint API
      const response = await this.apiClient.get<InspectionItemResponse>(endpoint);
      console.log('Data posted:', response);
  
      // Kalau responsenya array
      if (Array.isArray(response)) {
        this.detailData = response;
  
        // Kelompokkan berdasarkan item_category
        // this.groupedItems = this.groupItemsByCategory(this.sampleData);
        this.groupedSubItems = this.groupItemsByCategoryAndSubCategory(this.detailData);
        this.subCategory = this.groupCategoriesAndSubCategories(this.detailData);
        localStorage.setItem('subCategory', JSON.stringify(this.subCategory));

  
        console.log('Grouped Items:', this.groupedItems);
      } else {
        console.log('here failed');
        this.errlog = 'Data tidak sesuai format.';
      }
  
    } catch (error) {
      this.isButtonDisabled = false;
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          this.errlog = 'Username atau password salah.';
        } else {
          this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
        }
      } else {
        this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
      }
      console.error('Error during fetch:', error);
      this.isLoading = false;
    }
  }

  
groupItemsByCategoryAndSubCategory(data: any[]) {
  const groups: { [category: string]: CategoryGroup } = {};
  this.wwgombel = 1;

  data.forEach(item => {
    const category = item.item_category;
    const subCategory = item.item_sub_category;

    if (!groups[category]) {
      groups[category] = {};

      // Tambahkan info tambahan berdasarkan kategori
      const cat = category.toLowerCase();

      if (cat.includes('exterior')) {
        groups[category].item_category_chipname = 'Exterior Inspection';
        groups[category].item_category_chiplabel = 'A';
        groups[category].item_category_url = '/exterior-inspection';
        groups[category].item_category_icon = '../../assets/icons/step1.png';
      } else if (cat.includes('interior')) {
        groups[category].item_category_chipname = 'Interior Inspection';
        groups[category].item_category_chiplabel = 'B';
        groups[category].item_category_url = '/interior-inspection';
        groups[category].item_category_icon = '../../assets/icons/step2.png';
      } else if (cat.includes('engine')) {
        groups[category].item_category_chipname = 'Engine Inspection';
        groups[category].item_category_chiplabel = 'C';
        groups[category].item_category_url = '/engine-inspection';
        groups[category].item_category_icon = '../../assets/icons/step3.png';
      }
    }

    if (!groups[category][subCategory]) {
      groups[category][subCategory] = [];
    }

    const validQuestions = item.questions.filter((q: any) => q.name !== null);
    const withNameCount = validQuestions.length;
    const answeredCount = validQuestions.filter((q: any) => q.answer !== null).length;
    const unansweredCount = withNameCount - answeredCount;

    let status = '';
    if (answeredCount === withNameCount && withNameCount > 0) {
      status = 'closed';
      this.wwgombel = this.wwgombel * 1
    } else if (answeredCount === 0 && withNameCount > 0) {
      status = 'open';
      this.wwgombel = this.wwgombel * 0
    } else if (answeredCount < withNameCount && answeredCount > 0) {
      status = 'notyet';
      this.wwgombel = this.wwgombel * 0
    }

    groups[category][subCategory]['open'] = status;

    if (status === 'open') {
      groups[category].item_category_chipclass = 'saiki';
      groups[category].item_category_buttonclass = 'btn-saiki';
      groups[category].item_category_buttonlabel = 'Start Inspection >';
      groups[category].item_posizione = 'Open';
    } else if (status === 'closed') {
      groups[category].item_category_chipclass = 'wisrampung';
      groups[category].item_category_buttonclass = 'btn-rampung';
      groups[category].item_category_buttonlabel = 'Completed >';
      groups[category].item_posizione = 'Done';
    } else if (status === 'notyet') {
      groups[category].item_category_chipclass = 'notyet';
      groups[category].item_category_buttonclass = 'btn-notyet';
      groups[category].item_category_buttonlabel = 'Start Inspection >';
      groups[category].item_posizione = 'Nope';
    }

    groups[category][subCategory].push(item);
  });

  if (groups['Exterior']?.item_posizione === 'Open') {
    if (groups['Interior']) {
      groups['Interior'].item_category_chipclass = 'notyet';
      groups['Interior'].item_category_buttonclass = 'btn-notyet';
      groups['Interior'].item_category_buttonlabel = 'Start Inspection >';
    }
    if (groups['Engine']) {
      groups['Engine'].item_category_chipclass = 'notyet';
      groups['Engine'].item_category_buttonclass = 'btn-notyet';
      groups['Engine'].item_category_buttonlabel = 'Start Inspection >';
    }
  } else if (groups['Interior']?.item_posizione === 'Open') {
    if (groups['Engine']) {
      groups['Engine'].item_category_chipclass = 'notyet';
      groups['Engine'].item_category_buttonclass = 'btn-notyet';
      groups['Engine'].item_category_buttonlabel = 'Start Inspection >';
    }
  }


  // Tambahkan kategori manual "Photos"
  groups['Photos'] = {
    item_category_chipname: "Unit Photos",
    item_category_chiplabel: "D",
    item_category_url: "/unit-photos",
    item_category_icon: "../../assets/icons/step4.png",
    item_category_chipclass: groups['Exterior']?.item_posizione === 'Done' && groups['Interior']?.item_posizione === 'Done' && groups['Engine']?.item_posizione === 'Done' ? 'saiki' : 'notyet',
    item_category_buttonclass: groups['Exterior']?.item_posizione === 'Done' && groups['Interior']?.item_posizione === 'Done' && groups['Engine']?.item_posizione === 'Done' ? 'btn-saiki' : 'btn-notyet',
    item_category_buttonlabel: "Start Inspection >",
    item_posizione: "Nope"
  };

  return groups;
}


  groupCategoriesAndSubCategories(data: any[]) {
    const groups: { [category: string]: string[] } = {};

    data.forEach(item => {
      const category = item.item_category;
      const subCategory = item.item_sub_category;
      // const subCategory = item.item_sub_category
      //   .toLowerCase()
      //   .replace(/\b\w/g, (char: string) => char.toUpperCase());

      if (!groups[category]) {
        groups[category] = [];
      }

      if (!groups[category].includes(subCategory)) {
        groups[category].push(subCategory);
      }
    });

    return groups;
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


}

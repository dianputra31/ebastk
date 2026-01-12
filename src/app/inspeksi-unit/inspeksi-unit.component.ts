import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { InspectionItemResponse } from '../../assets/models/list-inspection.model';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  


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
  selector: 'app-inspeksi-unit',
  templateUrl: './inspeksi-unit.component.html',
  styleUrls: ['./inspeksi-unit.component.scss']
})
export class InspeksiUnitComponent implements OnInit {
  errlog:string = '';
  sampleDataVendor: VendorDetailResponse | null = null;
  currentDate: Date = new Date(); // Mendapatkan tanggal dan waktu saat ini
  @Input() fromDashboard:any;
  isButtonDisabled: boolean = false;
  isLoading: boolean = false;
  username: string = '';
  password: string = '';
  sampleData: any[] = [];
  groupedItems: { [key: string]: any[] } = {};
  // groupedSubItems: { [category: string]: { [subCategory: string]: any[] } } = {};
  subCategory: { [category: string]: string[] } = {};
  objectKeys = Object.keys;
  // groupedSubItems: { [category: string]: { [subCategory: string]: any[] & { open?: string } } } = {};
  groupedSubItems: { [category: string]: CategoryGroup } = {};
  wwgombel: number = 1;
  sampleDataInfo: UnitDetailResponse | null = null;
  bastk_status: string = "draft";

  constructor(private router: Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
    this.showGrouping();
  }


  async infoUnit() {
    // this.isLoading = true;

    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/detail-unit?unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<UnitDetailResponse>(endpoint);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.vendor.id) {
        this.sampleDataInfo = response;  
        this.bastk_status = this.sampleDataInfo.bastk_status;
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
    }
  }

  async showGrouping() {

    this.isLoading = true;

    this.infoUnit();

    const unitData = {
      page: '1'
    };
    this.errlog = "";

    this.isLoading = true;
  
    try {
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/get-detail?unit_id=${unit_id}`; // Endpoint API
      const response = await this.apiClient.get<InspectionItemResponse>(endpoint);
      console.log('Data posted:', response);

      this.isLoading = false;
  
      // Kalau responsenya array
      if (Array.isArray(response)) {
        this.sampleData = response;
  
        // Cek jika array kosong
        if (this.sampleData.length === 0) {
          console.log('Response is empty array');
          this.groupedSubItems = {};
          this.subCategory = {};
        } else {
          // Kelompokkan berdasarkan item_category
          // this.groupedItems = this.groupItemsByCategory(this.sampleData);
          this.groupedSubItems = this.groupItemsByCategoryAndSubCategory(this.sampleData);
          this.subCategory = this.groupCategoriesAndSubCategories(this.sampleData);
          localStorage.setItem('subCategory', JSON.stringify(this.subCategory));
        }
  
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
    let answeredCount = validQuestions.filter((q: any) => q.answer !== null).length;
    if (item.kondisi === 'Tidak') {
      answeredCount = withNameCount;
    }    
    
    const unansweredCount = withNameCount - answeredCount;

    let status = '';
    console.log("withNameCount:::", withNameCount);
    console.log("answeredCount:::", answeredCount);

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
    // item_category_chipclass: groups['Exterior']?.item_posizione === 'Done' && groups['Interior']?.item_posizione === 'Done' && groups['Engine']?.item_posizione === 'Done' ? 'saiki' : 'notyet',
    // item_category_buttonclass: groups['Exterior']?.item_posizione === 'Done' && groups['Interior']?.item_posizione === 'Done' && groups['Engine']?.item_posizione === 'Done' ? 'btn-saiki' : 'btn-notyet',
    
    item_category_chipclass:
      this.bastk_status === 'revision' ||
      !(groups['Exterior']?.item_posizione === 'Done' && groups['Interior']?.item_posizione === 'Done' && groups['Engine']?.item_posizione === 'Done')
        ? 'notyet'
        : 'saiki',

    item_category_buttonclass:
      this.bastk_status === 'revision' ||
      !(groups['Exterior']?.item_posizione === 'Done' && groups['Interior']?.item_posizione === 'Done' && groups['Engine']?.item_posizione === 'Done')
        ? 'btn-notyet'
        : 'btn-saiki',
    item_category_buttonlabel: "Start Inspection >",
    item_posizione: "Nope"
  };

  return groups;
}



get sortedGroupedSubItems() {
  const order = ['A', 'B', 'C', 'D'];
  return Object.keys(this.groupedSubItems)
    .map(key => this.groupedSubItems[key])
    .sort((a, b) => order.indexOf(a.item_category_chiplabel ?? '') - order.indexOf(b.item_category_chiplabel ?? ''));
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

  GoesToInspection(a: any){
    const unit_id = this.router.url.split('/').pop();
    // if(a==1){
      // this.router.navigate([a + '/' + unit_id]);
      window.location.href = a + '/' + unit_id;
    // }else if(a==2){
    //   this.router.navigate(['/interior-inspection' + '/' + unit_id]);
    // }else if(a==3){
    //   this.router.navigate(['/engine-inspection' + '/' + unit_id]);
    // }else if(a==4){
    //   this.router.navigate(['/unit-photos' + '/' + unit_id]);
    // }else{
    //   this.router.navigate(['/inspection-summary' + '/' + unit_id]);
    // }
  }

}

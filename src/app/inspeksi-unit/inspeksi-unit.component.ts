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
  
  // Modal properties
  isChoiceModalOpen: boolean = false;

  // Debug modal properties
  isDebugModalOpen: boolean = false;
  debugModalTitle: string = '';
  debugModalItems: any[] = [];

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
  // Track worst status per category: open > notyet > closed
  const categoryStatus: { [category: string]: string } = {};
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

    // Handle null/undefined questions array
    const questions = item.questions || [];
    const validQuestions = questions.filter((q: any) => q.name !== null);
    const withNameCount = validQuestions.length;
    let answeredCount = validQuestions.filter((q: any) => q.answer !== null).length;

    let status = '';

    // Item dengan kondisi "Tidak" otomatis dianggap completed
    if (item.kondisi === 'Tidak') {
      status = 'closed';
      this.wwgombel = this.wwgombel * 1;
    } else if (withNameCount > 0) {
      // Item dengan kondisi "Ada" cek kelengkapan jawaban
      if (answeredCount === withNameCount) {
        status = 'closed';
        this.wwgombel = this.wwgombel * 1;
      } else if (answeredCount === 0) {
        status = 'open';
        this.wwgombel = this.wwgombel * 0;
      } else {
        status = 'notyet';
        this.wwgombel = this.wwgombel * 0;
      }
    } else {
      // Item tanpa pertanyaan valid dianggap completed
      status = 'closed';
      this.wwgombel = this.wwgombel * 1;
    }

    // Debug logging untuk item yang tidak completed di Exterior
    if (category === 'Exterior' && status !== 'closed') {
      console.log(`🔍 Exterior item NOT completed:`, {
        subCategory,
        item_description: item.item_description,
        kondisi: item.kondisi,
        withNameCount,
        answeredCount,
        status,
        questions: item.questions
      });
    }

    // Debug logging untuk item yang tidak completed di Interior
    if (category === 'Interior' && status !== 'closed') {
      console.log(`🔍 Interior item NOT completed:`, {
        subCategory,
        item_description: item.item_description,
        kondisi: item.kondisi,
        withNameCount,
        answeredCount,
        status,
        questions: item.questions
      });
    }

    groups[category][subCategory]['open'] = status;

    // Accumulate worst status per category (open > notyet > closed)
    if (status === 'open') {
      categoryStatus[category] = 'open';
    } else if (status === 'notyet' && categoryStatus[category] !== 'open') {
      categoryStatus[category] = 'notyet';
    } else if (status === 'closed' && !categoryStatus[category]) {
      categoryStatus[category] = 'closed';
    }

    groups[category][subCategory].push(item);
  });

  // Apply final aggregated status per category
  Object.keys(groups).forEach(category => {
    const catStatus = categoryStatus[category];
    
    // Debug logging untuk melihat status final setiap category
    console.log(`📊 Category "${category}" final status:`, catStatus);
    
    if (catStatus === 'open' || catStatus === 'notyet') {
      // 'open' = belum dijawab sama sekali
      // 'notyet' = partially answered
      // Keduanya harus bisa diakses (button aktif) untuk dilengkapi
      groups[category].item_category_chipclass = 'saiki';
      groups[category].item_category_buttonclass = 'btn-saiki';
      groups[category].item_category_buttonlabel = 'Start Inspection >';
      groups[category].item_posizione = 'Open';
    } else if (catStatus === 'closed') {
      groups[category].item_category_chipclass = 'wisrampung';
      groups[category].item_category_buttonclass = 'btn-rampung';
      groups[category].item_category_buttonlabel = 'Completed >';
      groups[category].item_posizione = 'Done';
    } else {
      // Tidak ada status (belum pernah diisi sama sekali)
      groups[category].item_category_chipclass = 'notyet';
      groups[category].item_category_buttonclass = 'btn-notyet';
      groups[category].item_category_buttonlabel = 'Start Inspection >';
      groups[category].item_posizione = 'Nope';
    }
  });

  // Logika dependency: Interior harus tunggu Exterior Done, Engine harus tunggu Interior Done
  console.log('🔒 Dependency check:', {
    'Exterior status': groups['Exterior']?.item_posizione,
    'Interior status': groups['Interior']?.item_posizione,
    'Engine status': groups['Engine']?.item_posizione
  });

  // Interior hanya di-block jika Exterior belum Done DAN Interior belum pernah diisi
  // Jika Interior sudah ada data (Open/Nope), tetap bisa diakses untuk dilengkapi
  if (groups['Exterior']?.item_posizione !== 'Done') {
    if (groups['Interior'] && groups['Interior'].item_posizione === 'Nope') {
      // Hanya block jika benar-benar belum pernah diisi
      console.log('⚠️ Blocking Interior - Exterior not Done and Interior never started');
      groups['Interior'].item_category_chipclass = 'notyet';
      groups['Interior'].item_category_buttonclass = 'btn-notyet';
      groups['Interior'].item_category_buttonlabel = 'Start Inspection >';
      groups['Interior'].item_posizione = 'Nope';
    } else {
      console.log('✅ Interior accessible - has data to complete');
    }
  }

  // Engine hanya di-block jika prerequisites belum Done DAN Engine belum pernah diisi
  if (groups['Exterior']?.item_posizione !== 'Done' || groups['Interior']?.item_posizione !== 'Done') {
    if (groups['Engine'] && groups['Engine'].item_posizione === 'Nope') {
      // Hanya block jika benar-benar belum pernah diisi
      console.log('⚠️ Blocking Engine - Prerequisites not Done and Engine never started');
      groups['Engine'].item_category_chipclass = 'notyet';
      groups['Engine'].item_category_buttonclass = 'btn-notyet';
      groups['Engine'].item_category_buttonlabel = 'Start Inspection >';
      groups['Engine'].item_posizione = 'Nope';
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

  // Helper methods untuk debug modal completion status
  getItemCompletionClass(item: any): string {
    if (item.kondisi === 'Tidak') {
      return 'completion-na'; // Not Applicable
    }
    
    const questions = item.questions || [];
    const validQuestions = questions.filter((q: any) => q.name !== null);
    const withNameCount = validQuestions.length;
    const answeredCount = validQuestions.filter((q: any) => q.answer !== null && q.answer !== undefined).length;
    
    if (withNameCount === 0) {
      return 'completion-complete'; // No questions = auto complete
    }
    
    if (answeredCount === withNameCount) {
      return 'completion-complete';
    } else if (answeredCount === 0) {
      return 'completion-empty';
    } else {
      return 'completion-incomplete';
    }
  }

  getItemCompletionText(item: any): string {
    if (item.kondisi === 'Tidak') {
      return 'N/A';
    }
    
    const questions = item.questions || [];
    const validQuestions = questions.filter((q: any) => q.name !== null);
    const withNameCount = validQuestions.length;
    const answeredCount = validQuestions.filter((q: any) => q.answer !== null && q.answer !== undefined).length;
    
    if (withNameCount === 0) {
      return '✓ Complete';
    }
    
    if (answeredCount === withNameCount) {
      return '✓ Complete';
    } else if (answeredCount === 0) {
      return '⚠ Empty';
    } else {
      return `⚠ Incomplete (${answeredCount}/${withNameCount})`;
    }
  }

  GoesToInspection(a: any){
    const unit_id = this.router.url.split('/').pop();
    
    // Jika url adalah /unit-photos, tampilkan modal pilihan
    if(a === '/unit-photos') {
      this.isChoiceModalOpen = true;
      return;
    }
    
    // Selain itu, langsung navigate
    window.location.href = a + '/' + unit_id;
  }
  
  closeChoiceModal() {
    this.isChoiceModalOpen = false;
  }

  openDebugModal(event: MouseEvent, categoryGroup: any): void {
    event.stopPropagation();
    this.debugModalTitle = categoryGroup.item_category_chipname || '';
    const allItems: any[] = [];
    Object.keys(categoryGroup).forEach(key => {
      if (!key.startsWith('item_')) {
        const subItems = categoryGroup[key];
        if (Array.isArray(subItems)) {
          subItems.forEach((item: any) => {
            allItems.push({ ...item, _subCategory: key });
          });
        }
      }
    });
    this.debugModalItems = allItems;
    this.isDebugModalOpen = true;
  }

  closeDebugModal(): void {
    this.isDebugModalOpen = false;
  }
  
  goToDokumenBASTK() {
    // Cek jika kedua signature URL sudah ada, maka tidak bisa akses
    if (this.sampleDataInfo?.signsender_url && this.sampleDataInfo?.signbastk_url) {
      return; // Tidak melakukan apa-apa jika kedua URL sudah ada
    }
    
    const unit_id = this.router.url.split('/').pop();
    window.location.href = '/inspection-summary/' + unit_id;
  }
  
  // Method untuk mengecek apakah dokumen BASTK sudah ditandatangani
  isDokumenBASTKDisabled(): boolean {
    return !!(this.sampleDataInfo?.signsender_url && this.sampleDataInfo?.signbastk_url);
  }
  
  goToUnitPhotos() {
    const unit_id = this.router.url.split('/').pop();
    window.location.href = '/unit-photos/' + unit_id;
  }

}

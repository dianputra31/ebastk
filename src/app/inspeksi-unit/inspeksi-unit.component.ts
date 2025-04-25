import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { InspectionItemResponse } from '../../assets/models/list-inspection.model';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';


type GroupedItem = {
  [subCategory: string]: any[] & { open?: string };
};

type CategoryGroup = GroupedItem & {
  item_category_chipname?: string;
  item_category_chiplabel?: string;
  item_category_url?: string;
  item_category_icon?: string;
  item_category_chipclass?: string;
  item_category_buttonclass?: string;
  item_category_buttonlabel?: string;
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

  constructor(private router: Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
    this.showGrouping();
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
        this.sampleData = response;
  
        // Kelompokkan berdasarkan item_category
        // this.groupedItems = this.groupItemsByCategory(this.sampleData);
        this.groupedSubItems = this.groupItemsByCategoryAndSubCategory(this.sampleData);
        this.subCategory = this.groupCategoriesAndSubCategories(this.sampleData);
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

  groupItemsByCategory(data: any[]) {
    const groups: { [key: string]: any[] } = {};
    data.forEach(item => {
      const category = item.item_category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }


  groupItemsByCategoryAndSubCategory_Old(data: any[]) {
    const groups: { [category: string]: { [subCategory: string]: any[] & { open?: string } } } = {};

    data.forEach(item => {
        const category = item.item_category;
        const subCategory = item.item_sub_category;

        if (!groups[category]) {
            groups[category] = {};
        }

        if (!groups[category][subCategory]) {
            groups[category][subCategory] = [];
        }

        // Push the item into the group
        groups[category][subCategory].push(item);

        // Check the questions array for the current item
        const hasUnansweredQuestions = item.questions.some((question: any) => 
            question.name !== null && question.answer === null
        );

        // Add 'open' or 'closed' status based on the questions
        if (hasUnansweredQuestions) {
            groups[category][subCategory]['open'] = 'open';
        } else {
            groups[category][subCategory]['open'] = 'closed';
        }
    });

    return groups;
}


groupItemsByCategoryAndSubCategory_Modified(data: any[]) {
  const groups: { [category: string]: CategoryGroup } = {};


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

    // Cek apakah ada pertanyaan yang belum dijawab
    const hasUnansweredQuestions = item.questions.some((question: any) =>
      question.name !== null && question.answer === null
    );

    // Tambahkan status 'open' atau 'closed'
    const status = hasUnansweredQuestions ? 'open' : 'closed';
    groups[category][subCategory]['open'] = status;

    // Tambahkan class tambahan berdasarkan status
    if (status === 'open') {
      groups[category].item_category_chipclass = 'saiki';
      groups[category].item_category_buttonclass = 'btn-saiki';
      groups[category].item_category_buttonlabel = 'Start Inspection     >';
    } else {
      groups[category].item_category_chipclass = 'wisrampung';
      groups[category].item_category_buttonclass = 'btn-rampung';
      groups[category].item_category_buttonlabel = 'Completed     >';
    }

    // Push the item
    groups[category][subCategory].push(item);

  });

  return groups;
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

    // Filter pertanyaan yang punya name
    const validQuestions = item.questions.filter((q: any) => q.name !== null);
    const withNameCount = validQuestions.length;
    const answeredCount = validQuestions.filter((q: any) => q.answer !== null).length;
    const unansweredCount = withNameCount - answeredCount;

    // Tentukan status berdasarkan jumlah pertanyaan yang terjawab dan belum terjawab
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

    // Tambahkan status ke sub-kategori
    groups[category][subCategory]['open'] = status;

    // Tambahkan class tambahan berdasarkan status
    if (status === 'open') {
      groups[category].item_category_chipclass = 'saiki';
      groups[category].item_category_buttonclass = 'btn-saiki';
      groups[category].item_category_buttonlabel = 'Start Inspection >';
    } else if (status === 'closed') {
      groups[category].item_category_chipclass = 'wisrampung';
      groups[category].item_category_buttonclass = 'btn-rampung';
      groups[category].item_category_buttonlabel = 'Completed >';
    } else if (status === 'notyet') {
      groups[category].item_category_chipclass = 'notyet'; // Atur class sesuai kebutuhan
      groups[category].item_category_buttonclass = 'btn-notyet'; // Atur class sesuai kebutuhan
      groups[category].item_category_buttonlabel = 'Start Inspection >'; // Atur label sesuai kebutuhan
    }

    // Push the item
    groups[category][subCategory].push(item);
  });

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

  GoesToInspection(a: any){
    const unit_id = this.router.url.split('/').pop();
    // if(a==1){
      this.router.navigate([a + '/' + unit_id]);
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

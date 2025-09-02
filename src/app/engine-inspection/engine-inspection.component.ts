import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { InspectionItemResponse } from '../../assets/models/list-inspection.model';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  
import { PanelSyncService } from '../../app/panel.service';

@Component({
selector: 'app-engine-inspection',
templateUrl: './engine-inspection.component.html',
styleUrls: ['./engine-inspection.component.scss']
})
export class EngineInspectionComponent implements OnInit, AfterViewInit {

isModalOpen: boolean = false;
@Input() panelName: string = '';

@ViewChild('kelengkapanUmum') kelengkapanUmum: ElementRef | undefined;
@ViewChild('infoVendor') infoVendor: ElementRef | undefined;
@ViewChild('keteranganLainnya') keteranganLainnya: ElementRef | undefined;
@ViewChild('engineForm') engineForm: ElementRef | undefined;

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
groupedSubItems: { [category: string]: { [subCategory: string]: any[] } } = {};
objectKeys = Object.keys;
sampleDataInfo: UnitDetailResponse | null = null;
payload: any = null;
// engineForm: any;
isModalAnswerOpen: boolean = false;
modalQuestions: any[] = [];
modalItem: any = null;

@Output() activePanelChange = new EventEmitter<string>();

constructor(private router: Router,  private apiClient: ApiClientService, private panelSync: PanelSyncService) { }

ngOnInit(): void {
  this.infoUnit();
  this.showGroupingExterior();
}

ngAfterViewInit(): void {
// Tunggu data sampleData dan groupedSubItems sudah siap
  setTimeout(() => {
    if (this.engineForm) {
      this.onSubmit(this.engineForm);
    }
  }, 0);
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


    // Jika login berhasil, simpan data ke localStorage
    if (response && response.vendor.id) {
      // this.isLoading = false;
      this.sampleDataInfo = response;  
    }else{
      // this.isLoading = false;
      this.errlog = 'Username atau password salah';
    }

  } catch (error) {
    // this.isLoading = false;
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

async showGroupingExterior() {
  const unitData = {
    page: '1'
  };
  this.errlog = "";

  try {
    this.isLoading = true;
    const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
    const endpoint = `/get-detail?unit_id=${unit_id}`; // Endpoint API
    const response = await this.apiClient.get<InspectionItemResponse>(endpoint);
    // console.log('Data posted:', response);
    // this.isLoading = false;
    // Kalau responsenya array
    if (Array.isArray(response)) {
      
      this.sampleData = response;

      // Kelompokkan berdasarkan item_category
      this.groupedSubItems = this.groupItemsByCategoryAndSubCategory(this.sampleData);
      

      console.log('Grouped Items:', this.groupedItems);

      setTimeout(() => {
        if (this.engineForm) {
          this.onSubmit(this.engineForm);
        }
      }, 0);
      
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
  }
  this.isLoading = false;
}




openQuestionsModal(item: any) {
  this.modalItem = item;
  this.modalQuestions = item.questions;
  this.isModalAnswerOpen = true;
}

closeQuestionsModal() {
  this.isModalAnswerOpen = false;
  this.modalItem = null;
  this.modalQuestions = [];
}

onSelectChange(event: any, form: any) {
  setTimeout(() => {
    this.onSubmit(form);

    // Hanya cek pertanyaan yang name-nya bukan null
    const allAnswered = this.modalQuestions
      .filter(q => q.name !== null)
      .every(q => q.answer !== null && q.answer !== undefined);

    if (allAnswered) {
      this.closeQuestionsModal();
    }
  }, 0);
}

onModalOverlayClick(event: MouseEvent) {
  this.closeQuestionsModal();
}

onPanelInView(panelId: string) {
  this.panelSync.emitPanel(panelId);
}




onSubmit(form: any): void {
  const questions: { [key: string]: any }[] = [];

  for (const subCategory in this.groupedSubItems['Engine']) {
    const items = this.groupedSubItems['Engine'][subCategory];
    items.forEach((item: any) => {
      let questionObj: any = { bastk_item_id: item.id, kondisi: item.kondisi };
      let hasAnswer = false;
      item.questions.forEach((question: any) => {
        if (question.answer !== undefined && question.answer !== null) {
          questionObj[question.key] = question.answer;
          hasAnswer = true;
        }
      });
      if (hasAnswer || item.kondisi) {
        questions.push(questionObj);
      }
    });
  }

  const unit_id = this.router.url.split('/').pop();
  this.payload = {
    unit_id: unit_id,
    bastk_status: 'draft',
    questions: questions
  };

  console.log('Payload yang dikirim:', this.payload);
  localStorage.setItem('enginePayload', JSON.stringify(this.payload));
}





groupItemsByCategoryAndSubCategory(data: any[]) {
  // this.isLoading = false;
  const groups: { [category: string]: { [subCategory: string]: any[] } } = {};

  data.forEach(item => {
    const category = item.item_category;
    const subCategory = item.item_sub_category;

    if (!groups[category]) {
      groups[category] = {};
    }

    if (!groups[category][subCategory]) {
      groups[category][subCategory] = [];
    }

    groups[category][subCategory].push(item);
  });

  return groups;
}




openModal() {
  this.isModalOpen = true; // Membuka modal
}

}

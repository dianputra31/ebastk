import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { InspectionItemResponse } from '../../assets/models/list-inspection.model';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  

@Component({
  selector: 'app-engine-inspection',
  templateUrl: './engine-inspection.component.html',
  styleUrls: ['./engine-inspection.component.scss']
})
export class EngineInspectionComponent implements OnInit {

  isModalOpen: boolean = false;
  @Input() panelName: string = '';

  @ViewChild('kelengkapanUmum') kelengkapanUmum: ElementRef | undefined;
  @ViewChild('infoVendor') infoVendor: ElementRef | undefined;
  @ViewChild('keteranganLainnya') keteranganLainnya: ElementRef | undefined;

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
  engineForm: any;


  constructor(private router: Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
    this.infoUnit();
    this.showGroupingExterior();
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

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.vendor.id) {
        this.sampleDataInfo = response;  
        console.log('Sample Data:', this.sampleData);
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

  async showGroupingExterior() {
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
        this.groupedSubItems = this.groupItemsByCategoryAndSubCategory(this.sampleData);
  
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



  onSubmit(form: any): void {
    console.log('Form Data:', form.value);

    const questions: { [key: string]: any }[] = [];

    // Loop melalui groupedSubItems untuk membangun array questions
    for (const subCategory in this.groupedSubItems['Engine']) {
        const items = this.groupedSubItems['Engine'][subCategory];
        items.forEach((item: any) => {


            item.questions.forEach((question: any) => {
              const questionKondisi = `${item.id}_kondisi`;
              const valueKondisi = form.value[questionKondisi]; // Ambil nilai dari form
                const questionKey = `${item.id}_${question.key}`;
                const value = form.value[questionKey]; // Ambil nilai dari form
                if (value || valueKondisi) { // Hanya tambahkan jika value tidak kosong
                    const existingQuestion = questions.find(q => q['bastk_item_id'] === item.id);
                    if (existingQuestion) {
                        // Jika sudah ada, tambahkan key-value baru
                        existingQuestion[question.key] = value;
                    } else {
                        // Jika belum ada, buat objek baru dengan "kondisi" default
                        questions.push({
                            bastk_item_id: item.id,
                            kondisi: valueKondisi, // Tambahkan key "kondisi" dengan nilai default
                            [question.key]: value
                        });
                    }
                }
            });
        });
    }

    const unit_id = this.router.url.split('/').pop(); 
    
    // Bungkus questions ke dalam format JSON yang diinginkan
    this.payload = {
        unit_id: unit_id, // Ganti dengan unit_id yang sesuai
        bastk_status: 'draft', // Ganti dengan status yang sesuai
        questions: questions
    };

    console.log('Payload yang dikirim:', this.payload);
    localStorage.setItem('enginePayload', JSON.stringify(this.payload)); // Simpan payload ke localStorage
    // this.isModalOpen = true; // Buka modal
}




  groupItemsByCategoryAndSubCategory(data: any[]) {
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

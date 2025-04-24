import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { InspectionItemResponse } from '../../assets/models/list-inspection.model';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  

@Component({
  selector: 'app-exterior-inspection',
  templateUrl: './exterior-inspection.component.html',
  styleUrls: ['./exterior-inspection.component.scss']
})
export class ExteriorInspectionComponent implements AfterViewInit {

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
  exteriorForm: any;



  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const infoVendorPanel = document.getElementById('infoVendorPanel');
  //   const infoKendaraanPanel = document.getElementById('infoKendaraanPanel');
  //   const infoLainnyaPanel = document.getElementById('infoLainnyaPanel');
  //   const infoDokumenPanel = document.getElementById('infoDokumenPanel');

  //   if (infoKendaraanPanel && this.isElementInViewport(infoKendaraanPanel)) {
  //     this.panelChange.emit('Info Kendaraan');
  //   } else if (infoVendorPanel && this.isElementInViewport(infoVendorPanel)) {
  //     this.panelChange.emit('Info Vendor');
  //   } else if (infoDokumenPanel && this.isElementInViewport(infoDokumenPanel)) {
  //     this.panelChange.emit('Dokumen dan Kelengkapan Lainnya');
  //   } else if (infoLainnyaPanel && this.isElementInViewport(infoLainnyaPanel)) {
  //     this.panelChange.emit('Keterangan Lainnya');
  //   }
  // }

  // isElementInViewport(el: HTMLElement) {
  //   const rect = el.getBoundingClientRect();
  //   return (
  //     rect.top >= 0 &&
  //     rect.left >= 0 &&
  //     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
  //     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  //   );
  // }


  constructor(private router: Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
    this.infoUnit();
    this.showGroupingExterior();
  }

  ngAfterViewInit() {
    this.scrollToPanel(this.panelName);
  }

  onSubmitOld(form: any): void {
    console.log('Form Data:', form.value);

    const questions: { [key: string]: any }[] = [];

    // Loop melalui groupedSubItems untuk membangun array questions
    for (const subCategory in this.groupedSubItems['Exterior']) {
      const items = this.groupedSubItems['Exterior'][subCategory];
      items.forEach((item: any) => {
        item.questions.forEach((question: any) => {
          const questionKey = `${item.id}_${question.key}`;
          const value = form.value[questionKey]; // Ambil nilai dari form
          if (value) { // Hanya tambahkan jika value tidak kosong
            const existingQuestion = questions.find(q => q['bastk_item_id'] === item.id);
            if (existingQuestion) {
              // Jika sudah ada, tambahkan key-value baru
              existingQuestion[question.key] = value;
            } else {
              // Jika belum ada, buat objek baru
              questions.push({
                bastk_item_id: item.id,
                kondisi: '',
                [question.key]: value
              });
            }
          }
        });
      });
    }

    // Bungkus questions ke dalam format JSON yang diinginkan
    const payload = {
      unit_id: 123, // Ganti dengan unit_id yang sesuai
      bastk_status: 'draft', // Ganti dengan status yang sesuai
      questions: questions
    };

    console.log('Payload:', payload);
    // Kirim payload ke server menggunakan HTTP request (contoh: this.http.post(...))
  }







  onSubmit(form: any): void {
    console.log('Form Data:', form.value);

    const questions: { [key: string]: any }[] = [];

    // Loop melalui groupedSubItems untuk membangun array questions
    for (const subCategory in this.groupedSubItems['Exterior']) {
        const items = this.groupedSubItems['Exterior'][subCategory];
        items.forEach((item: any) => {
            item.questions.forEach((question: any) => {
                const questionKey = `${item.id}_${question.key}`;
                const questionKondisi = `${item.id}_${question.key}_kondisi`;
                const value = form.value[questionKey]; // Ambil nilai dari form
                const valueKondisi = form.value[questionKondisi]; // Ambil nilai dari form
                if (value) { // Hanya tambahkan jika value tidak kosong
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
    localStorage.setItem('exteriorPayload', JSON.stringify(this.payload)); // Simpan payload ke localStorage
    // this.isModalOpen = true; // Buka modal
}





submitToApi(): void {
  const questions: { [key: string]: any }[] = [];

  // Loop melalui groupedSubItems untuk membangun array questions
  for (const subCategory in this.groupedSubItems['Exterior']) {
      const items = this.groupedSubItems['Exterior'][subCategory];
      items.forEach((item: any) => {
          item.questions.forEach((question: any) => {
              const questionKey = `${item.id}_${question.key}`;
              const questionKondisi = `${item.id}_${question.key}_kondisi`;
              const value = this.exteriorForm.value[questionKey]; // Ambil nilai dari form
              const valueKondisi = this.exteriorForm.value[questionKondisi]; // Ambil nilai dari form
              if (value) { // Hanya tambahkan jika value tidak kosong
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

  // Kirim payload ke API
  // this.apiClient.post('/your-api-endpoint', this.payload).subscribe(
  //     response => {
  //         console.log('API Response:', response);
  //         this.isModalOpen = false; // Tutup modal setelah berhasil
  //     },
  //     error => {
  //         console.error('API Error:', error);
  //     }
  // );

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







  submitToApiAAA(): void {
    console.log('Submitting payload to API:', this.payload);
    // Contoh pengiriman payload ke API
   
    
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

  scrollToPanel(panelName: string) {
    if (!panelName) return;

    let element: ElementRef | undefined = undefined;

    switch (panelName) {
      case 'Kelengkapan Umum':
        element = this.kelengkapanUmum;
        break;
      case 'Info Vendor':
        element = this.infoVendor;
        break;
      case 'Keterangan Lainnya':
        element = this.keteranganLainnya;
        break;
      // Tambahkan lebih banyak kasus sesuai kebutuhan
    }

    if (element) {
      element.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  openModal() {
    this.isModalOpen = true; // Membuka modal
  }

}

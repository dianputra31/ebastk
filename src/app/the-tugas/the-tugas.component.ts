import { Component, Input, OnInit } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  
import { catchError } from 'rxjs/operators';  
import { of } from 'rxjs';  
import { SampleData } from '../../assets/models/list-task.model-sample'; // Sesuaikan dengan path yang benar  
import { NewApiResponse, Result  } from '../../assets/models/list-task.model'; // Sesuaikan dengan path yang benar  
import { Router } from '@angular/router';
import { trigger, style, transition, animate, stagger, query, animateChild } from '@angular/animations';
import { ApiClientService } from '../services/api.client';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { NoahService } from '../noah.service';
import { NewApiTerjadwalResponse } from 'src/assets/models/list-terjadwal.model';

@Component({
selector: 'app-the-tugas',
templateUrl: './the-tugas.component.html',
styleUrls: ['./the-tugas.component.scss'],
animations: [
  trigger('productCardAnimation', [
    transition(':enter', [
      style({ transform: 'scale(0)', opacity: 0 }),
      animate('0.5s linear', style({ transform: 'scale(1)', opacity: 1 }))
    ])
  ]),
  trigger('productCardStagger', [
    transition('* => *', [
      query(':enter', stagger('0.5s', [
        animateChild()
      ]), { optional: true })
    ])
  ])
]
})


export class TheTugasComponent implements OnInit {
// sampleData: NewApiResponse | null = null;  
sampleDataOld: SampleData | null = null;  
currentDate: Date = new Date(); // Mendapatkan tanggal dan waktu saat ini  
@Input() fromDashboard:any;
errlog:string = '';
username: string = '';
password: string = '';
isButtonDisabled: boolean = false;
isLoading: boolean = false;
currentPage: number = 1;
sampleData: NewApiResponse = { total_items: 0, total_pages: 0, current_page: 0, results: [] };
sampleDataTerjadwal: NewApiTerjadwalResponse = { total_items: 0, total_pages: 0, current_page: 0, results: [] };
filterStatus: string = '';
filterCategory: string = '';
filter_bastk_status: string = '';
filter_category: string = '';
filterSortBy: string = 'asc';
filter_sort_by: string = '';
isModalOpen: boolean = false;
jumpPage: string = '';
filterKeyword: string = '';

isTerjadwal: boolean = false;
objectKeys = Object.keys;


// constructor() {} 
constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private noahService: NoahService) {

  this.currentDate = new Date();
  this.fromDashboard = false;
} 


// Ambil key berdasarkan index
getKeyAt(unitData: Record<string, string>, index: number): string {
  const keys = Object.keys(unitData || {});
  return keys[index] || '';
}

// Ambil value berdasarkan index
getValueAt(unitData: Record<string, string>, index: number): string {
  const keys = Object.keys(unitData || {});
  return keys[index] ? unitData[keys[index]] : '';
}

// Engine baca nomor polisi dari unit_data
// Strategi 1: deteksi format plat Indonesia dari VALUE (misal "B 1848 FKJ")
// Strategi 2: fallback tebak dari KEY jika tidak ada nilai yang cocok format
getNomorPolisi(unitData: Record<string, any>): string {
  if (!unitData) return '';
  const platRegex = /^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{1,3}$/i;

  // Strategi 1: scan values, cocokkan format plat Indonesia
  for (const key of Object.keys(unitData)) {
    const val = String(unitData[key] ?? '').trim();
    if (platRegex.test(val)) {
      return val;
    }
  }

  // Strategi 2: fallback key-name heuristic
  for (const key of Object.keys(unitData)) {
    const norm = key.toLowerCase().replace(/[\s._\-#\/]/g, '');
    if (
      norm.includes('nopol') ||
      norm.includes('polisi') ||
      norm.includes('platno') ||
      norm.includes('nomplat') ||
      norm.includes('policen') ||
      norm.includes('licensepl') ||
      norm.includes('licplate') ||
      norm === 'plat' ||
      norm === 'pol' ||
      norm === 'plcnum' ||
      norm === 'nopol'
    ) {
      return String(unitData[key] ?? '').trim();
    }
  }

  return '';
}



ngOnInit(): void {
  this.isLoading=true;

  // this.readJsonFile();  
    this.listTugas(this.currentPage);
  
  this.noahService.filterstatus$.subscribe(filterstatus => {
    this.filterStatus = filterstatus;
    this.currentPage = 1; // reset ke halaman pertama jika filter berubah
    this.listTugas(this.currentPage);
  });
  
  this.noahService.filtercategory$.subscribe(filtercategory => {
    this.filterCategory = filtercategory;
    this.currentPage = 1; // reset ke halaman pertama jika filter berubah
    this.listTugas(this.currentPage);
  });
  
  this.noahService.filtersort$.subscribe(filtersort => {
    this.filterSortBy = filtersort;
    this.currentPage = 1; // reset ke halaman pertama jika filter berubah
    this.listTugas(this.currentPage);
  });
}

get totalPages(): number {
  return this.isTerjadwal ? this.sampleDataTerjadwal.total_pages : this.sampleData.total_pages;
}

getPageNumbers(): (number | string)[] {
  const total = this.totalPages;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (this.currentPage > 3) pages.push('...');
  for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(total - 1, this.currentPage + 1); i++) {
    pages.push(i);
  }
  if (this.currentPage < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

changePage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.listTugas(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

goToPage() {
  const page = parseInt(this.jumpPage, 10);
  if (!isNaN(page) && page >= 1 && page <= this.totalPages) {
    this.changePage(page);
  }
  this.jumpPage = '';
}

onKeywordSearch() {
  this.currentPage = 1;
  this.listTugas(1);
}

clearKeyword() {
  this.filterKeyword = '';
  this.currentPage = 1;
  this.listTugas(1);
}




async listTugas(page: number) {
  this.isLoading=true;
  // const unitData = {
  //   page: '1'
  // };
  this.errlog = "";
  try {
    // const page = 1; // Parameter yang ingin dikirim
    const page_size = 20;
    const bastk_status = this.filterStatus;
    console.log("this.filterStatus====>>>>",this.filterStatus);
    // if(this.filterStatus=="0" || this.filterStatus== null || this.filterStatus==undefined){
    //   this.filter_bastk_status = '&bastk_status=';
    if(this.filterStatus=="0" || this.filterStatus== null || this.filterStatus==undefined || this.filterStatus==""){
      this.filter_bastk_status = '&bastk_status=';
    }else if(this.filterStatus=="1"){
      this.filter_bastk_status = '&bastk_status=new';
    }else if(this.filterStatus=="2"){
      this.filter_bastk_status = '&bastk_status=request_revision';
    }else if(this.filterStatus=="3"){
      this.filter_bastk_status = '&bastk_status=revision';
    }else if(this.filterStatus=="4"){
      this.filter_bastk_status = '&bastk_status=draft';
    }else{
      this.filter_bastk_status = '';
    }

    if(this.filterCategory=='' || this.filterCategory=='0'){
      this.filter_category = '&categories='
    }else{
      this.filter_category = '&categories=' + this.filterCategory;
    }

    this.filter_sort_by = '&sort_by=' + this.filterSortBy;
    // this.filter_category = this.filterCategory;

    if(this.filterStatus=="1" || this.filterStatus== "2" || this.filterStatus=="3" || this.filterStatus=="4"){
      
      this.isTerjadwal = false;
        const endpoint = `/units/?page=${page}&page_size=${page_size}` + this.filter_bastk_status + this.filter_category + this.filter_sort_by + `&keyword=${encodeURIComponent(this.filterKeyword)}`;
        const response = await this.apiClient.get<NewApiResponse>(endpoint);
        console.log('Data posted:', response);

        this.isLoading=false;
          if (response && response.results) {

      
          const filteredResults = response.results;
          
          this.sampleData = { ...response, results: filteredResults };
          this.noahService.emitTotalTugas(this.sampleData.total_items);
          
        }else{
          console.log('here failed')
          this.errlog = 'Username atau password salah';
        }

    }else{

      console.log("LIST TERJADWAL");
      this.isTerjadwal = true;
      const endpoint = `/list-mobilisasi/?keyword=${encodeURIComponent(this.filterKeyword)}&categories=${this.filterCategory}&page=${page}&page_size=${page_size}`;
      const response = await this.apiClient.get<NewApiTerjadwalResponse>(endpoint);
      console.log('Data posted:', response);

      this.isLoading=false;
        if (response && response.results) {

    
        const filteredResults = response.results;
        
        this.sampleDataTerjadwal = { ...response, results: filteredResults };
        this.noahService.emitTotalTugas(this.sampleDataTerjadwal.total_items);

      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }
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


getThumbnailUrl(thumbnail: string): string {
  return thumbnail ? `${environment.mediaUrl}${thumbnail}` : '../../assets/icons/noimages.png';
}

readJsonFile() {  
  this.http.get<SampleData>('../../assets/json/sampleData.json')  
    .pipe(  
      catchError(error => {  
        console.error('Error reading JSON file:', error);  
        return of(null);  
      })  
    )  
    .subscribe(data => {  
      this.sampleDataOld = data;  
      console.log('Sample Data:', this.sampleData);  
    });  
}

getStatusClass(status: string): string {  
  switch (status.toUpperCase()) {  
    case 'NEW':  
      return 'status-new';  
    case 'REVIEW':  
      return 'status-review';  
    case 'REVISION':  
      return 'status-revision';  
    case 'DRAFT':  
      return 'status-draft';  
    default:  
      return '';  
  }  
}  

getStatusName(status: string): string {
  switch (status.toUpperCase()) {
    case 'NEW':
      return 'NEW';
    case 'REQUEST_REVISION':
      return 'REVIEW';
    case 'REVISION':
      return 'REVISION';
    case 'DRAFT':
      return 'DRAFT';
    case 'DONE':
      return 'DONE';
    default:
      return status;
  }
}


GoesToDetailTugas(id: number, status: string){
  if(status == 'request_revision'){
    this.isModalOpen = true; // Set modal terbuka
  }else if(status == 'TERJADWAL'){
    this.router.navigate(['/detil-terjadwal/' + id]);
  }else{
    this.router.navigate(['/detil-tugas/' + id]);
  }
}

// Mengambil bagian pertama dari display_name sebelum tanda "-"
getFirstPartOfName(displayName: string): string {
  if (!displayName) return '';
  const parts = displayName.split('-');
  return parts[0].trim();
}


onModalClose() {
  this.closeModal(); // Menutup modal
}

openModal() {
  this.isModalOpen = true; // Membuka modal
}

closeModal() {
  this.isModalOpen = false; // Set modal tertutup
}

}

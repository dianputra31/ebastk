import { Component, HostListener, Input, OnInit } from '@angular/core';  
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

isTerjadwal: boolean = false;


// constructor() {} 
constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private noahService: NoahService) {

  this.currentDate = new Date();
  this.fromDashboard = false;
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

@HostListener('window:scroll', ['$event'])
onScroll(event:any): void {
  console.log("here we go again");
  const scrollPosition= window.innerHeight + window.scrollY;
  const scrollHeight= document.documentElement.scrollHeight;

  if(scrollPosition >= scrollHeight -100 && !this.isLoading){
    this.isLoading=true;
    this.currentPage++;
    this.listTugas(this.currentPage).then(() => {
      this.isLoading=false;
    });
  }
}




async listTugas(page: number) {
  this.isLoading=true;
  // const unitData = {
  //   page: '1'
  // };
  this.errlog = "";
  try {
    // const page = 1; // Parameter yang ingin dikirim
    const page_size = 60;
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
        const endpoint = `/units/?page=${page}&page_size=${page_size}` + this.filter_bastk_status + this.filter_category + this.filter_sort_by; // Menambahkan parameter ke endpoint
        const response = await this.apiClient.get<NewApiResponse>(endpoint);
        console.log('Data posted:', response);

        this.isLoading=false;
          if (response && response.results) {

      
          const filteredResults = response.results;
          
          if (page === 1) {
            this.sampleData = {
              ...response,
              results: filteredResults
            };
          } else {
            this.sampleData.results = this.sampleData.results.concat(filteredResults);
          }

          this.noahService.emitTotalTugas(this.sampleData.results.length);
          
        }else{
          console.log('here failed')
          this.errlog = 'Username atau password salah';
        }

    }else{

      console.log("LIST TERJADWAL");
      this.isTerjadwal = true;
      const endpoint = `/list-mobilisasi/?keyword=`+this.filterCategory+`&page=${page}&page_size=${page_size}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.get<NewApiTerjadwalResponse>(endpoint);
      console.log('Data posted:', response);

      this.isLoading=false;
        if (response && response.results) {

    
        const filteredResults = response.results;
        
        if (page === 1) {
          this.sampleDataTerjadwal = {
            ...response,
            results: filteredResults
          };
        } else {
          this.sampleDataTerjadwal.results = this.sampleDataTerjadwal.results.concat(filteredResults);
        }

        this.noahService.emitTotalTugas(this.sampleDataTerjadwal.results.length);

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
  if(status != 'request_revision'){
    this.router.navigate(['/detil-tugas/' + id]);
  }else{
    this.isModalOpen = true; // Set modal terbuka
  }
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

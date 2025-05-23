import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  
import { catchError } from 'rxjs/operators';  
import { of } from 'rxjs';  
import { SampleData } from '../../assets/models/list-task.model-sample'; // Sesuaikan dengan path yang benar  
import { Router } from '@angular/router';
import { trigger, style, transition, animate, stagger, query, animateChild } from '@angular/animations';
import { AuthService } from '../auth.service';
import { ApiClientService } from '../services/api.client';
import { environment } from '../../environments/environment';
import axios from 'axios';
import { NewApiResponse, Result  } from '../../assets/models/list-task.model'; // Sesuaikan dengan path yang benar  
import { NoahService } from '../noah.service';

@Component({
  selector: 'app-the-history',
  templateUrl: './the-history.component.html',
  styleUrls: ['./the-history.component.scss'],
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
export class TheHistoryComponent implements OnInit {

// sampleData: SampleData | null = null;  
currentDate: Date;
@Input() fromDashboard:any;
errlog:string = '';
sampleData: NewApiResponse = { total_items: 0, total_pages: 0, current_page: 0, results: [] };
isButtonDisabled: boolean = false;
isLoading: boolean = false;
currentPage: number = 1;
filterriwayat: string = '';
filterRiwayat: string = '';
filter_bastk_riwayat: string = '';

// constructor() {} 
  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private noahService: NoahService) {
    this.currentDate = new Date();
    this.fromDashboard = false;
  } 


  ngOnInit(): void {
    // this.readJsonFile();
    this.listTugas(this.currentPage);

    this.noahService.filterriwayat$.subscribe(filterriwayat => {
      this.filterRiwayat = filterriwayat;
          this.listTugas(this.currentPage);
    });


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
        // this.sampleData = data;  
        console.log('Sample Data:', this.sampleData);  
      });  
  }
  
  getStatusClass(status: string): string {  
    switch (status) {  
      case 'NEW':  
        return 'status-new';  
      case 'REVIEW':  
        return 'status-review';  
      case 'REVISION':  
        return 'status-revision';  
      case 'submit':  
        return 'status-done';  
      case 'DRAFT':  
        return 'status-draft';  
      default:  
        return '';  
    }  
  }
  


  
  async listTugas(page: number) {
  console.log('this.filterRiwayat::::', this.filterRiwayat);
    // const unitData = {
    //   page: '1'
    // };
    this.errlog = "";
    try {

      if(this.filterRiwayat=="" || this.filterRiwayat== null || this.filterRiwayat==undefined){
        this.filter_bastk_riwayat = '&keyword=';
      }else{
        this.filter_bastk_riwayat = '&keyword=' + this.filterRiwayat;
      }

      // const page = 1; // Parameter yang ingin dikirim
      const page_size = 60;
      const bastk_status = 'submit';
      const endpoint = `/units/?page=${page}&page_size=${page_size}&bastk_status=${bastk_status}` + this.filter_bastk_riwayat; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.get<NewApiResponse>(endpoint);
      console.log('Data posted:', response);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.results) {

        const filteredResults = response.results.filter(result =>
          Array.isArray(result.mobilization_units) && result.mobilization_units.length > 0
        );
        
        if (page === 1) {
          this.sampleData = {
      ...response,
      results: filteredResults
    };
        } else {
          this.sampleData.results = this.sampleData.results.concat(filteredResults);
        }

        // this.sampleData = response;  
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


  GoesToDetailRiwayat(id: number){
    // this.noah.emit('DINOSAURUS');
    this.router.navigate(['/detil-riwayat/' + id]);
  }

  getThumbnailUrl(thumbnail: string): string {
    return thumbnail ? `${environment.mediaUrl}${thumbnail}` : '../../assets/icons/noimages.png';
  }

}

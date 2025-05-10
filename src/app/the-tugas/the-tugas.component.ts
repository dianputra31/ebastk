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


  // constructor() {} 
  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService) {

    this.currentDate = new Date();
    this.fromDashboard = false;
  } 


  ngOnInit(): void {
    // this.readJsonFile();  
    this.listTugas(this.currentPage);
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
  
    // const unitData = {
    //   page: '1'
    // };
    this.errlog = "";
    try {
      // const page = 1; // Parameter yang ingin dikirim
      const page_size = 60;
      const endpoint = `/units/?page=${page}&page_size=${page_size}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.get<NewApiResponse>(endpoint);
      console.log('Data posted:', response);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.results) {
        if (page === 1) {
          this.sampleData = response;  
        } else {
          this.sampleData.results = this.sampleData.results.concat(response.results);
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
    switch (status) {  
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


  GoesToDetailTugas(id: number){
    this.router.navigate(['/detil-tugas/' + id]);
  }

}

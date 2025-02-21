import { Component, Input, OnInit } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  
import { catchError } from 'rxjs/operators';  
import { of } from 'rxjs';  
import { SampleData } from '../../assets/models/list-task.model'; // Sesuaikan dengan path yang benar  
import { Router } from '@angular/router';
import { trigger, style, transition, animate, stagger, query, animateChild } from '@angular/animations';


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
  sampleData: SampleData | null = null;  
  currentDate: Date = new Date(); // Mendapatkan tanggal dan waktu saat ini  
  @Input() fromDashboard:any;

  // constructor() {} 
  constructor(private http: HttpClient, private router: Router) {

    this.currentDate = new Date();
    this.fromDashboard = false;
  } 


  ngOnInit(): void {
    this.readJsonFile();  
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
        this.sampleData = data;  
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
    this.router.navigate(['/detil-tugas']);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspection-summary',
  templateUrl: './inspection-summary.component.html',
  styleUrls: ['./inspection-summary.component.scss']
})
export class InspectionSummaryComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  backToTugasPage(){
    this.router.navigate(['/tugas']);
  }

}

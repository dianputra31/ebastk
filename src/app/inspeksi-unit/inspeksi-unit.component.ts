import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspeksi-unit',
  templateUrl: './inspeksi-unit.component.html',
  styleUrls: ['./inspeksi-unit.component.scss']
})
export class InspeksiUnitComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  GoesToInspection(a: any){
    if(a==1){
      this.router.navigate(['/exterior-inspection']);
    }else if(a==2){
      this.router.navigate(['/interior-inspection']);
    }else if(a==3){
      this.router.navigate(['/engine-inspection']);
    }else if(a==4){
      this.router.navigate(['/unit-photos']);
    }else{
      this.router.navigate(['/inspection-summary']);
    }
  }

}

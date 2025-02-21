import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-the-dashboard',
  templateUrl: './the-dashboard.component.html',
  styleUrls: ['./the-dashboard.component.scss']
})
export class TheDashboardComponent implements OnInit {
  HiThere: string = 'User';
  HiEmail: string = 'Email';
  
  constructor() { }

  ngOnInit(): void {

    this.HiThere = localStorage.getItem('username') || 'User';
    this.HiEmail = localStorage.getItem('email') || 'Email';

  }

}

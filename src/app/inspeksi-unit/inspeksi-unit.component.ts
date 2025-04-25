import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { InspectionItemResponse } from '../../assets/models/list-inspection.model';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';

@Component({
  selector: 'app-inspeksi-unit',
  templateUrl: './inspeksi-unit.component.html',
  styleUrls: ['./inspeksi-unit.component.scss']
})
export class InspeksiUnitComponent implements OnInit {
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
  subCategory: { [category: string]: string[] } = {};
  objectKeys = Object.keys;
  
  constructor(private router: Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
    this.showGrouping();
  }

  async showGrouping() {
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
        // this.groupedItems = this.groupItemsByCategory(this.sampleData);
        this.groupedSubItems = this.groupItemsByCategoryAndSubCategory(this.sampleData);
        this.subCategory = this.groupCategoriesAndSubCategories(this.sampleData);
        localStorage.setItem('subCategory', JSON.stringify(this.subCategory));

  
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

  groupItemsByCategory(data: any[]) {
    const groups: { [key: string]: any[] } = {};
    data.forEach(item => {
      const category = item.item_category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }


  groupItemsByCategoryAndSubCategory(data: any[]) {
    const groups: { [category: string]: { [subCategory: string]: any[] } } = {};
    const subgroups: { [category: string]: string[] } = {};
  
    data.forEach(item => {
      const category = item.item_category;
      const subCategory = item.item_sub_category;
      console.log(subCategory);
  
      if (!groups[category]) {
        groups[category] = {};
      }
  
      if (!groups[category][subCategory]) {
        groups[category][subCategory] = [];
      }
  
      groups[category][subCategory].push(item);
    });

    console.log(subgroups) ;
  
    return groups;
  }


  groupCategoriesAndSubCategories(data: any[]) {
    const groups: { [category: string]: string[] } = {};

    data.forEach(item => {
      const category = item.item_category;
      const subCategory = item.item_sub_category;
      // const subCategory = item.item_sub_category
      //   .toLowerCase()
      //   .replace(/\b\w/g, (char: string) => char.toUpperCase());

      if (!groups[category]) {
        groups[category] = [];
      }

      if (!groups[category].includes(subCategory)) {
        groups[category].push(subCategory);
      }
    });

    return groups;
  }

  GoesToInspection(a: any){
    const unit_id = this.router.url.split('/').pop();
    if(a==1){
      this.router.navigate(['/exterior-inspection' + '/' + unit_id]);
    }else if(a==2){
      this.router.navigate(['/interior-inspection' + '/' + unit_id]);
    }else if(a==3){
      this.router.navigate(['/engine-inspection' + '/' + unit_id]);
    }else if(a==4){
      this.router.navigate(['/unit-photos' + '/' + unit_id]);
    }else{
      this.router.navigate(['/inspection-summary' + '/' + unit_id]);
    }
  }

}

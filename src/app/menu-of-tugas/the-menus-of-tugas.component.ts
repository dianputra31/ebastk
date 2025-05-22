import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NoahService } from '../noah.service';
import { ApiVehicleTypeResponse } from 'src/assets/models/list-vehicle-tipe.model';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';

@Component({
  selector: 'app-the-menus-of-tugas',
  templateUrl: './the-menus-of-tugas.component.html',
  styleUrls: ['./the-menus-of-tugas.component.scss']
})
export class TheMenusOfTugasComponent implements OnInit {
  @Output() filterTugasChange = new EventEmitter<string>();

  activeChipIndex: number = 0; // Indeks chip yang aktif  
  isDropdownOpen: boolean = false;  
  isCategoryDropdownOpen: boolean = false;  
  isSortDropdownOpen: boolean = false;  
  inputValue: string = '';
  totalTugas: string = ''; // Menyimpan total tugas
  errlog: string = '';
  vehicletype: ApiVehicleTypeResponse | null = null
  isLoading: boolean = false;

  constructor(private noahService: NoahService, private apiClient: ApiClientService) { }

  ngOnInit(): void {

    this.noahService.totaltugas$.subscribe(totaltugas => {
      this.totalTugas = totaltugas;
    });

    this.showVehicleType();
  }

  setActiveChip(index: number) {  
    this.activeChipIndex = index;
    this.noahService.emitFilterStatus(this.activeChipIndex.toString());
  }  


  async showVehicleType() {

    this.errlog = "";
    try {
      const endpoint = `/unit-type`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiVehicleTypeResponse>(endpoint);
      if (response) {
        this.vehicletype = response;
      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }
    } catch (error) {
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

  
  toggleDropdown() {  
    this.isDropdownOpen = !this.isDropdownOpen;  
  } 

  toggleCategoryDropdown() {  
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;  
    this.isSortDropdownOpen = false;
  }  

  toggleSortDropdown() {  
    this.isSortDropdownOpen = !this.isSortDropdownOpen;  
    this.isCategoryDropdownOpen = false; 
  }  
  
  selectCategory(category: string) {  
    console.log('Selected category:', category);  
    this.isCategoryDropdownOpen = false; // Menutup dropdown setelah memilih kategori
    this.noahService.emitFilterCategories(category);
  }  
  
  selectSort(sortingBy: string) {
    this.noahService.emitFilterSort(sortingBy);
    console.log('Selected sortingBy:', sortingBy);  
    this.isSortDropdownOpen = false; // Menutup dropdown setelah memilih kategori  
    this.filterTugasChange.emit(sortingBy);

  }  


}

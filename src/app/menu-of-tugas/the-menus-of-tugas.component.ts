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
  selectedCategoryName: string = 'Semua Kategori';
  selectedSortName: string = 'Terbaru';

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

  goesToInputUnit(){
    window.location.href = '/unit-input';
  }


  async showVehicleType() {

    this.errlog = "";
    try {
      const endpoint = `/unit-type`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<ApiVehicleTypeResponse>(endpoint);
      if (response) {
        const allCategory = { id: 0, type_name: 'Semua Kategori' };
        this.vehicletype = {
          ...response,
          results: [allCategory, ...(response.results || [])]
        };
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
  

  selectCategory(categoryId: string) {
    const selected = this.vehicletype?.results.find(v => v.id.toString() === categoryId);
    this.selectedCategoryName = selected ? selected.type_name : 'Semua Kategori';
    this.isCategoryDropdownOpen = false;
    this.noahService.emitFilterCategories(categoryId);
  }

  selectSort(sortingBy: string) {
    this.noahService.emitFilterSort(sortingBy);
    this.selectedSortName = sortingBy=='desc'? 'Terbaru' : 'Terlama' ;
    this.isSortDropdownOpen = false; // Menutup dropdown setelah memilih kategori  
    this.filterTugasChange.emit(sortingBy);

  }  


}

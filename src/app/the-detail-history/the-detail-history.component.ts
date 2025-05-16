import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand, UnitDocument  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';
import { trigger, style, transition, animate, stagger, query, animateChild } from '@angular/animations';
import { ApiClientService } from '../services/api.client';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { ImageGalleryModalComponent } from '../image-gallery-modal/image-gallery-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoahService } from '../noah.service';

@Component({
  selector: 'app-the-detail-history',
  templateUrl: './the-detail-history.component.html',
  styleUrls: ['./the-detail-history.component.scss']
})
export class TheDetailHistoryComponent implements OnInit {
@Input() stepHistory: any;
expandedPanelIndex: number = 0; // Menyimpan index panel yang diperluas
@Output() panelChange = new EventEmitter<string>();
errlog:string = '';
sampleData: UnitDetailResponse | null = null;
sampleDataVendor: VendorDetailResponse | null = null;
currentDate: Date = new Date(); // Mendapatkan tanggal dan waktu saat ini
@Input() fromDashboard:any;
isButtonDisabled: boolean = false;
isLoading: boolean = false;
username: string = '';
password: string = '';
pic: string = '';
tgl_mobilisasi: string = '';
unit_id: any = '';
unitdocuments: UnitDocument[] = [];
bpkbDocuments: UnitDocument[] = [];
stnkDocuments: UnitDocument[] = [];
suratKuasaDocuments: UnitDocument[] = [];
bastkVendorDocuments: UnitDocument[] = [];
lainnyaDocuments: UnitDocument[] = [];
display_name: string = '';
@Output() noah = new EventEmitter<string>();


  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private modalService: NgbModal, private noahService: NoahService) { }

  ngOnInit(): void {
    this.infoUnit();
  }

  async infoUnit() {
  
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/detail-unit?unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<UnitDetailResponse>(endpoint);
      console.log('Data posted:', response.vendor.id);
      this.unit_id = unit_id;

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.vendor.id) {
        this.sampleData = response;  
        console.log('Sample Data:', this.sampleData);
        console.log('Unit Doc:', this.sampleData.unitdocuments);
        this.unitdocuments = this.sampleData.unitdocuments;
        this.display_name = this.sampleData.display_name;
        // this.bpkbDocuments: UnitDocument[] = this.unitdocuments.filter((document: UnitDocument) => document.file_type === 'BPKB');
        this.bpkbDocuments = this.unitdocuments.filter(doc => doc.file_type === 'BPKB');
        this.bastkVendorDocuments = this.unitdocuments.filter(doc => doc.file_type === 'BASTK');
        this.stnkDocuments = this.unitdocuments.filter(doc => doc.file_type === 'STNK');
        this.suratKuasaDocuments = this.unitdocuments.filter(doc => doc.file_type === 'SURATKUASA');
        this.lainnyaDocuments = this.unitdocuments.filter(doc => doc.file_type === 'LAINNYA');
        console.log('bpkbDocuments:', this.bpkbDocuments);

        /** NOAH HEADER */
        this.noahService.emitNoah(this.display_name);
        this.noahService.emitNoahLoc(this.sampleData.unit_location);
        this.noahService.emitNoahDate(this.sampleData.mobilization_units[0].mobiliztion.assignment_date);
        this.noahService.emitDoneBy(this.sampleData.mobilization_units[0].mobiliztion.pic);
        this.noahService.emitDoneDate(this.sampleData.mobilization_units[0].mobiliztion.assignment_date);

        // alert(this.sampleData.display_name);

        this.pic = this.sampleData.mobilization_units[0].mobiliztion.pic;
        const tgl_mobilisasi = this.sampleData.mobilization_units[0].mobiliztion.assignment_date;
        this.tgl_mobilisasi = tgl_mobilisasi.substring(0, 10);
        console.log('mobiliztion:', this.sampleData.mobilization_units[0].mobiliztion.first_published_at);
        console.log('tgl_mobilisasi:', this.tgl_mobilisasi);
        this.infoVendor(response.vendor.id);
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

  async infoVendor(id: number) {
  
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/vendor-detail?vendor_id=${id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<VendorDetailResponse>(endpoint);
      console.log('Data posted:', response);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.id) {
        this.sampleDataVendor = response;  
        console.log('Sample Data Vendor:', this.sampleDataVendor);
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


}

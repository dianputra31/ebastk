import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';
import { UnitDetailResponse, UnitDocument } from '../../assets/models/detail-unit.model'; // sesuaikan path
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-image-gallery-modal',
  templateUrl: './image-gallery-modal.component.html',
  styleUrls: ['./image-gallery-modal.component.scss']
})
export class ImageGalleryModalComponent implements OnInit{
@Input() carName: string = 'Mitsubishi Pajero';
// @Input() images: string[] = [];
@Input() images: UnitDocument[] = [];
@Input() unitId: any;
@Input() isViewOnly: boolean = false;
isModalOpen = true;
errlog: string = '';
tipeDoc: string = '';
displayedImages: string[] = [];
private mediaUrl = environment.mediaUrl;
sampleData: UnitDetailResponse | null = null;
unitdocuments: UnitDocument[] = [];
bpkbDocuments: UnitDocument[] = [];
stnkDocuments: UnitDocument[] = [];
ktpDocuments: UnitDocument[] = [];
suratKuasaDocuments: UnitDocument[] = [];
bastkVendorDocuments: UnitDocument[] = [];
lainnyaDocuments: UnitDocument[] = [];

constructor(public activeModal: NgbActiveModal, private apiClient: ApiClientService) {}

ngOnInit(): void {
  this.mbel();
}

mbel() {
  // Setiap kali input images berubah, update displayedImages
  console.log("tipeDoc::::", this.tipeDoc);
  console.log("images now::::", this.images);
  
  this.displayedImages = this.images.map(doc => this.mediaUrl + doc.image_url);
  console.log("displayedImages::::", this.displayedImages);
}

TutupModal() {
  this.activeModal.close();
  // window.location.reload();
}

selectedImageIndex = 0;

removeImageOld(index: number) {
  this.images.splice(index, 1);
  if (this.selectedImageIndex >= this.images.length) {
    this.selectedImageIndex = this.images.length - 1;
  }
}

  removeImage(index: number) {
    if (index < 0 || index >= this.images.length) return;

    const docToRemove = this.images[index];
    console.log("docToRemove.id::::", docToRemove.id);
    
    const endpoint = `/delete_document/?document_id=${docToRemove.id}`; // Menambahkan parameter ke endpoint

    this.apiClient.delete<any>(endpoint);

    // Hapus dari array images dan displayedImages secara bersamaan
    this.images.splice(index, 1);
    this.displayedImages.splice(index, 1);

    if (this.selectedImageIndex >= this.images.length) {
      this.selectedImageIndex = this.images.length - 1;
    }
  }

nextImageOld() {
  if (this.selectedImageIndex < this.images.length - 1) {
    this.selectedImageIndex++;
  }
}

nextImage() {
  if (this.selectedImageIndex < this.displayedImages.length - 1) {
    this.selectedImageIndex++;
  }
}

prevImageOld() {
  if (this.selectedImageIndex > 0) {
    this.selectedImageIndex--;
  }
}

prevImage() {
  if (this.selectedImageIndex > 0) {
    this.selectedImageIndex--;
  }
}

async onImageUpload(event: Event): Promise<boolean> {
  event.preventDefault();
  this.errlog = "";

  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    

    try {

      const file = input.files[0];
      console.log('Selected file:', file);
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(e.target.result); // Data URL base64
        this.selectedImageIndex = this.images.length - 1;
      };
      reader.readAsDataURL(input.files[0]);

        // Siapkan FormData untuk upload ke API
        const formData = new FormData();
        
        let endpoint: string;
        
        if (this.tipeDoc === 'KTP') {
          // Untuk KTP, gunakan endpoint dan param khusus
          formData.append('unit_id', this.unitId);
          formData.append('image', file);
          endpoint = `/upload-idcardsender/`;
        } else {
          // Untuk tipe dokumen lainnya
          formData.append('unit', this.unitId);
          formData.append('file', file);
          formData.append('file_type', this.tipeDoc);
          endpoint = `/upload-document/`;
        }

        // Kirim ke API
        const response = await this.apiClient.postDoc<any>(endpoint, formData);

        // Response KTP: {message: "...", unit_id: ...}
        // Response lainnya: {id: ..., unit_id: ..., file_type: ..., ...}
        if (response && (response.id || response.message)) {
          this.infoUnit();
          // return true;
        }else{
          console.log('here failed')
        }
        // return true;
      } catch (error) {
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
      console.error('Error upload:', error);
      // this.isLoading = false;
    }
    return false;

  }
  return false;
}


  async infoUnit() {
  
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.unitId; // Mengambil parameter terakhir dari URL
      const endpoint = `/detail-unit?unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<UnitDetailResponse>(endpoint);

      // Jika login berhasil, simpan data ke localStorage
      if (response) {
        this.sampleData = response;  
        this.unitdocuments = this.sampleData.unitdocuments;
        this.bpkbDocuments = this.unitdocuments.filter(doc => doc.file_type === 'BPKB');
        this.stnkDocuments = this.unitdocuments.filter(doc => doc.file_type === 'STNK');
        
        // Format khusus untuk KTP dengan struktur lengkap
        this.ktpDocuments = this.sampleData.idcardsender_url ? [{
          id: 1,
          file_type: 'KTP',
          image_url: this.sampleData.idcardsender_url
        } as UnitDocument] : [];
        
        this.bastkVendorDocuments = this.unitdocuments.filter(doc => doc.file_type === 'BASTK');
        this.suratKuasaDocuments = this.unitdocuments.filter(doc => doc.file_type === 'SURATKUASA');
        this.lainnyaDocuments = this.unitdocuments.filter(doc => doc.file_type === 'LAINNYA');

        if(this.tipeDoc=='BPKB'){
          this.images = this.bpkbDocuments;
        }else if(this.tipeDoc=='STNK'){
          this.images = this.stnkDocuments;
        }else if(this.tipeDoc=='SURATKUASA'){
          this.images = this.suratKuasaDocuments;
        }else if(this.tipeDoc=='BASTK'){
          this.images = this.bastkVendorDocuments;
        }else if(this.tipeDoc=='KTP'){
          this.images = this.ktpDocuments;
        }else{
          this.images = this.lainnyaDocuments;
        }
        this.mbel();

      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }

    } catch (error) {
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
    }
  }

}

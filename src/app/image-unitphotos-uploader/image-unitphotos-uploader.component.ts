import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import axios from 'axios';
import { ApiClientService } from '../services/api.client';

@Component({
  selector: 'app-image-unitphotos-uploader',
  templateUrl: './image-unitphotos-uploader.component.html',
  styleUrls: ['./image-unitphotos-uploader.component.scss']
})
export class ImageUnitPhotosUploaderComponent {
@Input() unitId: any;
@Input() labelDoc: any;
@Input() labelDesc: any;
@Output() reloadDisPage = new EventEmitter<string>();

errlog:string = '';

constructor(private apiClient: ApiClientService) {}

  imageUrl: string | null = null;

  async onFileSelected(event: any) {
  const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      try {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imageUrl = e.target.result;
            };
            reader.readAsDataURL(file);
                // Siapkan FormData untuk upload ke API
                const formData = new FormData();
                formData.append('unit', this.unitId); // atau pakai String(this.unit) kalau dynamic
                formData.append('file', file);
                formData.append('title', this.labelDoc);
                formData.append('descriptions', this.labelDesc);

                // Kirim ke API
                const endpoint = `/uploadsss-images/`; // Menambahkan parameter ke endpoint
                const response = await this.apiClient.postDoc<any>(endpoint, formData);

                if (response) {
                  console.log("HERE WE GO!")
                  this.reloadDisPage.emit();
                  return true;
                }else{
                  console.log('here failed')
                }
                return true;
          }

          }catch (error) {
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
          }


    }
     return false;
    
  }

}

import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UnitDetailResponse, Vendor, VariantModel, UnitImage, Color, Brand  } from '../../assets/models/detail-unit.model'; // Sesuaikan dengan path yang benar  
import { VendorDetailResponse } from '../../assets/models/vendor-detail.model';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';
import { trigger, style, transition, animate, stagger, query, animateChild } from '@angular/animations';
import { ApiClientService } from '../services/api.client';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageUnitPhotosModalComponent } from '../image-unitphotos-modal/image-unitphotos-modal.component';
import { InspectionItemResponse } from 'src/assets/models/list-inspection.model';

// const bagianLabels = {
//   bagianLuarDepan: 'Foto Depan',
//   bagianLuarDepanKanan: 'Foto Depan Kanan',
//   bagianLuarDepanKiri: 'Foto Depan Kiri',
//   bagianLuarBelakang: 'Foto Belakang',
//   bagianLuarBelakangKanan: 'Foto Belakang Kanan',
//   bagianLuarBelakangKiri: 'Foto Belakang Kiri',
// };


@Component({
  selector: 'app-photos-inspection',
  templateUrl: './photos-inspection.component.html',
  styleUrls: ['./photos-inspection.component.scss']
})


export class PhotosInspectionComponent implements OnInit {
expandedPanelIndex: number = 0; // Menyimpan index panel yang diperluas
@Output() panelChange = new EventEmitter<string>();
errlog:string = '';
sampleData: UnitDetailResponse | null = null;
sampleDataVendor: VendorDetailResponse | null = null;
currentDate: Date = new Date(); // Mendapatkan tanggal dan waktu saat ini
@Input() fromDashboard:any;
isButtonDisabled: boolean = false;
isLoading: boolean = false;
isSwapping: boolean = false;
username: string = '';
password: string = '';
unitimages: UnitImage[] = [];
// bagianDalam: UnitImage[] = [];
// bagianLuar: UnitImage[] = [];
// bagianMesin: UnitImage[] = [];
// bagianMinus: UnitImage[] = [];
// bagianSistem: UnitImage[] = [];
display_name: string = '';
unit_id: any = '';
displayedImagesLuar: string[] = [];
displayedImagesDalam: string[] = [];
displayedImagesMesin: string[] = [];
displayedImagesMinus: string[] = [];
displayedImagesSistem: string[] = [];
public mediaUrl = environment.mediaUrl;
bagianLuar: Record<string, any[]> = {};
bagianDalam: Record<string, any[]> = {};
bagianSistem: Record<string, any[]> = {};
bagianMinus: Record<string, any[]> = {};
bagianMesin: Record<string, any[]> = {};
bagianLuarKeys: string[] = [];
sampleDataEngine: any[] = [];
groupedSubItems: { [category: string]: { [subCategory: string]: any[] } } = {};
groupedItems: { [key: string]: any[] } = {};
isUploading: boolean = false;
uploadProgress = { current: 0, total: 0 };

  readonly bagianLuarDescriptions: string[] = [
    'Foto Depan',
    'Foto Depan Kanan',
    'Foto Depan Kiri',
    'Foto Belakang',
    'Foto Belakang Kanan',
    'Foto Belakang Kiri'
  ];

  readonly bagianDalamDescriptions: string[] = [
    'Foto Bagasi',
    'Foto Ban Serep',
    'Foto Interior Depan',
    'Foto Interior Tengah',
    'Foto Kilometer',
    'Foto Atap'
  ];

  readonly bagianMesinDescriptions: string[] = [
    'Foto Mesin',
    'Foto Noka (No. Rangka)',
    'Foto Nosin (No. Mesin)',
    'Gesekan Noka',
    'Gesekan Nosin'
  ];

  readonly bagianMinusDescriptions: string[] = [
    'Foto Minus 1',
    'Foto Minus 2',
    'Foto Minus 3',
    'Foto Minus 4',
    'Foto Minus 5',
    'Foto Minus 6',
    'Foto Minus 7',
    'Foto Minus 8',
    'Foto Minus 9',
    'Foto Minus 10'
  ];

  readonly bagianSistemDescriptions: string[] = [
    'Foto Depan',
    'Foto Depan Kanan',
    'Foto Depan Kiri',
    'Foto Belakang',
    'Foto Belakang Kanan',
    'Foto Belakang Kiri'
  ];

  bagianSistemDescriptionsSoon: string[] = [];


  readonly allDescriptions: string[] = [
    'Foto Depan',
    'Foto Depan Kanan',
    'Foto Depan Kiri',
    'Foto Belakang',
    'Foto Belakang Kanan',
    'Foto Belakang Kiri',
    'Foto Bagasi',
    'Foto Ban Serep',
    'Foto Interior Depan',
    'Foto Interior Tengah',
    'Foto Kilometer',
    'Foto Atap',
    'Foto Mesin',
    'Foto Noka (No. Rangka)',
    'Foto Nosin (No. Mesin)',
    'Gesekan Noka',
    'Gesekan Nosin'
  ];

  draggedImage: any = null;
draggedFromDesc: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiClient: ApiClientService, private modalService: NgbModal) { }
  imageUrl: string | null = null;

  ngOnInit(): void { 
    this.infoUnit();
    this.showGroupingExterior();
  }


  getTitleByDescription(desc: string): string {
    if ([
      'Foto Depan',
      'Foto Depan Kanan',
      'Foto Depan Kiri',
      'Foto Belakang',
      'Foto Belakang Kanan',
      'Foto Belakang Kiri'
    ].includes(desc)) {
      return 'Foto Bagian Luar (Exterior)';
    }
    if ([
      'Foto Bagasi',
      'Foto Ban Serep',
      'Foto Interior Depan',
      'Foto Interior Tengah',
      'Foto Kilometer',
      'Foto Atap'
    ].includes(desc)) {
      return 'Foto Bagian Dalam (Interior & Bagasi)';
    }
    if ([
      'Foto Mesin',
      'Foto Noka (No. Rangka)',
      'Foto Nosin (No. Mesin)',
      'Gesekan Noka',
      'Gesekan Nosin'
    ].includes(desc)) {
      return 'Foto Bagian Mesin';
    }
    return 'Lainnya';
  }




onDragStart(event: DragEvent, img: any, fromDesc: string) {
  this.draggedImage = img;
  this.draggedFromDesc = fromDesc;
  event.dataTransfer?.setData('text/plain', JSON.stringify({ imgId: img.id, fromDesc }));
}

onDragOver(event: DragEvent) {
  event.preventDefault();
}



async onDrop(event: DragEvent, toDesc: string) {
  event.preventDefault();

  if (!this.draggedImage || !this.draggedFromDesc || this.draggedFromDesc === toDesc) return;

  // Deteksi kategori asal dan tujuan
  let fromCategory: Record<string, any[]> | undefined;
  let toCategory: Record<string, any[]> | undefined;

  if (this.bagianLuarDescriptions.includes(this.draggedFromDesc)) fromCategory = this.bagianLuar;
  else if (this.bagianDalamDescriptions.includes(this.draggedFromDesc)) fromCategory = this.bagianDalam;
  else if (this.bagianMesinDescriptions.includes(this.draggedFromDesc)) fromCategory = this.bagianMesin;
  else if (this.bagianMinusDescriptions.includes(this.draggedFromDesc)) fromCategory = this.bagianMinus;
  else if (this.bagianSistemDescriptions.includes(this.draggedFromDesc)) fromCategory = this.bagianSistem;

  if (this.bagianLuarDescriptions.includes(toDesc)) toCategory = this.bagianLuar;
  else if (this.bagianDalamDescriptions.includes(toDesc)) toCategory = this.bagianDalam;
  else if (this.bagianMesinDescriptions.includes(toDesc)) toCategory = this.bagianMesin;
  else if (this.bagianMinusDescriptions.includes(toDesc)) toCategory = this.bagianMinus;
  else if (this.bagianSistemDescriptions.includes(toDesc)) toCategory = this.bagianSistem;

  if (!fromCategory || !toCategory) return;

  const fromArr = fromCategory[this.draggedFromDesc];
  const toArr = toCategory[toDesc];

  if (!fromArr || !toArr) return;

  // Ambil index gambar yang di-drag
  const idxFrom = fromArr.findIndex(img => img.id === this.draggedImage.id);

  // Ambil gambar pertama di tujuan (jika ada)
  const swappedImage = toArr.length > 0 ? toArr[0] : null;

  // Proses swap
  if (idxFrom > -1) {
    const [movedImg] = fromArr.splice(idxFrom, 1);

    if (swappedImage) {
      toArr.splice(0, 1);
      fromArr.push(swappedImage);
      swappedImage.descriptions = this.draggedFromDesc;
    }

    toArr.push(movedImg);
    movedImg.descriptions = toDesc;
  }

  // Panggil API untuk update posisi kedua gambar (jika swap)
  try {
    this.isSwapping = true;
    const endpoint = `/move-image/`;
    const payloads = [
      {
        from_image_id: this.draggedImage.id,
        to_image_id: swappedImage ? swappedImage.id : null,
        from_desc: this.draggedFromDesc,
        to_desc: toDesc,
        unit_id: this.unit_id
      }
    ];
    // Jika swap, bisa tambahkan payload kedua (optional, sesuai backend)
    // if (swappedImage) {
    //   payloads.push({
    //     from_image_id: swappedImage.id,
    //     to_image_id: this.draggedImage.id,
    //     from_desc: toDesc,
    //     to_desc: this.draggedFromDesc,
    //     unit_id: this.unit_id
    //   });
    // }
    await Promise.all(payloads.map(payload => this.apiClient.post<any>(endpoint, payload)));
    this.isSwapping = false;
  } catch (error) {
    console.error('Gagal swap gambar:', error);
  }

  this.draggedImage = null;
  this.draggedFromDesc = '';
}



async aplotMultipleMinus(event: any) {
  // Hapus semua foto minus lama
  const ids = this.getAllUnitImageIds(0);
  await Promise.all(ids.map(id => this.removeOldImage(id)));

  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const files: FileList = input.files;
  this.isUploading = true;
  this.uploadProgress = { current: 0, total: files.length };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const desc = `Foto Minus ${i + 1}`; // Descriptions dinamis
    const lab = 'Foto Kerusakan/Kekurangan Unit (Minus)';

    const formData = new FormData();
    formData.append('unit', this.unit_id);
    formData.append('file', file);
    formData.append('title', lab);
    formData.append('descriptions', desc);

    try {
      const endpoint = `/upload-images/`;
      await this.apiClient.postDoc<any>(endpoint, formData);
      this.uploadProgress.current = i + 1;
    } catch (error) {
      console.error('Upload gagal:', error);
    }
  }

  this.isUploading = false;
  this.uploadProgress = { current: 0, total: 0 };
  this.infoUnit();
}

async aplotMultiple(event: any) {
  // Hapus semua foto lama, tunggu sampai selesai semua
  const ids = this.getAllUnitImageIds(1);
  await Promise.all(ids.map(id => this.removeOldImage(id)));

  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const files: FileList = input.files;
  this.isUploading = true;
  this.uploadProgress = { current: 0, total: files.length };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const desc = this.allDescriptions[i] || `Foto ${i + 1}`;
    const lab = this.getTitleByDescription(desc);

    const formData = new FormData();
    formData.append('unit', this.unit_id);
    formData.append('file', file);
    formData.append('title', lab);
    formData.append('descriptions', desc);

    try {
      const endpoint = `/upload-images/`;
      await this.apiClient.postDoc<any>(endpoint, formData);
      
      // Tambahan endpoint untuk 'Foto Depan'
      if (desc === 'Foto Depan') {
        const formDataThumbnail = new FormData();
        formDataThumbnail.append('unit_id', this.unit_id); // atau pakai String(this.unit) kalau dynamic
        formDataThumbnail.append('image', file);
        const thumbnailEndpoint = `/upload-thumbnail/`;
        await this.apiClient.postDoc<any>(thumbnailEndpoint, formDataThumbnail);
      }
      
      this.uploadProgress.current = i + 1;
    } catch (error) {
      console.error('Upload gagal:', error);
    }
  }

  this.isUploading = false;
  this.uploadProgress = { current: 0, total: 0 };
  this.infoUnit();
}


  async showGroupingExterior() {

    this.errlog = "";

    try {
      this.isLoading = true;
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/get-detail?unit_id=${unit_id}`; // Endpoint API
      const response = await this.apiClient.get<InspectionItemResponse>(endpoint);
      if (Array.isArray(response)) {
        this.sampleDataEngine = response;
        // Kelompokkan berdasarkan item_category
        this.groupedSubItems = this.groupItemsByCategoryAndSubCategory(this.sampleDataEngine);
        // console.log('Grouped Items:', this.groupedSubItems);
       console.log('GroupedSubItems:', this.groupedSubItems);
       console.log('Engine group:', this.groupedSubItems['Engine']);

        const engineGroup = this.groupedSubItems['Engine'];
        const engineArray = Array.isArray(engineGroup) ? engineGroup : Object.values(engineGroup)[0];
        const firstEngineItem = engineArray[0];
        console.log('First Engine Item:', firstEngineItem);

        const payload = {
          unit_id: unit_id,   // ini dari URL tadi
          bastk_status: "draft",
          questions: [
            {
              bastk_item_id: firstEngineItem.id,
              kondisi: firstEngineItem.kondisi,
              options: firstEngineItem.options
            }
          ]
        };

        console.log('One of Old Payload:', payload);

        localStorage.setItem('enginePayload', JSON.stringify(payload));

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
    }
    this.isLoading = false;
  }

  groupItemsByCategoryAndSubCategory(data: any[]) {
    const groups: { [category: string]: { [subCategory: string]: any[] } } = {};

    data.forEach(item => {
      const category = item.item_category;
      const subCategory = item.item_sub_category;

      if (!groups[category]) {
        groups[category] = {};
      }

      if (!groups[category][subCategory]) {
        groups[category][subCategory] = [];
      }

      groups[category][subCategory].push(item);
    });

    return groups;
  }



  mapBagianLuar(): void {
    this.bagianLuar = {};

    for (const desc of this.bagianLuarDescriptions) {
      this.bagianLuar[desc] = this.unitimages
        .filter(doc => doc.title === 'Foto Bagian Luar (Exterior)' && doc.descriptions === desc);
    }
  }

  mapBagianDalam(): void {
    this.bagianDalam = {};

    for (const desc of this.bagianDalamDescriptions) {
      this.bagianDalam[desc] = this.unitimages
        .filter(doc => doc.title === 'Foto Bagian Dalam (Interior & Bagasi)' && doc.descriptions === desc);
    }
  }

  mapBagianMesin(): void {
    this.bagianMesin = {};

    for (const desc of this.bagianMesinDescriptions) {
      this.bagianMesin[desc] = this.unitimages
        .filter(doc => doc.title === 'Foto Bagian Mesin' && doc.descriptions === desc);
    }
  }

mapBagianMinus(): void {
  // Kumpulkan semua foto minus tanpa batasan descriptions
  this.bagianMinus = {};
  const minusImages = this.unitimages
    .filter(doc => doc.title === 'Foto Kerusakan/Kekurangan Unit (Minus)')
    .sort((a, b) => {
      // Ambil angka dari descriptions, default ke 0 jika tidak ada angka
      const numA = parseInt((a.descriptions || '').replace(/\D/g, ''), 10) || 0;
      const numB = parseInt((b.descriptions || '').replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
  this.bagianMinus['all'] = minusImages;
}

  mapBagianSistem(): void {
    this.bagianSistem = {};

    for (const desc of this.bagianSistemDescriptions) {
      this.bagianSistem[desc] = this.unitimages
        .filter(doc => doc.title === 'Foto Sistem' && doc.descriptions === desc);
    }
  }

  mapBagianSistemSoon(): void{
    const sistemImages = this.unitimages.filter(doc => doc.title === null);

    this.bagianSistem = {};
    this.bagianSistemDescriptionsSoon = [];

    for (const img of sistemImages) {
      const desc = img.descriptions;

      if (!this.bagianSistem[desc]) {
        this.bagianSistem[desc] = [];
        this.bagianSistemDescriptions.push(desc);
      }

      this.bagianSistem[desc].push(img);
    }
  }


  async infoUnit() {
    this.isLoading = true;
    const unitData = {
      page: '1'
    };
    this.errlog = "";
    try {
      const page = 1; // Parameter yang ingin dikirim
      const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
      const endpoint = `/detail-unit?unit_id=${unit_id}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.getOther<UnitDetailResponse>(endpoint);
      this.unit_id = unit_id;
      console.log('Data posted:', response.vendor.id);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.vendor.id) {
        // this.bagianLuarKeys = Object.keys(bagianLabels);
        // this.bagianLuarLabel = bagianLabels;

        this.sampleData = response;  
        console.log('Sample Data:', this.sampleData);
        console.log('Unit Photos:', this.sampleData.unitimages);
        this.unitimages = this.sampleData.unitimages;
        this.display_name = this.sampleData.display_name;

        // this.regroupBagianLuar();
        this.mapBagianLuar();
        this.mapBagianDalam();
        this.mapBagianMesin();
        this.mapBagianMinus();
        this.mapBagianSistem();
        // this.bagianLuar = this.unitimages.filter(doc => doc.title === null);
        // this.bagianLuarDepan = this.unitimages.filter(doc => doc.title === 'Foto Bagian Luar (Exterior)' && doc.descriptions === 'Foto Depan');
        // this.bagianLuarDepanKanan = this.unitimages.filter(doc => doc.title === 'Foto Bagian Luar (Exterior)' && doc.descriptions === 'Foto Depan Kanan');
        // this.bagianLuarDepanKiri = this.unitimages.filter(doc => doc.title === 'Foto Bagian Luar (Exterior)' && doc.descriptions === 'Foto Depan Kiri');
        // this.bagianLuarBelakang = this.unitimages.filter(doc => doc.title === 'Foto Bagian Luar (Exterior)' && doc.descriptions === 'Foto Belakang');
        // this.bagianLuarBelakangKanan = this.unitimages.filter(doc => doc.title === 'Foto Bagian Luar (Exterior)' && doc.descriptions === 'Foto Belakang Kanan');
        // this.bagianLuarBelakangKiri = this.unitimages.filter(doc => doc.title === 'Foto Bagian Luar (Exterior)' && doc.descriptions === 'Foto Belakang Kiri');

        // this.bagianLuar = this.unitimages.filter(doc => doc.title === 'Foto Bagian Luar (Exterior)').reduce((acc, doc) => {
        //   if (!acc[doc.descriptions]) acc[doc.descriptions] = [];
        //   acc[doc.descriptions].push(doc);
        //   return acc;
        // }, {} as Record<string, any[]>);
        // this.bagianLuarKeys = Object.keys(this.bagianLuar);

        // // this.bagianLuar = this.unitimages.filter(doc => doc.title === 'Foto Bagian Luar (Exterior)');
        // this.displayedImagesLuar = this.bagianLuar.map(doc => this.mediaUrl + doc.image_url);
        // console.log("displayedImagesLuar::::::", this.bagianLuar)

        // this.bagianDalam = this.unitimages.filter(doc => doc.title === null);
        // this.bagianDalam = this.unitimages.filter(doc => doc.title === 'Foto Bagian Dalam (Interior & Bagasi)');
        // this.displayedImagesDalam = this.bagianDalam.map(doc => this.mediaUrl + doc.image_url);

        // this.bagianMesin = this.unitimages.filter(doc => doc.title === 'Foto Bagian Mesin');
        // this.displayedImagesMesin = this.bagianMesin.map(doc => this.mediaUrl + doc.image_url);

        // this.bagianMinus = this.unitimages.filter(doc => doc.title === 'Foto Kerusakan/Kekurangan Unit (Minus)');
        // this.displayedImagesMesin = this.bagianMinus.map(doc => this.mediaUrl + doc.image_url);

        // this.bagianSistem = this.unitimages.filter(doc => doc.title === 'Foto Sistem');
        // this.displayedImagesSistem = this.bagianSistem.map(doc => this.mediaUrl + doc.image_url);

        // this.infoVendor(response.vendor.id);
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
    this.isLoading = false;
  }


getAllUnitImageIds(filterType: 0 | 1 = 1): number[] {
  if (!this.sampleData || !Array.isArray(this.sampleData.unitimages)) {
    return [];
  }
  return this.sampleData.unitimages
    .filter(img => {
      if (filterType === 0) {
        // Hanya title "Foto Kerusakan/Kekurangan Unit (Minus)"
        return img.title === 'Foto Kerusakan/Kekurangan Unit (Minus)';
      } else {
        // Selain title "Foto Kerusakan/Kekurangan Unit (Minus)"
        return img.title !== 'Foto Kerusakan/Kekurangan Unit (Minus)';
      }
    })
    .filter(img => typeof img.id === 'number')
    .map(img => img.id);
}


    async openGallery(a:string) {

    try{
      this.infoUnit();

          const modalRef = this.modalService.open(ImageUnitPhotosModalComponent, { size: 'lg' });
          modalRef.componentInstance.carName = this.display_name;
          modalRef.componentInstance.unitId = this.unit_id;
          modalRef.componentInstance.tipeDoc = a;

          if(a=='1'){
            modalRef.componentInstance.images = this.bagianLuar;
          }else if(a=='2'){
            modalRef.componentInstance.images = this.bagianDalam;
          }else if(a=='3'){
            modalRef.componentInstance.images = this.bagianMesin;
          }else if(a=='4'){
            modalRef.componentInstance.images = this.bagianMinus;
          }else{
            modalRef.componentInstance.images = this.bagianSistem;
          }
    }catch (error) {
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



async removeImage(index: number) {
    
    
    try{
      const endpoint = `/delete_image/?image_id=${index}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.delete<any>(endpoint);
      if (response) {
        this.infoUnit();
        // window.location.reload();
        return true;
      }else{
        console.log('here failed')
      }
      return true;

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
      return false;
  }

async removeOldImage(index: number) {
    
    
    try{
      const endpoint = `/delete_image/?image_id=${index}`; // Menambahkan parameter ke endpoint
      const response = await this.apiClient.delete<any>(endpoint);
      if (response) {
        // this.infoUnit();
        // window.location.reload();
        console.log('image has been deleted')
        return true;
      }else{
        console.log('here failed')
      }
      return true;

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
      return false;
  }





async aplot(event: any, desc: string, lab:string) {
  // console.log("HHHHH::::",desc);
  // console.log("CCCC::::",lab);
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
                formData.append('unit', this.unit_id); // atau pakai String(this.unit) kalau dynamic
                formData.append('file', file);
                formData.append('title', lab);
                formData.append('descriptions', desc);


                // Kirim ke API
                const endpoint = `/upload-images/`; // Menambahkan parameter ke endpoint

                // window.location.reload();
                const response = await this.apiClient.postDoc<any>(endpoint, formData);

                if (desc === 'Foto Depan') {
                  const formDataThumbnail = new FormData();
                  formDataThumbnail.append('unit_id', this.unit_id); // atau pakai String(this.unit) kalau dynamic
                  formDataThumbnail.append('image', file);
                  const thumbnailEndpoint = `/upload-thumbnail/`;
                  await this.apiClient.postDoc<any>(thumbnailEndpoint, formDataThumbnail);
                }

                if (response) {
                  // console.log("HERE WE GO!")
                  this.infoUnit();
                  return true;
                }else{
                  console.log('here failed')
                }
                // return true;
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



sanitize(desc: string): string {
  return desc.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}


}

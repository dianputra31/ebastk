import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-gallery-modal',
  templateUrl: './image-gallery-modal.component.html',
  styleUrls: ['./image-gallery-modal.component.scss']
})
export class ImageGalleryModalComponent {
  @Input() carName: string = 'Mitsubishi Pajero';
  @Input() images: string[] = [];
  isModalOpen = true;

  constructor(public activeModal: NgbActiveModal) {}


  TutupModal() {
    this.activeModal.close();
  }
  
  selectedImageIndex = 0;

  removeImage(index: number) {
    this.images.splice(index, 1);
    if (this.selectedImageIndex >= this.images.length) {
      this.selectedImageIndex = this.images.length - 1;
    }
  }

  nextImage() {
    if (this.selectedImageIndex < this.images.length - 1) {
      this.selectedImageIndex++;
    }
  }

  prevImage() {
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    }
  }

  onImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.images.push(e.target.result); // Data URL base64
      this.selectedImageIndex = this.images.length - 1;
    };
    reader.readAsDataURL(input.files[0]);
  }
}


}

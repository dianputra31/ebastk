import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-the-modal',
  templateUrl: './the-modal.component.html',
  styleUrls: ['./the-modal.component.scss']
})
export class TheModalComponent {
  @Input() isOpen: boolean = false; // Untuk mengontrol apakah modal terbuka
  @Input() message: string = ''; // Pesan yang akan ditampilkan
  @Input() message2: string = ''; // Pesan yang akan ditampilkan
  @Input() imageUrl: string = '../../assets/icons/alert-circle.svg'; // URL gambar yang akan ditampilkan
  @Output() confirm = new EventEmitter<void>(); // Event emitter untuk konfirmasi
  @Output() close = new EventEmitter<void>(); // Event untuk menutup modal

  closeModal() {
    this.isOpen = false; // Set status modal ke false
    this.close.emit(); // Emit event untuk memberi tahu komponen parent
  }
  onConfirm() {
    this.confirm.emit(); // Emit event ketika tombol diklik
    this.closeModal(); // Tutup modal
  }

}

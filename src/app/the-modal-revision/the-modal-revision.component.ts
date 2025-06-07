import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-the-modal-revision',
  templateUrl: './the-modal-revision.component.html',
  styleUrls: ['./the-modal-revision.component.scss']
})
export class TheModalRevisionComponent {
  @Input() showButtonNope: boolean = true; // Untuk mengontrol apakah modal terbuka
  @Input() showButtonYeah: boolean = true; // Untuk mengontrol apakah modal terbuka
  @Input() isOpen: boolean = false; // Untuk mengontrol apakah modal terbuka
  @Input() message: string = ''; // Pesan yang akan ditampilkan
  @Input() message2: string = ''; // Pesan tambahan
  @Input() imageUrl: string = '../../assets/icons/alert-circle.svg'; // URL gambar yang akan ditampilkan
  @Input() payload: any = null; // Tambahkan properti untuk menerima payload dari parent
  @Output() confirm = new EventEmitter<string>(); // Event emitter untuk konfirmasi
  @Output() close = new EventEmitter<void>(); // Event untuk menutup modal
  alasan: string = '';
  alerta: string = '';

  closeModal() {
    this.isOpen = false; // Set status modal ke false
    this.close.emit(); // Emit event untuk memberi tahu komponen parent
  }

  onConfirm() {
    // this.confirm.emit(); // Emit event ketika tombol diklik
    // this.closeModal(); // Tutup modal

    if (!this.alasan || this.alasan.trim() === '') {
      this.alerta = 'Anda harus mengisi alasan pengajuan revisi!';
      return;
    }
    // Lanjutkan emit event atau logic lain
    this.confirm.emit(this.alasan);
    
  }
}
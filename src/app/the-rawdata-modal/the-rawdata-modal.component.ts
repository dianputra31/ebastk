import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-the-rawdata-modal',
  templateUrl: './the-rawdata-modal.component.html',
  styleUrls: ['./the-rawdata-modal.component.scss']
})
export class TheRawdataModalComponent {

  @Input() datamobilisasi: any;  
  @Output() close = new EventEmitter<void>();
  @Output() selectCopas = new EventEmitter<any>();

  constructor(private snackBar: MatSnackBar) {}

  onClose() {
    this.close.emit();
  }

  onSelect(item: any) {
    this.selectCopas.emit(item);
  }

  copyAndClose(value: any) {
    const text = String(value);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Disalin: ' + text);
        setTimeout(() => this.close.emit(), 800); // kasih jeda biar toast kebaca
      });
    } else {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      this.showToast('Disalin: ' + text);
      setTimeout(() => this.close.emit(), 800);
    }
  }

  private showToast(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['toast-success']
    });
  }



}

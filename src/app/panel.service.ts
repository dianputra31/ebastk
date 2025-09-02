// noah.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PanelSyncService {
  private panelSubject = new Subject<string>();
  panel$ = this.panelSubject.asObservable();

  emitPanel(panelId: string) {
    this.panelSubject.next(panelId);
  }
}
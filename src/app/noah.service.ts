// noah.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class NoahService {
  private noahSubject = new Subject<string>();
  private noahlocSubject = new Subject<string>();
  private noahdateSubject = new Subject<string>();
  private noahdonebySubject = new Subject<string>();
  private noahdonedateSubject = new Subject<string>();
  noah$ = this.noahSubject.asObservable();
  noahloc$ = this.noahlocSubject.asObservable();
  noahdate$ = this.noahdateSubject.asObservable();
  noahdoneby$ = this.noahdonebySubject.asObservable();
  noahdonedate$ = this.noahdonedateSubject.asObservable();

  emitNoah(value: string) {
    this.noahSubject.next(value);
  }

  emitNoahLoc(value: string) {
    this.noahlocSubject.next(value);
  }

  emitNoahDate(value: string) {
    this.noahdateSubject.next(value);
  }

  emitDoneBy(value: string) {
    this.noahdonebySubject.next(value);
  }

  emitDoneDate(value: string) {
    this.noahdonedateSubject.next(value);
  }



}

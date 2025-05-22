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
  private filterRiwayatSubject = new Subject<string>();
  private filterStatusSubject = new Subject<string>();
  private filterCategorySubject = new Subject<string>();
  private filterSortSubject = new Subject<string>();
  private totalTugasSubject = new Subject<string>();
  noah$ = this.noahSubject.asObservable();
  noahloc$ = this.noahlocSubject.asObservable();
  noahdate$ = this.noahdateSubject.asObservable();
  noahdoneby$ = this.noahdonebySubject.asObservable();
  noahdonedate$ = this.noahdonedateSubject.asObservable();
  filterriwayat$ = this.filterRiwayatSubject.asObservable();
  filterstatus$ = this.filterStatusSubject.asObservable();
  filtercategory$ = this.filterCategorySubject.asObservable();
  filtersort$ = this.filterSortSubject.asObservable();
  totaltugas$ = this.totalTugasSubject.asObservable();

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

  emitFilterRiwayat(value: string) {
    this.filterRiwayatSubject.next(value);
  }

  emitFilterStatus(value: string) {
    this.filterStatusSubject.next(value);
  }

  emitFilterCategories(value: string) {
    this.filterCategorySubject.next(value);
  }

  emitTotalTugas(value: number) {
    this.totalTugasSubject.next(value.toString());
  }

  emitFilterSort(value: string) {
    this.filterSortSubject.next(value);
  }



}

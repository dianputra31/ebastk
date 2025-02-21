import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRiwayatComponent } from './filter-riwayat.component';

describe('FilterRiwayatComponent', () => {
  let component: FilterRiwayatComponent;
  let fixture: ComponentFixture<FilterRiwayatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterRiwayatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterRiwayatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

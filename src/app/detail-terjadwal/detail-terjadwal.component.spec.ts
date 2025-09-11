import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTerjadwalComponent } from './detail-terjadwal.component';

describe('DetailTerjadwalComponent', () => {
  let component: DetailTerjadwalComponent;
  let fixture: ComponentFixture<DetailTerjadwalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTerjadwalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTerjadwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

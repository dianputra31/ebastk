import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetilTerjadwalComponent } from './the-detil-terjadwal.component';

describe('TheDetilTugasComponent', () => {
  let component: TheDetilTerjadwalComponent;
  let fixture: ComponentFixture<TheDetilTerjadwalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetilTerjadwalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetilTerjadwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

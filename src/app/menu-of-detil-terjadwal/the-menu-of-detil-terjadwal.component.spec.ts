import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheMenuOfDetilTerjadwalComponent } from './the-menu-of-detil-terjadwal.component';

describe('TheMenuOfDetilTerjadwalComponent', () => {
  let component: TheMenuOfDetilTerjadwalComponent;
  let fixture: ComponentFixture<TheMenuOfDetilTerjadwalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheMenuOfDetilTerjadwalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheMenuOfDetilTerjadwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

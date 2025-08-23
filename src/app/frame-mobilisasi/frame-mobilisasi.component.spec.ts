import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameMobilisasiComponent } from './frame-mobilisasi.component';

describe('FrameMobilisasiComponent', () => {
  let component: FrameMobilisasiComponent;
  let fixture: ComponentFixture<FrameMobilisasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrameMobilisasiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameMobilisasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

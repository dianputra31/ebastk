import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheVendorModalComponent } from './the-vendor-modal.component';

describe('TheVendorModalComponent', () => {
  let component: TheVendorModalComponent;
  let fixture: ComponentFixture<TheVendorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheVendorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheVendorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

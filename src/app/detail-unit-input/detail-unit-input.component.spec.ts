import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUnitInputComponent } from './detail-unit-input.component';

describe('DetailUnitInputComponent', () => {
  let component: DetailUnitInputComponent;
  let fixture: ComponentFixture<DetailUnitInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailUnitInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailUnitInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

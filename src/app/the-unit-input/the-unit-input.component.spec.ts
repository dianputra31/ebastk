import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheUnitInputComponent } from './the-unit-input.component';

describe('TheUnitInputComponent', () => {
  let component: TheUnitInputComponent;
  let fixture: ComponentFixture<TheUnitInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheUnitInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheUnitInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

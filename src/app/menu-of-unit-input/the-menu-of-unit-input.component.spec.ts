import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheMenuOfUnitInputComponent } from './the-menu-of-unit-input.component';

describe('TheMenuOfUnitInputComponent', () => {
  let component: TheMenuOfUnitInputComponent;
  let fixture: ComponentFixture<TheMenuOfUnitInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheMenuOfUnitInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheMenuOfUnitInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

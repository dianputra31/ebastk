import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOfExteriorInspectionComponent } from './menu-of-exterior-inspection.component';

describe('MenuOfExteriorInspectionComponent', () => {
  let component: MenuOfExteriorInspectionComponent;
  let fixture: ComponentFixture<MenuOfExteriorInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOfExteriorInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOfExteriorInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

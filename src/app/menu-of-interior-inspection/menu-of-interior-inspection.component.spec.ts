import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOfInteriorInspectionComponent } from './menu-of-interior-inspection.component';

describe('MenuOfInteriorInspectionComponent', () => {
  let component: MenuOfInteriorInspectionComponent;
  let fixture: ComponentFixture<MenuOfInteriorInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOfInteriorInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOfInteriorInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

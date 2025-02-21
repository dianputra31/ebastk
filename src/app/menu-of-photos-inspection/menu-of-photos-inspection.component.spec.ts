import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOfPhotosInspectionComponent } from './menu-of-photos-inspection.component';

describe('MenuOfPhotosInspectionComponent', () => {
  let component: MenuOfPhotosInspectionComponent;
  let fixture: ComponentFixture<MenuOfPhotosInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOfPhotosInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOfPhotosInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

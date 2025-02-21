import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOfEngineInspectionComponent } from './menu-of-engine-inspection.component';

describe('MenuOfEngineInspectionComponent', () => {
  let component: MenuOfEngineInspectionComponent;
  let fixture: ComponentFixture<MenuOfEngineInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOfEngineInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOfEngineInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

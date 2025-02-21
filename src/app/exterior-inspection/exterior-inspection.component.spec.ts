import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExteriorInspectionComponent } from './exterior-inspection.component';

describe('ExteriorInspectionComponent', () => {
  let component: ExteriorInspectionComponent;
  let fixture: ComponentFixture<ExteriorInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExteriorInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExteriorInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

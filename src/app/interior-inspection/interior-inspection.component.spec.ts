import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteriorInspectionComponent } from './interior-inspection.component';

describe('InteriorInspectionComponent', () => {
  let component: InteriorInspectionComponent;
  let fixture: ComponentFixture<InteriorInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteriorInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteriorInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

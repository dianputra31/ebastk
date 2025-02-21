import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineInspectionComponent } from './engine-inspection.component';

describe('EngineInspectionComponent', () => {
  let component: EngineInspectionComponent;
  let fixture: ComponentFixture<EngineInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionDoneComponent } from './inspection-done.component';

describe('InspectionDoneComponent', () => {
  let component: InspectionDoneComponent;
  let fixture: ComponentFixture<InspectionDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionDoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosInspectionComponent } from './photos-inspection.component';

describe('PhotosInspectionComponent', () => {
  let component: PhotosInspectionComponent;
  let fixture: ComponentFixture<PhotosInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotosInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

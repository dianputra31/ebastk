import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUnitPhotosUploaderComponent } from './image-unitphotos-uploader.component';

describe('ImageUploaderComponent', () => {
  let component: ImageUnitPhotosUploaderComponent;
  let fixture: ComponentFixture<ImageUnitPhotosUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageUnitPhotosUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUnitPhotosUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

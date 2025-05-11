import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUnitPhotosModalComponent } from './image-unitphotos-modal.component';

describe('ImageGalleryModalComponent', () => {
  let component: ImageUnitPhotosModalComponent;
  let fixture: ComponentFixture<ImageUnitPhotosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageUnitPhotosModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUnitPhotosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

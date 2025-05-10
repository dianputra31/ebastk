import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGalleryModalComponent } from './image-gallery-modal.component';

describe('ImageGalleryModalComponent', () => {
  let component: ImageGalleryModalComponent;
  let fixture: ComponentFixture<ImageGalleryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageGalleryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageGalleryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

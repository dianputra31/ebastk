import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetailHistoryPhotosComponent } from './the-detail-history-photos.component';

describe('TheDetailHistoryPhotosComponent', () => {
  let component: TheDetailHistoryPhotosComponent;
  let fixture: ComponentFixture<TheDetailHistoryPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetailHistoryPhotosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetailHistoryPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

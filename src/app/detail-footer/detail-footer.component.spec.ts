import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFooterComponent } from './detail-footer.component';

describe('DetailFooterComponent', () => {
  let component: DetailFooterComponent;
  let fixture: ComponentFixture<DetailFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetailHistoryFooterComponent } from './the-detail-history-footer.component';

describe('TheDetailHistoryFooterComponent', () => {
  let component: TheDetailHistoryFooterComponent;
  let fixture: ComponentFixture<TheDetailHistoryFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetailHistoryFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetailHistoryFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

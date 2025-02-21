import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetailHistoryInteriorComponent } from './the-detail-history-interior.component';

describe('TheDetailHistoryInteriorComponent', () => {
  let component: TheDetailHistoryInteriorComponent;
  let fixture: ComponentFixture<TheDetailHistoryInteriorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetailHistoryInteriorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetailHistoryInteriorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

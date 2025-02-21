import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetailHistoryInfoComponent } from './the-detail-history-info.component';

describe('TheDetailHistoryInfoComponent', () => {
  let component: TheDetailHistoryInfoComponent;
  let fixture: ComponentFixture<TheDetailHistoryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetailHistoryInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetailHistoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

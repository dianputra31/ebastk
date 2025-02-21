import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetailHistoryComponent } from './the-detail-history.component';

describe('TheDetailHistoryComponent', () => {
  let component: TheDetailHistoryComponent;
  let fixture: ComponentFixture<TheDetailHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetailHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetailHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

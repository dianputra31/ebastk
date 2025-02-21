import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetailHistoryExteriorComponent } from './the-detail-history-exterior.component';

describe('TheDetailHistoryExteriorComponent', () => {
  let component: TheDetailHistoryExteriorComponent;
  let fixture: ComponentFixture<TheDetailHistoryExteriorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetailHistoryExteriorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetailHistoryExteriorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

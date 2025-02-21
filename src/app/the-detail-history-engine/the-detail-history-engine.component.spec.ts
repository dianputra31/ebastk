import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetailHistoryEngineComponent } from './the-detail-history-engine.component';

describe('TheDetailHistoryEngineComponent', () => {
  let component: TheDetailHistoryEngineComponent;
  let fixture: ComponentFixture<TheDetailHistoryEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetailHistoryEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetailHistoryEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

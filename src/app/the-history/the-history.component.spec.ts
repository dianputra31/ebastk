import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheHistoryComponent } from './the-history.component';

describe('TheHistoryComponent', () => {
  let component: TheHistoryComponent;
  let fixture: ComponentFixture<TheHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDashboardComponent } from './the-dashboard.component';

describe('TheDashboardComponent', () => {
  let component: TheDashboardComponent;
  let fixture: ComponentFixture<TheDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

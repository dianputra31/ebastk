import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheTipeModalComponent } from './the-tipe-modal.component';

describe('TheTipeModalComponent', () => {
  let component: TheTipeModalComponent;
  let fixture: ComponentFixture<TheTipeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheTipeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheTipeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

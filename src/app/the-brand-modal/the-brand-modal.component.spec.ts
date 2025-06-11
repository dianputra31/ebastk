import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheBrandModalComponent } from './the-brand-modal.component';

describe('TheBrandModalComponent', () => {
  let component: TheBrandModalComponent;
  let fixture: ComponentFixture<TheBrandModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheBrandModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheBrandModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

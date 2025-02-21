import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheModalComponent } from './the-modal.component';

describe('TheModalComponent', () => {
  let component: TheModalComponent;
  let fixture: ComponentFixture<TheModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

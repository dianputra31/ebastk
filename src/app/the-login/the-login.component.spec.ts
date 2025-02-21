import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheLoginComponent } from './the-login.component';

describe('TheLoginComponent', () => {
  let component: TheLoginComponent;
  let fixture: ComponentFixture<TheLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

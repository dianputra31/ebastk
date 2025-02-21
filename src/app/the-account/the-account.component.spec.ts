import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheAccountComponent } from './the-account.component';

describe('TheAccountComponent', () => {
  let component: TheAccountComponent;
  let fixture: ComponentFixture<TheAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

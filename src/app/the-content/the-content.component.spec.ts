import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheContentComponent } from './the-content.component';

describe('TheContentComponent', () => {
  let component: TheContentComponent;
  let fixture: ComponentFixture<TheContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

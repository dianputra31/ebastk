import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetailContentComponent } from './the-detail-content.component';

describe('TheDetailContentComponent', () => {
  let component: TheDetailContentComponent;
  let fixture: ComponentFixture<TheDetailContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetailContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheRawdataModalComponent } from './the-rawdata-modal.component';

describe('TheRawdataModalComponent', () => {
  let component: TheRawdataModalComponent;
  let fixture: ComponentFixture<TheRawdataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheRawdataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheRawdataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

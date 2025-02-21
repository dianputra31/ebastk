import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheDetilTugasComponent } from './the-detil-tugas.component';

describe('TheDetilTugasComponent', () => {
  let component: TheDetilTugasComponent;
  let fixture: ComponentFixture<TheDetilTugasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheDetilTugasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheDetilTugasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheTugasComponent } from './the-tugas.component';

describe('TheTugasComponent', () => {
  let component: TheTugasComponent;
  let fixture: ComponentFixture<TheTugasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheTugasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheTugasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

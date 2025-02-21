import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheMenuOfDetilTugasComponent } from './the-menu-of-detil-tugas.component';

describe('TheMenuOfDetilTugasComponent', () => {
  let component: TheMenuOfDetilTugasComponent;
  let fixture: ComponentFixture<TheMenuOfDetilTugasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheMenuOfDetilTugasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheMenuOfDetilTugasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

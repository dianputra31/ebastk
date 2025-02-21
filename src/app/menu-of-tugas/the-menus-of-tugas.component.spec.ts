import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheMenusOfTugasComponent } from './the-menus-of-tugas.component';

describe('TheMenusOfTugasComponent', () => {
  let component: TheMenusOfTugasComponent;
  let fixture: ComponentFixture<TheMenusOfTugasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheMenusOfTugasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheMenusOfTugasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheModalRevisionComponent } from './the-modal-revision.component';

describe('TheModalRevisionComponent', () => {
  let component: TheModalRevisionComponent;
  let fixture: ComponentFixture<TheModalRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheModalRevisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheModalRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

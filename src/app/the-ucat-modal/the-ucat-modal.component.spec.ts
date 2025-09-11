import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheUcatModalComponent } from './the-ucat-modal.component';

describe('TheBrandModalComponent', () => {
  let component: TheUcatModalComponent;
  let fixture: ComponentFixture<TheUcatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheUcatModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheUcatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

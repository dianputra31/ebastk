import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheBranchModalComponent } from './the-branch-modal.component';

describe('TheBranchModalComponent', () => {
  let component: TheBranchModalComponent;
  let fixture: ComponentFixture<TheBranchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheBranchModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheBranchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

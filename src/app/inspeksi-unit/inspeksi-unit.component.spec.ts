import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeksiUnitComponent } from '../auth.guard';

describe('InspeksiUnitComponent', () => {
  let component: InspeksiUnitComponent;
  let fixture: ComponentFixture<InspeksiUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspeksiUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeksiUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

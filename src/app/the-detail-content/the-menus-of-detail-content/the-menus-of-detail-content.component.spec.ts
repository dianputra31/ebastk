import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheMenusOfDetailContentComponent } from './the-menus-of-detail-content.component';

describe('TheMenusOfDetailContentComponent', () => {
  let component: TheMenusOfDetailContentComponent;
  let fixture: ComponentFixture<TheMenusOfDetailContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheMenusOfDetailContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheMenusOfDetailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

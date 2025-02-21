import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOfDetailRiwayatComponent } from './menu-of-detail-riwayat.component';

describe('MenuOfDetailRiwayatComponent', () => {
  let component: MenuOfDetailRiwayatComponent;
  let fixture: ComponentFixture<MenuOfDetailRiwayatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOfDetailRiwayatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOfDetailRiwayatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

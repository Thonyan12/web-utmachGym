import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilSidebar } from './sidebar';

describe('PerfilSidebar', () => {
  let component: PerfilSidebar;
  let fixture: ComponentFixture<PerfilSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

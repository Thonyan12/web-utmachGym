import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallefacturaSidebar } from './detallefactura-sidebar';

describe('DetallefacturaSidebar', () => {
  let component: DetallefacturaSidebar;
  let fixture: ComponentFixture<DetallefacturaSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallefacturaSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallefacturaSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

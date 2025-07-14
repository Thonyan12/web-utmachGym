import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembrosLayout } from './miembros-layout';

describe('MiembrosLayout', () => {
  let component: MiembrosLayout;
  let fixture: ComponentFixture<MiembrosLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembrosLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

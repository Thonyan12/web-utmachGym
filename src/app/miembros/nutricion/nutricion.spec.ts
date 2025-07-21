import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nutricion } from './nutricion';

describe('Nutricion', () => {
  let component: Nutricion;
  let fixture: ComponentFixture<Nutricion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nutricion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nutricion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

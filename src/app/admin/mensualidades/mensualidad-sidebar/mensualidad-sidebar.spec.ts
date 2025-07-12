import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensualidadSidebar } from './mensualidad-sidebar';

describe('MensualidadSidebar', () => {
  let component: MensualidadSidebar;
  let fixture: ComponentFixture<MensualidadSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [MensualidadSidebar]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensualidadSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
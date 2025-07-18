import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturasSidebar } from './facturas-sidebar';

describe('FacturasSidebar', () => {
  let component: FacturasSidebar;
  let fixture: ComponentFixture<FacturasSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [FacturasSidebar]
    }).compileComponents();
  });
    
  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



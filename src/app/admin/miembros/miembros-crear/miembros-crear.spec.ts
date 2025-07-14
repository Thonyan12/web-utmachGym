import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembrosCrearComponent } from './miembros-crear';

describe('MiembrosCrearComponent', () => {
    let component: MiembrosCrearComponent;
    let fixture: ComponentFixture<MiembrosCrearComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MiembrosCrearComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MiembrosCrearComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
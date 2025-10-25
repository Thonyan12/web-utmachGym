// ...existing code...
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { DetalleFacturaService } from '../services/detallefactura';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-detallefactura-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detallefactura-crear.html'
})
export class DetalleFacturaCrearComponent implements OnInit {
  // Input con setter para actualizar detalle cuando el padre provea el id luego
  private _idFactura: number | null = null;
  @Input()
  set idFactura(value: number | null) {
    this._idFactura = value;
    if (value) {
      this.detalle.id_factura = Number(value);
      this.detalle.referencia_id = Number(value);
    }
  }
  get idFactura(): number | null {
    return this._idFactura;
  }

  
  @Output() close = new EventEmitter<boolean>();

  // abrir modal directamente
  showModal = true;

  metodoPagoOptions = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' }
  ];

  detalle: any = {
    id_factura: 0,
    tipo_detalle: 'pago mensual', // <-- valor por defecto dentro del conjunto permitido
    referencia_id: null,
    descripcion: '',
    monto: 0,
    iva: 0,
    metodo_pago: 'efectivo',
    estado_registro: true, // <-- booleano
    f_registro: new Date().toISOString().split('T')[0]
  };

  constructor(
    private detalleService: DetalleFacturaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.idFactura) {
      this.detalle.id_factura = Number(this.idFactura);
      this.detalle.referencia_id = Number(this.idFactura);
    }
    this.detalle.f_registro = new Date().toISOString().split('T')[0];
    this.detalle.estado_registro = true; // <-- asegurar boolean true
  }

  calcularIVA(): void {
    const monto = Number(this.detalle.monto || 0);
    this.detalle.iva = parseFloat((monto * 0.12).toFixed(2));
  }

  guardar(detalleForm: NgForm): void {
    if (detalleForm.invalid) return;

    // asegurar id_factura...
    if (!this.detalle.id_factura) {
      if (this.idFactura) {
        this.detalle.id_factura = Number(this.idFactura);
        if (this.detalle.referencia_id == null) this.detalle.referencia_id = Number(this.idFactura);
      } else {
        alert('No se detectó id_factura. Guarda primero la factura y luego agrega detalles.');
        return;
      }
    }

    this.calcularIVA();
    this.detalle.monto = Number(this.detalle.monto || 0);
    this.detalle.iva = Number(this.detalle.iva || 0);
    this.detalle.f_registro = this.detalle.f_registro || new Date().toISOString().split('T')[0];
    this.detalle.estado_registro = this.detalle.estado_registro || 'Activo';

    this.detalleService.createDetalleFactura(this.detalle).pipe(
      catchError(err => {
        console.error('Error creando detalle (full):', err);
        const serverMsg = err?.error?.error || err?.error?.message || err.message || 'Unknown';
        alert(`Error al crear detalle (status ${err.status}): ${serverMsg}`);
        return of(null);
      })
    ).subscribe(res => {
      if (res) {
        alert('Detalle creado.');
        this.showModal = false;
        this.close.emit(true);
      }
    });
  }

  cancelar(): void {
    this.showModal = false;
    this.close.emit(false);
  }
}
// ...existing code...a
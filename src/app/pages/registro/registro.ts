import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { 
  AbstractControl, 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido1: ['', [Validators.required, Validators.minLength(2)]],
      apellido2: [''],
      edad: ['', [Validators.required, Validators.min(10), Validators.max(100)]],
      sexo: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      altura: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      peso: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      contextura: ['', Validators.required],
      objetivo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get cedula() { return this.registroForm.get('cedula'); }
  get correo() { return this.registroForm.get('correo'); }
  get nombre() { return this.registroForm.get('nombre'); }
  get apellido1() { return this.registroForm.get('apellido1'); }
  get apellido2() { return this.registroForm.get('apellido2'); }
  get edad() { return this.registroForm.get('edad'); }
  get sexo() { return this.registroForm.get('sexo'); }
  get direccion() { return this.registroForm.get('direccion'); }
  get altura() { return this.registroForm.get('altura'); }
  get peso() { return this.registroForm.get('peso'); }
  get contextura() { return this.registroForm.get('contextura'); }
  get objetivo() { return this.registroForm.get('objetivo'); }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    
    console.log('Formulario válido. Datos:', this.registroForm.value);
    // Aquí iría la lógica para enviar los datos al servidor
  }
}
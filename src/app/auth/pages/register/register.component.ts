import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public _loading: boolean = false;
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(20)]],
      nombreUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      contrasena: ['', [Validators.required, Validators.minLength(10), this.complexPasswordValidator]],
      repetirContrasena: ['', [Validators.required]],
      aceptacionConsentimiento: [false, [Validators.requiredTrue]]
    });
   }

  ngOnInit(): void {
   
  }

  // Método para validar complejidad de contraseña
  complexPasswordValidator(control: { value: any; }) {
    const value = control.value;
    const hasNumber = /[0-9]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar;

    return valid ? null : { passwordRequirements: true };
  }

  // Método para mostrar cláusulas de aceptación
  mostrarClausulas() {
    // Lógica para mostrar las cláusulas de aceptación
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.registroForm.valid) {
      // Lógica para enviar los datos a la base de datos
      console.log(this.registroForm.value);
    }
  }
}

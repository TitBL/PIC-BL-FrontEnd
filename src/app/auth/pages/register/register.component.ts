import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TerminosCondicionesDialogComponent } from '../../components/terminos-condiciones-dialog/terminos-condiciones-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public _loading: boolean = false;
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
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
    const dialogRef = this.dialog.open(TerminosCondicionesDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        const aceptacionControl = this.registroForm.get('aceptacionConsentimiento');
        if (aceptacionControl) {
          aceptacionControl.setValue(true);
        }
      }
    });
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.registroForm.valid) {
      // Lógica para enviar los datos a la base de datos
      console.log(this.registroForm.value);
    } else{
      console.log('FORMULARIO INVALIDO');
    }
  }
}

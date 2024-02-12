import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonService } from 'src/app/shared/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  public loading: boolean = false;
  registroForm: FormGroup;

  constructor(private fb: FormBuilder,  
    private authService: AuthService, 
    private router: Router,
    private commonService: CommonService) {
    this.registroForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(20)]]
    });
   }
  
  // Método para enviar el formulario
  onSubmit() {
    if (this.registroForm.valid) {
      // Lógica para enviar los datos a la base de datos
      console.log(this.registroForm.value);
      this.loading = true;

    const {cedula}  = this.registroForm.value;

    this.authService.resetPassword(cedula)
      .subscribe(
        (ok) => {
          // Successful login
          if (ok === true) {
            this.router.navigateByUrl('/auth');
            this.commonService.notifySuccessResponse('¡Se ha enviado exitosamente una contraseña temporal a su correo!');
          } else {
            console.error('Error:', ok);
            // this.commonService.notifyErrorResponse('Credenciales incorrectas');
          }
        },
        (error) => {
          // Handle connection error
          console.log('ERROR LOGIN: ', error);
          this.commonService.notifyErrorResponse('Ocurrió un error');
          //console.error('Error LOGIN:', error);
          this.loading = false; // Desbloquear la pantalla cuando se complete la operación
        },
        () => this.loading = false // Desbloquear la pantalla cuando se complete la operación
      );
    }
  }
}

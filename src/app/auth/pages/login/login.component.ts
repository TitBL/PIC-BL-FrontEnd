import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/shared/common.service';
import { catchError, of, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loading: boolean = false;
  // Form group for login details
  miFormulario: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService) { }

  /**
   * Attempts to log in the user using the provided credentials.
   * If successful, navigates to the dashboard; otherwise, displays an error message.
   */
  login() {
    this.loading = true;
  
    const { email, pwd } = this.miFormulario.value;
  
    this.authService.login(email, pwd)
      .subscribe(
        (ok) => {
          // Successful login
          if (ok === true) {
            this.authService.getUserSession();
            this.router.navigateByUrl('/dashboard');
            this.commonService.notifySuccessResponse('¡Bienvenido!');
          } else {
            console.error('Error:', ok);
           // this.commonService.notifyErrorResponse('Credenciales incorrectas');
          }
        },
        (error) => {
          // Handle connection error
          console.log('ERROR LOGIN: ',error);
          this.commonService.notifyErrorResponse('Ocurrió un error');
          //console.error('Error LOGIN:', error);
          this.loading = false; // Desbloquear la pantalla cuando se complete la operación
        },
        () => this.loading = false // Desbloquear la pantalla cuando se complete la operación
      );
  }

}

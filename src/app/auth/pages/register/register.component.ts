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
 // Form group for login details
 miFormulario: FormGroup = this.fb.group({
  email: ['test1@test.com', [Validators.required, Validators.email]],
  pwd: ['123456', [Validators.required, Validators.minLength(6)]]
});
constructor(private fb: FormBuilder,
  private router: Router,
  private authService: AuthService,
  private _snackBar: MatSnackBar) { }

  /**
   * Attempts to log in the user using the provided credentials.
   * If successful, navigates to the dashboard; otherwise, displays an error message.
   */
  register() {
    this._loading = true;

    const { email, pwd } = this.miFormulario.value;
    // Subscribe to the login method in the AuthService
    this.authService.login(email, pwd)
      .subscribe(ok => {
        // Successful login
        if (ok === true) {
          this._loading = false;
          this.authService.getUserSession();
          this.router.navigateByUrl('/dashboard');

        } else {
          // Failed login
          this._loading = false;
          this._snackBar.open('Credenciales incorrectas', '', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: 'app-notification-error'
          });
        }
      })

  }
}

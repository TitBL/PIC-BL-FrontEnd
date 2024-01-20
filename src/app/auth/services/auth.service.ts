import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AuthResponse, TokenResponse, UserAuth } from '../interfaces/interfaces';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/protected/services/crypto.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _user!: UserAuth;
  private _token!: TokenResponse;
 
  get user() {
    return { ...this._user };
  }

  constructor(private router: Router,
              private http: HttpClient,
              private permissionService: PermissionsService,
              private cryptoService: CryptoService) { }


   /**
   * Logs in the user with the provided credentials.
   * @param name The username, email, or dni.
   * @param pwd The user's password.
   * @returns An Observable indicating success or failure.
   */
  login(name: string, pwd: string) {

    const url = `${this.baseUrl}/login`;
    var email = "";
    var dni = "";
    var body = {};

    if (this.validateEmailAddress(name)) {
      email = name;
      body = { email, pwd };
    } else if (this.validateOnlyNumbers(name)) {
      dni = name;
      body = { dni, pwd };
    }
    else {
      body = { name, pwd };
    }

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => {
          if (resp.Success) {
            var _data = JSON.stringify(resp.Data)
            const _tokenResponse = JSON.parse(_data || '{}');
            this._token = _tokenResponse;
            localStorage.setItem('token', _tokenResponse.token);
            localStorage.setItem('session', _tokenResponse.session);
          }
        }),
        map(resp => resp.Success),
        catchError(err => of(false))
      );
  }

   /**
   * Logs out the user by removing token and session from localStorage.
   */
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    localStorage.removeItem('Permisos');
  }

  /**
   * Validates the user's token.
   */
  validateToken() {
    const url = `${this.baseUrl}/auth/`;
  }
  /**
   * Retrieves the user session from the server.
   * @returns An Observable with the user session data.
   */
  getUserSession(): Observable<any> {
    const apiUrl = `${environment.baseUrl}/usuario/perfil`;
    let auth_token = localStorage.getItem('token');
    let sessionid = localStorage.getItem('session');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'SessionId': `${sessionid}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.get<any>(apiUrl, { headers })
    .pipe(
      catchError((error) => {
      console.error('Error en la solicitud:', error);
      this.router.navigate(['/auth']); 
      return of(null);
    }),
      tap(resp => {
        if (resp.Success) {
          const datosEncriptados = this.cryptoService.encrypt(resp.Data['Permisos ']);
          localStorage.setItem('Permisos', datosEncriptados);
          this.permissionService.configurePermissions(resp.Data['Permisos ']);
        }
      })
    );
  }

  /**
   * Validates whether the provided inputString contains only numbers.
   * @param inputString The string to be validated.
   * @returns True if the string contains only numbers, otherwise false.
   */
  validateOnlyNumbers(inputString: string): boolean {
    const numericRegex: RegExp = /^[0-9]+$/; // Regular expression to match only numbers
    return numericRegex.test(inputString);
  }

   /**
   * Validates whether the provided email is in a valid format.
   * @param email The email to be validated.
   * @returns True if the email is valid, otherwise false.
   */
  validateEmailAddress(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
    return emailRegex.test(email);
  }

}

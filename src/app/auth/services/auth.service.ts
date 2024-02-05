import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AuthResponse, TokenResponse, UserAuth } from '../interfaces/interfaces';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/protected/services/crypto.service';
import { CommonService } from 'src/app/shared/common.service';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    private cryptoService: CryptoService,
    private commonService: CommonService) { }


  /**
  * Logs in the user with the provided credentials.
  * @param name The username, email, or dni.
  * @param pwd The user's password.
  * @returns An Observable indicating success or failure.
  */
  login(name: string, pwd: string): Observable<boolean> {

    const url = ApiRoutes.Authentication.Login;
    let body: any = {};

    if (this.commonService.validateEmailAddress(name)) {
      body = { email: name, pwd };
    } else if (this.commonService.validateOnlyNumbers(name)) {
      body = { dni: name, pwd };
    } else {
      body = { name, pwd };
    }

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp: AuthResponse) => this.handleLoginResponse(resp)),
      map((resp: AuthResponse) => resp.Success),
      catchError(this.handleError)
    );
  }

  private handleLoginResponse(resp: AuthResponse): void {
    if (resp.Success) {
      const { token, session } = resp.Data || {};
      this._token = { token, session };
      if (token) {
        localStorage.setItem('token', token);
      }
      if (session) {
        localStorage.setItem('session', session);
      }
    }
  }

  private handleError = (error: HttpErrorResponse): Observable<boolean> => {
    console.error('Error de conexión:', error.status);
  
    if (error.status === 0) {
      this.commonService.notifyErrorResponse('Error de conexión: el servidor no responde');
    } else if (error.status === 400) {
      this.commonService.notifyErrorResponse('Credenciales incorrectas');
    } else {
      this.commonService.notifyErrorResponse('Error desconocido');
    }
    return of(false);
  }

  /**
  * Logs out the user by removing token and session from localStorage.
  */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    localStorage.removeItem('Permisos');
  }

 
  /**
   * Retrieves the user session from the server.
   * @returns An Observable with the user session data.
   */
  getUserSession(): Observable<any> {
    const apiUrl = ApiRoutes.User.Get_Profile;
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
            const permisosEncriptados = this.cryptoService.encrypt(resp.Data['Permisos']);
            const empresasEncriptadas = this.cryptoService.encrypt(resp.Data['Empresas']);
            const idUserEncriptado = this.cryptoService.encrypt(resp.Data['id']);
            localStorage.setItem('Permisos', permisosEncriptados);
            localStorage.setItem('Empresas', empresasEncriptadas);
            localStorage.setItem('IdUser', idUserEncriptado);
            this.permissionService.configurePermissions(resp.Data['Permisos']);
          }
        })
      );
  }

}

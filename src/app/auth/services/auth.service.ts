import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthResponse, TokenResponse, UserAuth } from '../interfaces/interfaces';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/protected/services/crypto.service';
import { CommonService } from 'src/app/shared/common.service';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { SessionVariables } from '../enums/sessionVariables';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
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

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'APIKEY': this.getApiKey()
    });

    return this.http.post<AuthResponse>(url, body, { headers }).pipe(
      tap((resp: AuthResponse) => this.handleLoginResponse(resp)),
      map((resp: AuthResponse) => resp.Success),
      catchError(this.handleError)
    );
  }

  resetPassword(usuario: string): Observable<boolean> {

    const url = ApiRoutes.User.ResetPassword;
    let body: any = {usuario};

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'APIKEY': this.getApiKey()
    });

    return this.http.post<AuthResponse>(url, body, { headers }).pipe(
      tap((resp: AuthResponse) => resp),
      map((resp: AuthResponse) => resp.Success),
      catchError(this.handleError)
    );
  }


  private handleLoginResponse(resp: AuthResponse): void {
    if (resp.Success) {
      const { token, session } = resp.Data || {};
      this._token = { token, session };
      if (token) {
        sessionStorage.setItem(SessionVariables.Token, token);
      }
      if (session) {
        sessionStorage.setItem(SessionVariables.Session, session);
      }
    }
  }

  private handleError = (error: HttpErrorResponse): Observable<boolean> => {
    console.error('Error de conexión:', error.status);

    if (error.status === 0) {
      this.commonService.notifyErrorResponse('Error de conexión: el servidor no responde');
    }  else if (error.status === 400) {
      this.commonService.notifyErrorResponse('Credenciales incorrectas');
    } else if (error.status === 404) {
      this.commonService.notifyErrorResponse('Not Found');
    }else {
      this.commonService.notifyErrorResponse('Error desconocido');
    }
    return of(false);
  }

  /**
  * Logs out the user by removing token and session from sessionStorage.
  */
  logout() {
    sessionStorage.removeItem(SessionVariables.Token);
    sessionStorage.removeItem(SessionVariables.Session);
    sessionStorage.removeItem(SessionVariables.Permisos);
    sessionStorage.removeItem(SessionVariables.Empresas);
    sessionStorage.removeItem(SessionVariables.User);
  }


  /**
   * Retrieves the user session from the server.
   * @returns An Observable with the user session data.
   */
  getUserSession(): Observable<any> {
    const idUserEncriptado = sessionStorage.getItem(SessionVariables.User);
    if (idUserEncriptado) {
      let userSession = this.cryptoService.decrypt(idUserEncriptado);
      return of(userSession);
    }

    const apiUrl = ApiRoutes.User.Get_Profile;
    let auth_token = sessionStorage.getItem(SessionVariables.Token);
    let sessionid = sessionStorage.getItem(SessionVariables.Session);
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
            const idUserEncriptado = this.cryptoService.encrypt(resp.Data);
            sessionStorage.setItem(SessionVariables.Permisos, permisosEncriptados);
            sessionStorage.setItem(SessionVariables.Empresas, empresasEncriptadas);
            sessionStorage.setItem(SessionVariables.User, idUserEncriptado);
            this.permissionService.configurePermissions(resp.Data['Permisos']);
          }
        })
      );
  }

  getApiKey(): string {
    const ruc = environment.RUC;
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11, se suma 1 para obtener el mes actual
    const dia = fechaActual.getDate();

    // Formatear el mes y el día para asegurarse de que tengan dos dígitos
    const mesFormateado = mes < 10 ? '0' + mes : mes.toString();
    const diaFormateado = dia < 10 ? '0' + dia : dia.toString();

    // Concatenar el número de RUC con la fecha actual en el formato deseado
    const rucConFecha = `${ruc}${año}${mesFormateado}${diaFormateado}`;
    return this.cryptoService.encrypt(rucConFecha);
  }

}

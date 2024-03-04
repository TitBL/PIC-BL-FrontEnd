import { Injectable } from '@angular/core';
import { NewUsuario, UpdateUsuario, Usuario, ViewUsuario } from '../interfaces/usersession';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { Response } from '../interfaces/response';
import { EditUsuarioModalComponent } from '../pages/configuraciones/usuario/edit-usuario-modal/edit-usuario-modal.component';
import { CommonService } from 'src/app/shared/common.service';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CryptoService } from './crypto.service';
import { SessionVariables } from 'src/app/auth/enums/sessionVariables';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private _users!: ViewUsuario[];
  private userSavedSubject = new Subject<void>();

  /**
   * Getter for the list of businesses.
   */
  get users() {
    return { ...this._users };
  }

  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private commonService: CommonService,
    private cryptoService: CryptoService) { }

  /**
  * Retrieves the list of users based on the provided status.
  * @param _estado The status of the users to be retrieved.
  * @returns An Observable containing the response data.
  */
  getUsersByState(_estado: string): Observable<any> {
    const url = `${ApiRoutes.User.Get_byState}/${_estado}`;
    const headers = this.commonService.createHeaders();

    return this.http.get<Response>(url, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            this._users = resp.Data;
          }
        })
      );
  }

  getUserById(_id: number): Observable<any> {
    const url = `${ApiRoutes.User.Get_byId}/${_id}`;
    const headers = this.commonService.createHeaders();
    return this.http.get<Response>(url, { headers }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  }

  getProfileDash(): Observable<any> {
    const url = ApiRoutes.User.Get_Profile_Dash;
    const headers = this.commonService.createHeaders();
    return this.http.get<Response>(url, { headers }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  }


  openNewUserModal(_isNew: boolean, _idUsuario: number): void {
    const dialogRef = this.dialog.open(EditUsuarioModalComponent, {
      width: '75%', // Ajusta el tamaño según tus necesidades
      disableClose: true, // Opcional: Para evitar cerrar la modal haciendo clic fuera de ella
      data: { IsNew: _isNew, IdUsuario: _idUsuario }
    });

    dialogRef.componentInstance.guardarUsuario.subscribe(result => {
      // Agrega el nuevo registro a tu fuente de datos
      if (_isNew) {
        this.createNewUser(result).subscribe(
          (respuesta) => {
             // Emitir evento cuando se guarda
             this.userSavedSubject.next();
            this.commonService.notifySuccessResponse(respuesta.Message);
          },
          (error) => {
            console.error('Error:', error);
            this.commonService.notifyErrorResponse(error.error.Message);
          }
        );
      } else {
        this.updateUser(result).subscribe(
          (respuesta) => {
             // Emitir evento cuando se guarda
             this.userSavedSubject.next();
            this.commonService.notifySuccessResponse(respuesta.Message);
          },
          (error) => {
            console.error('Error:', error);
            this.commonService.notifyErrorResponse(error.message);

          }
        );
      }
    })
  }

  // Método para permitir que otros componentes se suscriban al evento de guardado de rol
  onUserSaved() {
    return this.userSavedSubject.asObservable();
  }

  createNewUser(usuario: Usuario): Observable<any> {
    const newUser: NewUsuario = {
      Direccion: usuario.Direccion,
      Email: usuario.Email,
      Empresas: usuario.Empresas,
      IdRol: usuario.IdRol,
      NombreCompleto: usuario.NombreCompleto,
      NombreUsuario: usuario.NombreUsuario,
      Contrasena: usuario.Contrasena,
      DNI: usuario.DNI
    };
    if (usuario.TerminosCondiciones !== undefined) {
      newUser.TerminosCondiciones = usuario.TerminosCondiciones.TerminosyCondiciones,
        newUser.TerminosCondicionesAcceptacion = usuario.TerminosCondiciones.Aceptado
    }
    const url = ApiRoutes.User.New;
    const headers = this.commonService.createHeaders();
    return this.http.post(url, newUser, { headers }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  };

  updateUser(usuario: Usuario): Observable<any> {
    const _id: number = usuario.id;
    const updateUser: UpdateUsuario = {
      Direccion: usuario.Direccion,
      Email: usuario.Email,
      Empresas: usuario.Empresas,
      IdRol: usuario.IdRol,
      IdUsuario: usuario.id,
      NombreCompleto: usuario.NombreCompleto,
      NombreUsuario: usuario.NombreUsuario
    };
    if (usuario.TerminosCondiciones !== undefined) {
      updateUser.TerminosCondiciones = usuario.TerminosCondiciones.TerminosyCondiciones,
        updateUser.TerminosCondicionesAcceptacion = usuario.TerminosCondiciones.Aceptado
    }
    const url = `${ApiRoutes.User.Update}/${_id}`;
    const headers = this.commonService.createHeaders();
    return this.http.put(url, updateUser, { headers }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  };


  toggleUserStatus(_idUsuario: number, enable: boolean): Observable<any> {
    const route = enable ? ApiRoutes.User.Enable : ApiRoutes.User.Disable;
    const url = `${route}/${_idUsuario}`;
    const headers = this.commonService.createHeaders();
    var body = {};
    return this.http.post(url, body, { headers });
  };

  getIdUserSession(): number {
    const datosEnSessionStorage = sessionStorage.getItem(SessionVariables.User);
    if (datosEnSessionStorage !== null) {
      let user = this.cryptoService.decrypt(datosEnSessionStorage);
      return user['id'];
    }
    return -1;
  }


}


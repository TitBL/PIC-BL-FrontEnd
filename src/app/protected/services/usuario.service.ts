import { Injectable } from '@angular/core';
import { ViewUsuario } from '../interfaces/usersession';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
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
    return this.http.get<Response>(url, { headers });
  }


  openNewUserModal(_isNew: boolean, _idUsuario: number): void {
    const dialogRef = this.dialog.open(EditUsuarioModalComponent, {
      width: '75%', // Ajusta el tamaño según tus necesidades
      disableClose: true, // Opcional: Para evitar cerrar la modal haciendo clic fuera de ella
      data: { IsNew: _isNew, IdUsuario: _idUsuario }
    });

    dialogRef.componentInstance.guardarUsuario.subscribe(result => {
      // Agrega el nuevo registro a tu fuente de datos
      console.log(result);
      if (_isNew) {
        this.createNewUser(result).subscribe(
          (respuesta) => {
            console.log(respuesta);
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
            console.log(respuesta);
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

  createNewUser(usuario: any): Observable<any> {
    const url = ApiRoutes.User.New;
    const headers = this.commonService.createHeaders();
    return this.http.post(url, usuario, { headers });
  };

  updateUser(usuario: any): Observable<any> {
    const url = ApiRoutes.User.Update;
    const headers = this.commonService.createHeaders();
    return this.http.post(url, usuario, { headers });
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
      let idUser = this.cryptoService.decrypt(datosEnSessionStorage);
      return idUser['id'];
    }
    return -1;
  }
}


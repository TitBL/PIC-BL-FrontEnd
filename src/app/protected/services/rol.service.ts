import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Permissions } from '../interfaces/permiso';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { Response } from '../interfaces/response';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CommonService } from 'src/app/shared/common.service';
import { EditRolModalComponent } from '../pages/configuraciones/rol/edit-rol-modal/edit-rol-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NewRol, UpdateRol } from '../interfaces/rol';
import { CryptoService } from './crypto.service';
import { SessionVariables } from 'src/app/auth/enums/sessionVariables';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private _permissions!: Permissions[];
  private rolSavedSubject = new Subject<void>();
  /**
    * Getter for the list of permissions.
    */
  get permissions() {
    return { ...this._permissions };
  }

  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private commonService: CommonService,
    private cryptoService: CryptoService) { }

  /**
   * Retrieves the list of permissions.
   * @returns An Observable containing the response data.
   */
  getRolesByState(_state: string): Observable<any> {
    const url = `${ApiRoutes.Role.Get_byState}/${_state}`;
    const headers = this.commonService.createHeaders();

    return this.http.get<Response>(url, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            var _data = JSON.stringify(resp.Data)
            const _response = JSON.parse(_data || '{}');
            this._permissions = _response;
          }
        }),
        catchError(this.commonService.handleError)
      );
  }

  getRolById(_id: number): Observable<any> {
    const url = `${ApiRoutes.Role.Get_byId}/${_id}`;
    const headers = this.commonService.createHeaders();
    return this.http.get<Response>(url, { headers }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  }



  openNewRolModal(_isNew: boolean, _idRol: number): void {
    const dialogRef = this.dialog.open(EditRolModalComponent, {
      width: '750%', // Ajusta el tamaño según tus necesidades
      disableClose: true, // Opcional: Para evitar cerrar la modal haciendo clic fuera de ella
      data: { IsNew: _isNew, IdRol: _idRol }
    });

    dialogRef.componentInstance.guardarRol.subscribe((nuevoRegistro) => {
      // Agrega el nuevo registro a tu fuente de datos
      if (_isNew) {
        this.createNewRol(nuevoRegistro).subscribe(
          (respuesta) => {
            this.commonService.notifySuccessResponse(respuesta.Message);
            // Emitir evento cuando se guarda un nuevo rol
            this.rolSavedSubject.next();
          },
          (error) => {
            console.error('Error:', error);
            this.commonService.notifyErrorResponse(error.error.Message);
          }
        );
      } else {
        this.updateRol(nuevoRegistro).subscribe(
          (respuesta) => {
            this.commonService.notifySuccessResponse(respuesta.Message);
            // Emitir evento cuando se guarda un nuevo rol
            this.rolSavedSubject.next();
          },
          (error) => {
            console.error('Error:', error);
            this.commonService.notifyErrorResponse(error.message);

          }
        );
      }

      // Puedes utilizar MatTableDataSource y llamar a .data para actualizar la tabla
    });
  }

  // Método para permitir que otros componentes se suscriban al evento de guardado de rol
  onRolSaved() {
    return this.rolSavedSubject.asObservable();
  }

  createNewRol(rol: UpdateRol): Observable<any> {
    const newRol: NewRol = {
      Descripcion: rol.Descripcion,
      Nombre: rol.Nombre,
      Permisos: rol.Permisos
    }
    const url = ApiRoutes.Role.New;
    const headers = this.commonService.createHeaders();
    return this.http.post(url, newRol, { headers }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  }

  updateRol(rol: UpdateRol): Observable<any> {

    const _id: number = rol.id;
    const updateRol: UpdateRol = {
      id: rol.id,
      Nombre: rol.Nombre,
      Descripcion: rol.Descripcion,
      Permisos: rol.Permisos
    };

    const url = `${ApiRoutes.Role.Update}/${_id}`;
    const headers = this.commonService.createHeaders();
    return this.http.put(url, updateRol, { headers }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  }

  toggleRolStatus(_idRol: number, enable: boolean): Observable<any> {
    const route = enable ? ApiRoutes.Role.Enable : ApiRoutes.Role.Disable;
    const url = `${route}/${_idRol}`;
    const headers = this.commonService.createHeaders();
    var body = {};
    return this.http.post(url, body, { headers })
      .pipe(
        tap(resp => { return resp }),
        catchError(this.commonService.handleError)
      );
  }

  isUserSessionMaster() :boolean {
    const datosEnSessionStorage = sessionStorage.getItem(SessionVariables.User);
    if (datosEnSessionStorage !== null) {
      let user = this.cryptoService.decrypt(datosEnSessionStorage);
      return user.IdRol === '1' ? true: false;
    }
    return false;
  }

}

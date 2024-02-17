import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empresa, NewEmpresa, UpdateEmpresa, ViewEmpresa, ViewEmpresaSession } from '../interfaces/empresa';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { Response } from '../interfaces/response';
import { MatDialog } from '@angular/material/dialog';
import { EditEmpresaModalComponent } from '../pages/configuraciones/empresa/edit-empresa-modal/edit-empresa-modal.component';
import { CommonService } from 'src/app/shared/common.service';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CryptoService } from './crypto.service';
import { SessionVariables } from 'src/app/auth/enums/sessionVariables';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private _business!: ViewEmpresa[];
  private businessSavedSubject = new Subject<void>();
  /**
   * Getter for the list of businesses.
   */
  get business() {
    return { ...this._business };
  }

  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private commonService: CommonService,
    private cryptoService: CryptoService) { }

  /**
  * Retrieves the list of businesses based on the provided status.
  * @param _estado The status of the businesses to be retrieved.
  * @returns An Observable containing the response data.
  */
  getBusinessByState(_estado: string): Observable<any> {
    const url = `${ApiRoutes.Business.Get_byState}/${_estado}`;
    const headers = this.commonService.createHeaders();

    return this.http.get<Response>(url, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            this._business = resp.Data;
          }
        }),
        catchError(this.commonService.handleError)
      );
  }

  getBusinessById(_id: number): Observable<any> {
    const url = `${ApiRoutes.Business.Get_byId}/${_id}`;
    const headers = this.commonService.createHeaders();
    return this.http.get<Response>(url, { headers })
    .pipe(
      tap(resp => {return resp}),
      catchError(this.commonService.handleError)
    );
  }


  openNewEmpresaModal(_isNew: boolean, _idEmpresa: number): void {
    const dialogRef = this.dialog.open(EditEmpresaModalComponent, {
      width: '75%', // Ajusta el tamaño según tus necesidades
      disableClose: true, // Opcional: Para evitar cerrar la modal haciendo clic fuera de ella
      data: { IsNew: _isNew, IdEmpresa: _idEmpresa }
    });

    dialogRef.componentInstance.guardarEmpresa.subscribe((nuevoRegistro) => {
      // Agrega el nuevo registro a tu fuente de datos
      console.log(nuevoRegistro);
      if (_isNew) {
        this.createNewBusiness(nuevoRegistro).subscribe(
          (respuesta) => {
            console.log(respuesta);
            // Emitir evento cuando se guarda un nuevo rol
            this.businessSavedSubject.next();
            this.commonService.notifySuccessResponse(respuesta.Message);
          },
          (error) => {
            console.error('Error:', error);
            this.commonService.notifyErrorResponse(error.error.Message);
          }
        );
      } else {
        this.updateBusiness(nuevoRegistro).subscribe(
          (respuesta) => {
            console.log(respuesta);
             // Emitir evento cuando se guarda un nuevo rol
             this.businessSavedSubject.next();
            this.commonService.notifySuccessResponse(respuesta.Message);
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
   onBusinessSaved() {
    return this.businessSavedSubject.asObservable();
  }

  createNewBusiness(empresa: Empresa): Observable<any> {
    const newEmpresa : NewEmpresa = {
      APIKey : empresa.APIKey,
      Email : empresa.Email,
      Logo : empresa.Logo,
      NombreComercial : empresa.NombreComercial,
      PasswordSMTP : empresa.PasswordSMTP,
      PuedeEnviarCorreo : empresa.PuedeEnviarCorreo,
      Puerto : empresa.Puerto,
      RazonSocial : empresa.RazonSocial,
      RUC : empresa.RUC,
      Servidor : empresa.Servidor,
      TipoSeguridad: empresa.TipoSeguridad,
      UsaConfiguracionSMTP : empresa.UsaConfiguracionSMTP,
      UsuarioSMTP : empresa.UsuarioSMTP
    }
    const url = ApiRoutes.Business.New;
    const headers = this.commonService.createHeaders();
    return this.http.post(url, newEmpresa, { headers }).pipe(
      tap(resp => {return resp}),
      catchError(this.commonService.handleError)
    );
  }
  
  updateBusiness(empresa: Empresa): Observable<any> {
    const _id : number = empresa.id;
    const updateEmpresa : UpdateEmpresa = {
      APIKey : empresa.APIKey,
      Email : empresa.Email,
      Logo : empresa.Logo,
      NombreComercial : empresa.NombreComercial,
      PasswordSMTP : empresa.PasswordSMTP,
      PuedeEnviarCorreo : empresa.PuedeEnviarCorreo,
      Puerto : empresa.Puerto,
      Servidor : empresa.Servidor,
      TipoSeguridad: empresa.TipoSeguridad,
      UsaConfiguracionSMTP : empresa.UsaConfiguracionSMTP,
      UsuarioSMTP : empresa.UsuarioSMTP
    };

    const url =  `${ApiRoutes.Business.Update}/${_id}`;
    const headers = this.commonService.createHeaders();
    return this.http.put(url, updateEmpresa, { headers })
    .pipe(
      tap(resp => {return resp}),
      catchError(this.commonService.handleError)
    );
  }

  getApiKey(): Observable<any> {
    const url = ApiRoutes.Business.Get_APIKey;
    const headers = this.commonService.createHeaders();
    return this.http.get<Response>(url, { headers })
    .pipe(
      tap(resp => {return resp}),
      catchError(this.commonService.handleError)
    );
  }

  toggleBusinessStatus(_idEmpresa: number, enable: boolean): Observable<any> {
    const route = enable ? ApiRoutes.Business.Enable : ApiRoutes.Business.Disable;
    const url = `${route}/${_idEmpresa}`;
    const headers = this.commonService.createHeaders();
    var body = {};
    return this.http.post(url, body, { headers })
    .pipe(
      tap(resp => {return resp}),
      catchError(this.commonService.handleError)
    );
  }

  getBusinessOfUserSession(): ViewEmpresaSession[] {
    const datosEnSessionStorage = sessionStorage.getItem(SessionVariables.Empresas);
    // Verificar si datosEnSessionStorage no es null antes de intentar desencriptar
    if (datosEnSessionStorage !== null) {
      let businessList = this.cryptoService.decrypt(datosEnSessionStorage);
      return businessList;
    }
    // Devolver vacio si datosEnSessionStorage es null
    return [];
  }

}

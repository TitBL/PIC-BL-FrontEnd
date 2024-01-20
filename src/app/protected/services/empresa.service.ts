import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewEmpresa } from '../interfaces/empresa';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import { Response } from '../interfaces/response';
import { MatDialog } from '@angular/material/dialog';
import { EditEmpresaModalComponent } from '../pages/configuraciones/empresa/edit-empresa-modal/edit-empresa-modal.component';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private baseUrl: string = environment.baseUrl;
  private _business!: ViewEmpresa[];
  private token = localStorage.getItem('token');
  private session = localStorage.getItem('session');

  /**
   * Getter for the list of businesses.
   */
  get business() {
    return { ...this._business };
  }

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  /**
  * Retrieves the list of businesses based on the provided status.
  * @param _estado The status of the businesses to be retrieved.
  * @returns An Observable containing the response data.
  */
  getBusinessByState(_estado: string): Observable<any> {
    const url = `${this.baseUrl}/empresa/list/${_estado}`;
    const headers = this.createHeaders();

    return this.http.get<Response>(url, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            var _data = JSON.stringify(resp.Data)
            const _response = JSON.parse(_data || '{}');
            this._business = _response;
          }
        })
      );
  }

  getBusinessById(_id: number): Observable<any> {
    const url = `${this.baseUrl}/empresa/${_id}`;
    const headers = this.createHeaders();
    return this.http.get<Response>(url, { headers });
  }

  
  openNewEmpresaModal(_isNew: boolean, _idEmpresa:number): void {
    const dialogRef = this.dialog.open(EditEmpresaModalComponent, {
      width: '75%', // Ajusta el tamaño según tus necesidades
      disableClose: true, // Opcional: Para evitar cerrar la modal haciendo clic fuera de ella
      data: { IsNew: _isNew, IdEmpresa: _idEmpresa }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Puedes realizar acciones después de cerrar la modal, si es necesario
    });
  }

  createNewBusiness(empresa: any): Observable<any> {
    const url = `${this.baseUrl}/empresa`;
    const headers = this.createHeaders();
    return this.http.post(url, empresa, { headers });
  }

  getApiKey(): Observable<any> {
    const url = `${this.baseUrl}/empresa/api_key`;
    const headers = this.createHeaders();

    return this.http.get<Response>(url, { headers });
  }

  toggleBusinessStatus(_idEmpresa: number, enable: boolean): Observable<any> {
    const action = enable ? 'habilitar' : 'deshabilitar';
    const url = `${this.baseUrl}/empresa/${action}/${_idEmpresa}`;
    const headers = this.createHeaders();
    var body = {};
    console.log(headers);
    return this.http.post(url, body, { headers });
  }

  /**
   * Creates HttpHeaders with the authorization token and session ID.
   * @returns HttpHeaders with authorization information.
   */
  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'SessionId': `${this.session}`,
      'Accept': 'application/json'
    });
  }
}

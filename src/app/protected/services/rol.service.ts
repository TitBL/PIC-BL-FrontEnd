import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Permissions } from '../interfaces/permiso';
import { Observable, tap } from 'rxjs';
import { Response } from '../interfaces/response';
import { EstadosEnum } from '../enums/estados.enum';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private baseUrl: string = environment.baseUrl;
  private _permissions!: Permissions[];
  private token = localStorage.getItem('token');
  private session = localStorage.getItem('session');

  /**
    * Getter for the list of permissions.
    */
  get permissions() {
    return { ...this._permissions };
  }

  constructor(private http: HttpClient) { }

  /**
   * Retrieves the list of permissions.
   * @returns An Observable containing the response data.
   */
  getRolesByState(_state: EstadosEnum): Observable<any> {
    const url = `${this.baseUrl}/rol/list/${_state}`;
    const headers = this.createHeaders();

    return this.http.get<Response>(url, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            var _data = JSON.stringify(resp.Data)
            const _response = JSON.parse(_data || '{}');
            this._permissions = _response;
          }
        })
      );
  }

   /**
   * Creates HttpHeaders with the authorization token and session ID.
   * @returns HttpHeaders with authorization information.
   */
   private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'SessionId': `${this.session}`,
      'Content-Type': 'application/json'
    });
  }

}

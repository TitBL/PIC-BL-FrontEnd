import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Permissions } from '../interfaces/permiso';
import { Observable, tap } from 'rxjs';
import { Response } from '../interfaces/response';
import { EstadosEnum } from '../enums/estados.enum';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CommonService } from 'src/app/shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private _permissions!: Permissions[];

  /**
    * Getter for the list of permissions.
    */
  get permissions() {
    return { ...this._permissions };
  }

  constructor(private http: HttpClient,
              private commonService: CommonService) { }

  /**
   * Retrieves the list of permissions.
   * @returns An Observable containing the response data.
   */
  getRolesByState(_state: EstadosEnum): Observable<any> {
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
        })
      );
  }

}

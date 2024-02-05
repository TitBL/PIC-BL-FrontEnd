import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CommonService } from 'src/app/shared/common.service';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {}

  getParametros(): Observable<any> {
    const url = ApiRoutes.Setup.Get_Setup;
    const headers = this.commonService.createHeaders();

    return this.http.get<Response>(url, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            console.log(resp);
          }
        })
      );
  }

  saveParametros(parametros: any): Observable<any> {
    const url = ApiRoutes.Setup.Update_Settings;
    const headers = this.commonService.createHeaders();
    return this.http.post(url, parametros, { headers });
  }
}

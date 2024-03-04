import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CommonService } from 'src/app/shared/common.service';
import { Response } from '../interfaces/response';
import { environment } from 'src/environments/environment';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private cryptoService: CryptoService) {}

  getParametros(): Observable<any> {
    const url = ApiRoutes.Setup.Get_Setup;
    const headers = this.commonService.createHeaders();

    return this.http.get<Response>(url, { headers })
    .pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  }

  saveParametros(parametros: any): Observable<any> {
    const url = ApiRoutes.Setup.Update_Settings;
    const headers = this.commonService.createHeaders();
    return this.http.post(url, parametros, { headers }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
    );
  }

  getTerms(): Observable<string> {
    const url = ApiRoutes.Setup.Get_TermsConditions;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'APIKEY': this.getApiKey()
    });
    //const headers = this.commonService.createHeaders();
    return this.http.get(url, { headers, responseType: 'text' }).pipe(
      tap(resp => { return resp }),
      catchError(this.commonService.handleError)
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

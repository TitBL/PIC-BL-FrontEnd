import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CommonService } from 'src/app/shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private http: HttpClient,
    private commonService: CommonService) { }

  getReportDocumentsByTypeAndBusiness(type: string, IdEmpresa: number): Observable<any> {
    const url = this.getUrl(type) + `/${IdEmpresa}`;
    const headers = this.commonService.createHeaders();

    return this.http.get(url, { headers }).pipe(
      catchError(this.commonService.handleError)
    );
  }

  getUrl(type: string): string {
    if (type === 'received') {
      return `${ApiRoutes.Report.Get_DocReceived_Business}`;
    } else {
      return `${ApiRoutes.Report.Get_DocIssued_Business}`;
    }
  }

  getReportBusinessPanel(idEmpresa: number, Mes: number, Anio: number): Observable<any> {
    const url = `${ApiRoutes.Report.Get_Business_Panel}`;
    const headers = this.commonService.createHeaders();
    var body = { idEmpresa, Mes, Anio };
    return this.http.post(url, body, { headers }).pipe(
      catchError(this.commonService.handleError)
    );
  }

}

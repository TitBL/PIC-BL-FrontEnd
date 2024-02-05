import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Response } from '../interfaces/response';
import { ViewDocumentIssued, ViewDocumentReceived } from '../interfaces/documento';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CommonService } from 'src/app/shared/common.service';

@Injectable({
  providedIn: 'root'
})

export class DocumentoService {
  private _documentsReceived!: ViewDocumentReceived[];
  private _documentsIssued!: ViewDocumentIssued[];


  /**
   * Getter for received documents.
   */
  get documentsReceived() {
    return { ...this._documentsReceived };
  }

  /**
   * Getter for issued documents.
   */
  get documentsIssued() {
    return { ...this._documentsIssued };
  }

  constructor(private http: HttpClient,
    private commonService: CommonService) { }

  /**
   * Retrieves the list of received documents for a consumer within a specified date range.
   * @param IdEmpresa The ID of the company (consumer).
   * @param FechaDesde The start date for the document search.
   * @param FechaHasta The end date for the document search.
   * @returns An Observable containing the response data.
   */
  getDocumentReceivedConsumer(IdEmpresa: number,
    FechaDesde: string,
    FechaHasta: string): Observable<any> {
    const url = ApiRoutes.Document.Get_DocReceivedConsumers;
    var body = { IdEmpresa, FechaDesde, FechaHasta };
    const headers = this.commonService.createHeaders();

    return this.http.post<Response>(url, body, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            this._documentsReceived = resp.Data;
          }
        })
      );
  }


  /**
   * Retrieves the list of received documents for a business within a specified date range.
   * @param IdEmpresa The ID of the business.
   * @param FechaDesde The start date for the document search.
   * @param FechaHasta The end date for the document search.
   * @returns An Observable containing the response data.
   */
  getDocumentReceivedBusiness(IdEmpresa: number,
    FechaDesde: string,
    FechaHasta: string): Observable<any> {
    const url = ApiRoutes.Document.Get_DocReceivedBusiness;
    var body = { IdEmpresa, FechaDesde, FechaHasta };
    const headers = this.commonService.createHeaders();

    return this.http.post<Response>(url, body, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            this._documentsReceived = resp.Data;
          }
        })
      );
  }


  /**
  * Retrieves the list of issued documents for a business within a specified date range.
  * @param IdEmpresa The ID of the business.
  * @param FechaDesde The start date for the document search.
  * @param FechaHasta The end date for the document search.
  * @returns An Observable containing the response data.
  */
  getDocumentIssuedBusiness(IdEmpresa: number,
    FechaDesde: string,
    FechaHasta: string): Observable<any> {
    const url = ApiRoutes.Document.Get_DocIssuedBusiness;
    var body = { IdEmpresa, FechaDesde, FechaHasta };
    const headers = this.commonService.createHeaders();

    return this.http.post<Response>(url, body, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            this._documentsIssued = resp.Data;
          }
        }),map(documents => documents.Data.map(this.mapToViewDocument))
      );
  }

  private mapToViewDocument(document: any): ViewDocumentIssued {
    return {
      Anio: document.Anio,
      Mes: document.Mes,
      Dia: document.Dia,
      FechaDocumento: document['Fecha Documento'],
      FechayHoraAutorizacion: document['Fecha y Hora Autorizacion'],
      Receptor: document.Receptor,
      TipoDocumento: document['Tipo Documento'],
      Documento: document.Documento,
      ClaveAcceso: document['Clave Acceso']
    };
  }

  downloadPDF(Id: string): Observable<any> {
    const url = `${ApiRoutes.Document.Download_PDF}/${Id}`;
    const headers = this.commonService.createHeaders();
    return this.http.get<Blob>(url, { headers, responseType: 'arraybuffer' as 'json' });
  }

  downloadXML(Id: string): Observable<any> {
    const url = `${ApiRoutes.Document.Download_XML}/${Id}`;
    const headers = this.commonService.createHeaders();
    return this.http.get<Blob>(url, { headers, responseType: 'arraybuffer' as 'json'});
  }

  forwardDocumentMail(clave_acceso: string, email_copia: string): Observable<any> {
    const url = ApiRoutes.Document.ForwardingDocumentByMail;
    const headers = this.commonService.createHeaders();
    var body = { clave_acceso, email_copia };
    return this.http.post<Response>(url, body, { headers });
  }

}

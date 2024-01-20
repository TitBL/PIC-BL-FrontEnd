import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';
import { ViewDocumentIssued, ViewDocumentReceived } from '../interfaces/documento';

@Injectable({
  providedIn: 'root'
})

export class DocumentoService {
  private baseUrl: string = environment.baseUrl;
  private _documentsReceived!: ViewDocumentReceived[];
  private _documentsIssued!: ViewDocumentIssued[];
  private token = localStorage.getItem('token');
  private session = localStorage.getItem('session');


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

  constructor(private http: HttpClient) { }
  
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
    const url = `${this.baseUrl}/documento/list/recibidos/consumidor`;
    var body = { IdEmpresa, FechaDesde, FechaHasta };
    const headers = this.createHeaders();

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
    const url = `${this.baseUrl}/documento/list/recibidos/empresa`;
    var body = { IdEmpresa, FechaDesde, FechaHasta };
    const headers = this.createHeaders();

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
    const url = `${this.baseUrl}/documento/list/emitidos/empresa`;
    var body = { IdEmpresa, FechaDesde, FechaHasta };
    const headers = this.createHeaders();

    return this.http.post<Response>(url, body, { headers })
      .pipe(
        tap(resp => {
          if (resp.Success) {
            this._documentsIssued = resp.Data;
          }
        })
      );
  }

  /**
   * Maps the response data to the ViewDocumentIssued model.
   * @param item The item to be mapped.
   * @returns The mapped ViewDocumentIssued object.
   */
  private mapToViewDocumentIssued(item: any): ViewDocumentIssued {
    return {
      Anio: item.Anio,
      Mes: item.Mes,
      Dia: item.Dia,
      FechaDocumento: item['Fecha Documento'],
      FechayHoraAutorizacion: item['Fecha y Hora Autorizacion'],
      Receptor: item.Receptor,
      TipoDocumento: item.TipoDocumento,
      Documento: item.Documento,
      ClaveAcceso: item.ClaveAcceso
    };
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

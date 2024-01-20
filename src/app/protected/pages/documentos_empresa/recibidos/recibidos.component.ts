import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewDocumentReceived } from 'src/app/protected/interfaces/documento';
import { DocumentoService } from 'src/app/protected/services/documento.service';

@Component({
  selector: 'app-recibidos',
  templateUrl: './recibidos.component.html',
  styleUrls: ['./recibidos.component.css']
})
export class RecibidosEmpresaComponent implements OnInit {
   // Columns to be displayed in the table
  displayedColumns: string[] = ['FechaDocumento',
    'FechayHoraAutorizacion',
    'Emisor',
    'TipoDocumento',
    'Documento',
    'ClaveAcceso',
    'funciones'];
  // Data source for the table
  dataSource!: ViewDocumentReceived[];

  constructor(private documentoService: DocumentoService,
    private _snackBar: MatSnackBar) { }

   /**
   * Retrieves the list of received documents for a business within a specified date range.
   * @param _idEmpresa The ID of the business.
   * @param _fechaDesde The start date for the document search.
   * @param _fechaHasta The end date for the document search.
   */
  getDocumentReceivedBusinessList(_idEmpresa: number, _fechaDesde: string, _fechaHasta: string) {
    this.documentoService.getDocumentReceivedBusiness(_idEmpresa, _fechaDesde, _fechaHasta)
      .subscribe(ok => {
        console.log('RESPONSE DATA: ', ok);
        if (ok.Success === true) {

          this.dataSource = ok.Data;
        } else {

          this._snackBar.open('Ha ocurrido un error en la consulta', '', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: 'app-notification-error'
          });
        }
      })
  }

   /**
   * Initializes the component and retrieves the list of received documents for the business.
   */
  ngOnInit(): void {
    console.log("ngOnInit APLICATION DOC RECIBIDOS");
    this.getDocumentReceivedBusinessList(83, "2023-01-01", "2023-12-31");
  }

}

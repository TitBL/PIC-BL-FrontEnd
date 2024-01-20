import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionsEnum } from 'src/app/protected/enums/permissions.enum';
import { ViewDocumentIssued } from 'src/app/protected/interfaces/documento';
import { DocumentoService } from 'src/app/protected/services/documento.service';
import { PermissionsService } from 'src/app/protected/services/permissions.service';

@Component({
  selector: 'app-emitidos',
  templateUrl: './emitidos.component.html',
  styleUrls: ['./emitidos.component.css']
})
export class EmitidosEmpresaComponent implements OnInit {
  // Columns to be displayed in the table
  displayedColumns: string[] = ['FechaDocumento',
    'Receptor',
    'Documento',
    'ClaveAcceso',
    'funciones'];
  // Data source for the table
  dataSource!: ViewDocumentIssued[];

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  // Permission flags for various actions
  visualizarDocumentos: boolean = true;
  descargarDocumentos: boolean = true;
  reenviarDocumentos: boolean = true;

  constructor(private documentoService: DocumentoService,
              private _snackBar: MatSnackBar, 
              private permissionsService: PermissionsService) { }

  /**
   * Retrieves the list of issued documents for a business within a specified date range.
   * @param _idEmpresa The ID of the business.
   * @param _fechaDesde The start date for the document search.
   * @param _fechaHasta The end date for the document search.
   */
  getDocumentIssuedBusinessList(_idEmpresa: number, _fechaDesde: string, _fechaHasta: string) {
    this.documentoService.getDocumentIssuedBusiness(_idEmpresa, _fechaDesde, _fechaHasta)
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
   * Initializes the component and retrieves the list of issued documents for the business.
   */
  ngOnInit(): void {
    this.visualizarDocumentos = this.hasPermission(PermissionsEnum.VisualizarDocumentosEmpresasEmitidos);
    this.descargarDocumentos = this.hasPermission(PermissionsEnum.DescargarDocumentosEmpresasEmitidos);
    this.reenviarDocumentos = this.hasPermission(PermissionsEnum.ReenviarPorEmailDocumentosEmpresasEmitidos);
    
    this.getDocumentIssuedBusinessList(83, "2023-01-01", "2023-12-31");
  }

  searchDocuments() {
    // Utiliza las fechas seleccionadas en lugar de las fechas fijas
    const fechaDesde = this.fechaDesde ? this.fechaDesde.toISOString().split('T')[0] : '';
    const fechaHasta = this.fechaHasta ? this.fechaHasta.toISOString().split('T')[0] : '';

    // Llama a la función que carga los documentos con las fechas seleccionadas
    this.getDocumentIssuedBusinessList(83, fechaDesde, fechaHasta);
  }

   /**
   * Checks if the user has the specified permission.
   * @param permisoId The ID of the permission to check.
   * @returns True if the user has the permission, otherwise false.
   */
   hasPermission(permisoId: number): boolean {
    return this.permissionsService.hasPermission(permisoId);
  }

}

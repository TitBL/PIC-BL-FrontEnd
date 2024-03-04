import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PdfViewerComponent } from 'src/app/protected/components/pdf-viewer/pdf-viewer.component';
import { PermissionsEnum } from 'src/app/protected/enums/permissions.enum';
import { HistogramTransactions, LastTransactions, ReportByDocumentType } from 'src/app/protected/interfaces/reporte';
import { TableData } from 'src/app/protected/interfaces/table-data';
import { DocumentoService } from 'src/app/protected/services/documento.service';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { UsuarioService } from 'src/app/protected/services/usuario.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-consumer-panel',
  templateUrl: './consumer-panel.component.html',
  styleUrls: ['./consumer-panel.component.css']
})
export class ConsumerPanelComponent implements OnInit {
  displayedColumns: string[] = ['Emisor',
    'Numero',
    'Tipo',
    'Fecha',
    'ClaveAcceso',
    'Funciones'];
  loading = false;
  dataSourceRecibidos: TableData | undefined;
  dataSourceTableRecibidos = new MatTableDataSource<LastTransactions>();

  isDataSourceRecEmpty = true;

 // Permission flags for various actions
 visualizarDocumentos: boolean = true;
 descargarDocumentos: boolean = true;

 idUserSession: number = -1;



  constructor(private usuarioService: UsuarioService,
    private commonService: CommonService,
    private permissionsService: PermissionsService,
    private documentoService: DocumentoService,
    private dialog: MatDialog
  ) {

  }
  ngOnInit(): void {
     //#region PERMISOS
     this.visualizarDocumentos = this.hasPermission(PermissionsEnum.VisualizarDocumentosRecibidos);
     this.descargarDocumentos = this.hasPermission(PermissionsEnum.DescargarDocumentosRecibidos);
     //#endregion
     if (this.visualizarDocumentos) {
       this.idUserSession = this.usuarioService.getIdUserSession();
       this.getReport();
     }
    
  }
 /**
* Checks if the user has the specified permission.
* @param permisoId The ID of the permission to check.
* @returns True if the user has the permission, otherwise false.
*/
hasPermission(permisoId: number): boolean {
  return this.permissionsService.hasPermission(permisoId);
}

  getReport(): void {
    this.loading = true;
    this.usuarioService.getProfileDash().subscribe(response => {
      if (response !== undefined) {
        console.log(response.Data);
        this.dataSourceRecibidos = this.createTableDataFromJson(response.Data.HistogramaTransacciones ?? []);
        this.dataSourceTableRecibidos.data = response.Data.UltimasTransacciones;
        this.isDataSourceRecEmpty = response.Data.UltimasTransacciones.length !== 0 ? false : true;

      } else {
        this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
      }
    }, error => {
      console.error('Error:', error);
      this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
    }).add(() => {
      this.loading = false;
    });
  }

  // Función para crear el objeto TableData a partir del JSON
  createTableDataFromJson(jsonData: HistogramTransactions[]): any {
    if (jsonData.length !== 0) {
      const tableData: TableData = {
        columns: [{ type: 'string', label: 'Fecha' },
        { type: 'number', label: 'Transacciones' }],
        rows: []
      };

      jsonData.forEach(row => {
        const newRow: any[] = [row.day, parseInt(row.transac)];
        tableData.rows.push(newRow);
      });
      console.log(tableData);
      return tableData;
    }
    return undefined;
  }

  openPdfModal(_claveAcceso: string): void {
    // Bloquear la pantalla
    this.loading = true;
    this.documentoService.downloadPDF(_claveAcceso)
      .subscribe((response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const dialogRef = this.dialog.open(PdfViewerComponent, {
          width: '80%',
          data: { pdfData: blob },
        });
      },
        (error) => {
          console.error('Error downloading PDF:', error);
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }).add(() => {
          // Desbloquear la pantalla cuando se complete la operación
          this.loading = false;
        });
  }

  downloadPDF(_claveAcceso: string) {
    // Bloquear la pantalla
    this.loading = true;
    this.documentoService.downloadPDF(_claveAcceso)
      .subscribe((response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const fileType = response.type;
        this.commonService.downloadFileFromBytes(blob, `${_claveAcceso}.pdf`, fileType);

      },
        (error) => {
          console.error('Error downloading PDF:', error);
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }).add(() => {
          // Desbloquear la pantalla cuando se complete la operación
          this.loading = false;
        });
  }

}

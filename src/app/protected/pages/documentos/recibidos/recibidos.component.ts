import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PdfViewerComponent } from 'src/app/protected/components/pdf-viewer/pdf-viewer.component';
import { PermissionsEnum } from 'src/app/protected/enums/permissions.enum';
import { ViewDocumentReceived } from 'src/app/protected/interfaces/documento';
import { DocumentoService } from 'src/app/protected/services/documento.service';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { UsuarioService } from 'src/app/protected/services/usuario.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-recibidos',
  templateUrl: './recibidos.component.html',
  styleUrls: ['./recibidos.component.css']
})
export class RecibidosComponent implements OnInit, AfterViewInit {

  // Columns to be displayed in the table
  displayedColumns: string[] = ['FechaDocumento',
    'Emisor',
    'Documento',
    'ClaveAcceso',
    'funciones'];
  // Data source for the table
  dataSource = new MatTableDataSource<ViewDocumentReceived>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  fechaDesde: Date | null = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  fechaHasta: Date | null = new Date();

  // Permission flags for various actions
  visualizarDocumentos: boolean = true;
  descargarDocumentos: boolean = true;
  reenviarDocumentos: boolean = true;

  selectedDocumentType: string | undefined;
  idUserSession: number = 0;
  filterValue: string = '';
  loading: boolean = false;

  constructor(private documentoService: DocumentoService,
    private permissionsService: PermissionsService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private router: Router) { }
  /**
* Initializes the component and retrieves the list of issued documents for the business.
*/
  ngOnInit(): void {
    //#region PERMISOS
    this.visualizarDocumentos = this.hasPermission(PermissionsEnum.VisualizarDocumentosRecibidos);
    this.descargarDocumentos = this.hasPermission(PermissionsEnum.DescargarDocumentosRecibidos);
    this.reenviarDocumentos = this.hasPermission(PermissionsEnum.EnviarPorEmailDocumentosRecibidos);
    //#endregion
    if (this.visualizarDocumentos) {
      this.idUserSession = this.usuarioService.getIdUserSession();
      this.searchDocuments();
    } else {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
  }

  /**
    * Retrieves the list of received documents for a consumer within a specified date range.
    * @param _idUsuario The ID of the user (consumer).
    * @param _fechaDesde The start date for the document search.
    * @param _fechaHasta The end date for the document search.
    */
  getDocumentReceivedConsumerList(_idUsuario: number, _fechaDesde: string, _fechaHasta: string) {
    // Bloquear la pantalla
    this.loading = true;
    this.documentoService.getDocumentReceivedConsumer(_idUsuario, _fechaDesde, _fechaHasta)
      .subscribe(ok => {
        if (ok !== undefined) {
          this.dataSource.data = ok.Data;
          this.applyFilter();
        } else {
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }
      },
        (error) => {
          console.error('Error:', error);
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

  downloadXML(_claveAcceso: string) {
    // Bloquear la pantalla
    this.loading = true;
    this.documentoService.downloadXML(_claveAcceso)
      .subscribe((response: any) => {
        const blob = new Blob([response], { type: 'application/xml' });
        const fileType = response.type;
        this.commonService.downloadFileFromBytes(blob, `${_claveAcceso}.xml`, fileType);
      },
        (error) => {
          console.error('Error downloading XML:', error);
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }).add(() => {
          // Desbloquear la pantalla cuando se complete la operación
          this.loading = false;
        });
  }

  forwardDocument(_claveAcceso: string, _email_copia: string) {
    // Bloquear la pantalla
    this.loading = true;
    this.documentoService.forwardDocumentMail(_claveAcceso, _email_copia)
      .subscribe((response: any) => {
        console.log(response);
        this.commonService.notifySuccessResponse(response.Data['message']);
      },
        (error) => {
          console.error('Error downloading XML:', error);
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }).add(() => {
          // Desbloquear la pantalla cuando se complete la operación
          this.loading = false;
        });
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



  searchDocuments() {
    // Utiliza las fechas seleccionadas en lugar de las fechas fijas
    const fechaDesde = this.fechaDesde ? this.fechaDesde.toISOString().split('T')[0] : '';
    const fechaHasta = this.fechaHasta ? this.fechaHasta.toISOString().split('T')[0] : '';

    // Llama a la función que carga los documentos con las fechas seleccionadas
    this.getDocumentReceivedConsumerList(this.idUserSession, fechaDesde, fechaHasta);
  }


  applyFilter() {
    // Convertir la cadena de filtro a minúsculas para hacer una comparación sin distinción entre mayúsculas y minúsculas
    const lowerCaseFilter = this.filterValue.trim().toLowerCase();
    // Aplicar el filtro a la fuente de datos
    this.dataSource.filter = lowerCaseFilter;
  }

  /**
* Checks if the user has the specified permission.
* @param permisoId The ID of the permission to check.
* @returns True if the user has the permission, otherwise false.
*/
  hasPermission(permisoId: number): boolean {
    return this.permissionsService.hasPermission(permisoId);
  }

  onDocumentTypeSelected(documentType: string) {
    this.selectedDocumentType = documentType;
    // Convertir la cadena de filtro a minúsculas para hacer una comparación sin distinción entre mayúsculas y minúsculas
    const lowerCaseFilter = documentType.trim().toLowerCase();
    // Aplicar el filtro a la fuente de datos
    this.dataSource.filter = lowerCaseFilter;
  }


}

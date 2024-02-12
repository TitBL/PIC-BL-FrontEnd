import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Empresa, ViewEmpresa } from '../../../interfaces/empresa';
import { EmpresaService } from 'src/app/protected/services/empresa.service';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { PermissionsEnum } from 'src/app/protected/enums/permissions.enum';
import { CommonService } from 'src/app/shared/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from 'src/app/protected/components/dialog-template/dialog-template.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit, AfterViewInit {
  // Columns to be displayed in the table
  displayedColumns: string[] = ['logo',
    'RUC',
    'razon_social',
    'nombre_comercial',
    'funciones'];
  // Data source for the table
  dataSource = new MatTableDataSource<ViewEmpresa>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //filteredDataSource: ViewEmpresa[] = [];
  // Selected state for filtering the business list
  selected = '1';
  // Permission flags for various actions
  visualizarEmpresa: boolean = true;
  crearEmpresa: boolean = true;
  editarEmpresa: boolean = true;
  cambiarEstadoEmpresa: boolean = true;

  isNew: boolean = true;
  idEmpresa: number = -1;
  filterValue: string = '';

  loading: boolean = false;

  empresaTemp: Empresa = {
    id: 0,
    RUC: '',
    RazonSocial: '',
    NombreComercial: '',
    PuedeEnviarCorreo: false,
    UsaConfiguracionSMTP: true,
    Email: '',
    Servidor: '',
    Puerto: 0,
    TipoSeguridad: 0,
    UsuarioSMTP: '',
    PasswordSMTP: '',
    APIKey: '',
    Logo: ''
  };


  constructor(private empresaService: EmpresaService,
    private permissionsService: PermissionsService,
    private dialog: MatDialog,
    public commonService: CommonService) { }

  /**
   * Initializes the component and sets the initial values for permissions and business list.
   */
  ngOnInit(): void {
    this.getBusinessList(this.selected);

    this.visualizarEmpresa = this.hasPermission(PermissionsEnum.VisualizarEmpresa);
    this.crearEmpresa = this.hasPermission(PermissionsEnum.CrearEmpresa);
    this.editarEmpresa = this.hasPermission(PermissionsEnum.EditarEmpresa);
    this.cambiarEstadoEmpresa = this.hasPermission(PermissionsEnum.HabilitarDeshabilitarEmpresa);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 5;
  }

  /**
* Retrieves the list of businesses based on the selected state.
* @param _estado The selected state for filtering the business list.
*/
  getBusinessList(_estado: string) {
    // Bloquear la pantalla
    this.loading = true;
    this.empresaService.getBusinessByState(_estado)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.dataSource.data = ok.Data;
          this.applyFilter();
        } else {
          // this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }
      }).add(() => {
        // Desbloquear la pantalla cuando se complete la operación
        this.loading = false;
      });
  }



  /**
  * Handles the change event of the state dropdown and retrieves the filtered business list.
  * @param event The change event object.
  */
  onSelectChange(event: string) {
    this.selected = event;
    this.getBusinessList(event);
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

  openNewEmpresaModal(): void {
    this.empresaService.openNewEmpresaModal(this.isNew, this.idEmpresa);
  }

  toggleBusinessStatusById(_empresa: ViewEmpresa, _enable: boolean) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '400px', // Ajusta el tamaño según tus necesidades
      disableClose: true, // Opcional: Para evitar cerrar la modal haciendo clic fuera de ella
    });
    dialogRef.componentInstance.setTitle(_enable? 'Habilitar ': 'Deshabilitar '+`${_empresa.nombre_comercial}`);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Bloquear la pantalla
        this.loading = true;
        this.empresaService.toggleBusinessStatus(_empresa.id, _enable).subscribe(
          (respuesta) => {
            this.commonService.notifySuccessResponse(respuesta.Message);
            this.getBusinessList(this.selected);
          },
          (error) => {
            console.error('Error:', error);
          }
        ).add(() => {
          // Desbloquear la pantalla cuando se complete la operación
          this.loading = false;
        });
      }
    });
  }

}

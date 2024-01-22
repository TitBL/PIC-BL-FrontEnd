import { Component, OnInit, ViewChild } from '@angular/core';
import { Empresa, ViewEmpresa } from '../../../interfaces/empresa';
import { EmpresaService } from 'src/app/protected/services/empresa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadosEnum } from 'src/app/protected/enums/estados.enum';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { PermissionsEnum } from 'src/app/protected/enums/permissions.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
  // Columns to be displayed in the table
  displayedColumns: string[] = ['logo',
    'RUC',
    'razon_social',
    'nombre_comercial',
    'funciones'];
  // Data source for the table
  //dataSource!: ViewEmpresa[];
  dataSource: ViewEmpresa[] = [];
  filteredDataSource: ViewEmpresa[] = [];
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

  empresaTemp: Empresa = {
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
    private _snackBar: MatSnackBar,
    private permissionsService: PermissionsService) { }

  /**
* Retrieves the list of businesses based on the selected state.
* @param _estado The selected state for filtering the business list.
*/
  getBusinessList(_estado: string) {
    this.empresaService.getBusinessByState(_estado)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.dataSource = ok.Data;
          this.applyFilter();
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
   * Initializes the component and sets the initial values for permissions and business list.
   */
  ngOnInit(): void {
    this.visualizarEmpresa = this.hasPermission(PermissionsEnum.VisualizarEmpresa);
    this.crearEmpresa = this.hasPermission(PermissionsEnum.CrearEmpresa);
    this.editarEmpresa = this.hasPermission(PermissionsEnum.EditarEmpresa);
    this.cambiarEstadoEmpresa = this.hasPermission(PermissionsEnum.HabilitarDeshabilitarEmpresa);
    this.getBusinessList(this.selected);
  }

  /**
  * Handles the change event of the state dropdown and retrieves the filtered business list.
  * @param event The change event object.
  */
  onSelectChange(event: any) {
    this.getBusinessList(event.value);
  }

  applyFilter() {
    // Convertir la cadena de filtro a minúsculas para hacer una comparación sin distinción entre mayúsculas y minúsculas
    const lowerCaseFilter = this.filterValue.toLowerCase();
    // Filtrar la lista original basándose en el valor proporcionado
    this.filteredDataSource = this.dataSource.filter((empresa) => {
      // Comprobar si la cadena de filtro está presente en alguna de las propiedades
      return (
        empresa.RUC.toLowerCase().includes(lowerCaseFilter) ||
        empresa.razon_social.toLowerCase().includes(lowerCaseFilter) ||
        empresa.nombre_comercial.toLowerCase().includes(lowerCaseFilter)
      );
    });
  }



  /**
  * Gets the human-readable name of a business state based on the provided state enum.
  * @param _state The business state enum value.
  * @returns The human-readable name of the business state.
  */
  getNameState(_state: EstadosEnum): string {
    return _state === EstadosEnum.Activo ? 'Activo' : 'Inactivo';
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

  // Método llamado desde el modal para guardar la empresa
  guardarEmpresa(empresa: any) {
    // Lógica para guardar la empresa, ya sea creando una nueva o editando según el estado de nuevaEmpresa
    if (this.isNew) {
      // Crear nueva empresa
      this.empresaService.createNewBusiness(empresa).subscribe(
        (respuesta) => {
          // Manejar la respuesta del servicio si es necesario
          console.log('Nueva empresa creada:', respuesta);
        },
        (error) => {
          // Manejar errores si es necesario
          console.error('Error al crear la nueva empresa:', error);
        }
      );
    } else {
      // Editar empresa existente
      // Puedes llamar a un método del servicio para actualizar la empresa existente
    }
  }

  toggleBusinessStatusById(_id: number, _enable: boolean) {
    this.empresaService.toggleBusinessStatus(_id, _enable).subscribe(
      (respuesta) => {
        console.log(respuesta);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


  isValidImageUrl(url: string): string {
    const imageFormatRegex = /\.(jpeg|jpg|gif|png|bmp)$/;
    return imageFormatRegex.test(url)? url : environment.urlSinImagen;
  }
}

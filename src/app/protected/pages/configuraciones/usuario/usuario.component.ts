import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadosEnum } from 'src/app/protected/enums/estados.enum';
import { PermissionsEnum } from 'src/app/protected/enums/permissions.enum';
import { NewUsuario, ViewUsuario } from 'src/app/protected/interfaces/usersession';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { UsuarioService } from 'src/app/protected/services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit{
  // Columns to be displayed in the table
  displayedColumns: string[] = ['NombreUsuario',
    'Rol',
    'email',
    'funciones'];
  // Data source for the table
  dataSource: ViewUsuario[] = [];
  filteredDataSource: ViewUsuario[] = [];
  // Selected state for filtering the business list
  selected = '1';
  // Permission flags for various actions
  visualizarUsuario: boolean = true;
  crearUsuario: boolean = true;
  editarUsuario: boolean = true;
  cambiarEstadoUsuario: boolean = true;
  asignarEmpresasAUsuario:boolean = true;



  isNew: boolean = true;
  idEmpresa: number = -1;
  filterValue: string = '';

  usuario!: NewUsuario;


  constructor(private usuarioService: UsuarioService,
    private _snackBar: MatSnackBar,
    private permissionsService: PermissionsService) { }

  /**
  * Retrieves the list of businesses based on the selected state.
  * @param _estado The selected state for filtering the business list.
  */
  getUsersList(_estado: string) {
    this.usuarioService.getUsersByState(_estado)
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
    this.visualizarUsuario = this.hasPermission(PermissionsEnum.VisualizarUsuario);
    this.crearUsuario = this.hasPermission(PermissionsEnum.CrearUsuario);
    this.editarUsuario = this.hasPermission(PermissionsEnum.EditarUsuario);
    this.cambiarEstadoUsuario = this.hasPermission(PermissionsEnum.HabilitarDeshabilitarUsuario);
    this.asignarEmpresasAUsuario = this.hasPermission(PermissionsEnum.AsignarEmpresasAUsuario);
    this.getUsersList(this.selected);
  }

  /**
  * Handles the change event of the state dropdown and retrieves the filtered business list.
  * @param event The change event object.
  */
  onSelectChange(event: any) {
    this.getUsersList(event.value);
  }

  applyFilter() {
    // Convertir la cadena de filtro a minúsculas para hacer una comparación sin distinción entre mayúsculas y minúsculas
    const lowerCaseFilter = this.filterValue.toLowerCase();
    // Filtrar la lista original basándose en el valor proporcionado
    this.filteredDataSource = this.dataSource.filter((usuario) => {
      // Comprobar si la cadena de filtro está presente en alguna de las propiedades
      return (
        usuario.NombreUsuario.toLowerCase().includes(lowerCaseFilter) ||
        usuario.Rol.toLowerCase().includes(lowerCaseFilter)
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

  openNewUserModal(): void {
    this.usuarioService.openNewUserModal(this.isNew, this.idEmpresa);
  }

  // Método llamado desde el modal para guardar la empresa
  guardarUsuario(empresa: any) {
    // Lógica para guardar la empresa, ya sea creando una nueva o editando según el estado de nuevaEmpresa
    if (this.isNew) {
      // Crear nueva empresa
      this.usuarioService.createNewUser(empresa).subscribe(
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

  toggleUserStatusById(_id: number, _enable: boolean) {
    this.usuarioService.toggleUserStatus(_id, _enable).subscribe(
      (respuesta) => {
        console.log(respuesta);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

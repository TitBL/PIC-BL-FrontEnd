import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogTemplateComponent } from 'src/app/protected/components/dialog-template/dialog-template.component';
import { EstadosEnum } from 'src/app/protected/enums/estados.enum';
import { PermissionsEnum } from 'src/app/protected/enums/permissions.enum';
import { NewUsuario, ViewUsuario } from 'src/app/protected/interfaces/usersession';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { UsuarioService } from 'src/app/protected/services/usuario.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  // Columns to be displayed in the table
  displayedColumns: string[] = ['NombreUsuario',
    'Rol',
    'email',
    'funciones'];
  // Data source for the table
  dataSource= new MatTableDataSource<ViewUsuario>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Selected state for filtering the business list
  selected = '1';
  // Permission flags for various actions
  visualizarUsuario: boolean = true;
  crearUsuario: boolean = true;
  editarUsuario: boolean = true;
  cambiarEstadoUsuario: boolean = true;
  asignarEmpresasAUsuario: boolean = true;


  loading: boolean = false;
  isNew: boolean = true;
  idUsuario: number = -1;
  filterValue: string = '';

  usuario!: NewUsuario;


  constructor(private usuarioService: UsuarioService,
    private permissionsService: PermissionsService,
    private dialog: MatDialog,
    public commonService: CommonService) { }

  /**
  * Initializes the component and sets the initial values for permissions and business list.
  */
  ngOnInit(): void {
    this.getUsersList(this.selected);
    this.visualizarUsuario = this.hasPermission(PermissionsEnum.VisualizarUsuario);
    this.crearUsuario = this.hasPermission(PermissionsEnum.CrearUsuario);
    this.editarUsuario = this.hasPermission(PermissionsEnum.EditarUsuario);
    this.cambiarEstadoUsuario = this.hasPermission(PermissionsEnum.HabilitarDeshabilitarUsuario);
    this.asignarEmpresasAUsuario = this.hasPermission(PermissionsEnum.AsignarEmpresasAUsuario);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
  }

  /**
  * Retrieves the list of businesses based on the selected state.
  * @param _estado The selected state for filtering the business list.
  */
  getUsersList(_estado: string) {
    // Bloquear la pantalla
    this.loading = true;
    this.usuarioService.getUsersByState(_estado)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.dataSource.data = ok.Data;
          this.applyFilter();
        } else {
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
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
    this.getUsersList(event);
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

  openNewUserModal(): void {
    this.usuarioService.openNewUserModal(this.isNew, this.idUsuario);
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

  toggleUserStatusById(_user: ViewUsuario, _enable: boolean) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.componentInstance.setTitle(_enable? 'Habilitar ': 'Deshabilitar '+`${_user.NombreUsuario}`);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Bloquear la pantalla
        this.loading = true;
        this.usuarioService.toggleUserStatus(_user.id, _enable).subscribe(
          (respuesta) => {
            console.log(respuesta);
            this.getUsersList(this.selected);
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

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RolService } from '../../../services/rol.service';
import { Rol } from 'src/app/protected/interfaces/rol';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogTemplateComponent } from 'src/app/protected/components/dialog-template/dialog-template.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Nombre',
    'Descripcion',
    'Funciones'];

  dataSource = new MatTableDataSource<Rol>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Selected state for filtering the business list
  selected = '1';
  loading: boolean = false;
  filterValue: string = '';
  isNew: boolean = true;
  idRol: number = -1;


  constructor(private rolService: RolService,
    private dialog: MatDialog,
    public commonService: CommonService) { }

  ngOnInit(): void {
    
    this.getRolesList(this.selected);
     // Suscribirse al evento de guardado de rol
     this.rolService.onRolSaved().subscribe(() => {
      this.getRolesList(this.selected); // Recargar los datos de la tabla
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
  }

  getRolesList(_state: string) {
       // Bloquear la pantalla
       this.loading = true;
    this.rolService.getRolesByState(_state)
      .subscribe(ok => {
        console.log('RESPONSE DATA: ', ok);
        if (ok.Success === true) {
          this.dataSource.data = ok.Data;
        }
      }).add(() => {
        // Desbloquear la pantalla cuando se complete la operación
        this.loading = false;
      });
  }
  applyFilter() {
    // Convertir la cadena de filtro a minúsculas para hacer una comparación sin distinción entre mayúsculas y minúsculas
  const lowerCaseFilter = this.filterValue.trim().toLowerCase();
  // Aplicar el filtro a la fuente de datos
  this.dataSource.filter = lowerCaseFilter;
}
  
  /**
  * Handles the change event of the state dropdown and retrieves the filtered business list.
  * @param event The change event object.
  */
  onSelectChange(event: string) {
    this.selected = event;
    this.getRolesList(event);
  }

  openNewRolModal(): void {
    this.rolService.openNewRolModal(this.isNew, this.idRol);
  }

  toggleRolStatusById(_rol: Rol, _enable: boolean) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.componentInstance.setTitle(_enable? 'Habilitar ': 'Deshabilitar '+`${_rol.Nombre}`);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Bloquear la pantalla
        this.loading = true;
        this.rolService.toggleRolStatus(_rol.id, _enable).subscribe(
          (respuesta) => {
            this.commonService.notifySuccessResponse(respuesta.Message);
            this.getRolesList(this.selected);
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

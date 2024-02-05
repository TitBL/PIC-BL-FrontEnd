import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RolService } from '../../../services/rol.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadosEnum } from 'src/app/protected/enums/estados.enum';
import { Rol } from 'src/app/protected/interfaces/rol';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  selected: EstadosEnum = EstadosEnum.Activo;
  loading: boolean = false;

  constructor(private rolService: RolService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getRolesList(this.selected);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
  }

  getRolesList(_state: EstadosEnum) {
       // Bloquear la pantalla
       this.loading = true;
    this.rolService.getRolesByState(_state)
      .subscribe(ok => {
        console.log('RESPONSE DATA: ', ok);
        if (ok.Success === true) {
          // this.router.navigateByUrl('/dashboard');
          this.dataSource.data = ok.Data;
        } else {

          this._snackBar.open('Ha ocurrido un error en la consulta', '', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: 'app-notification-error'
          });
        }
      }).add(() => {
        // Desbloquear la pantalla cuando se complete la operación
        this.loading = false;
      });
  }

}

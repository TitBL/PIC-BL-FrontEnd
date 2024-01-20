import { Component, OnInit } from '@angular/core';
import { RolService } from '../../../services/rol.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadosEnum } from 'src/app/protected/enums/estados.enum';
import { Rol } from 'src/app/protected/interfaces/rol';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {
  displayedColumns: string[] = ['Nombre', 
                                'Descripcion', 
                                'Funciones'];
  dataSource! : Rol[];
// Selected state for filtering the business list
selected:EstadosEnum = EstadosEnum.Activo;


  constructor(private rolService: RolService,
              private _snackBar: MatSnackBar) { }

  getRolesList(_state:EstadosEnum){
    this.rolService.getRolesByState(_state)
    .subscribe(ok => {
      console.log('RESPONSE DATA: ', ok);
      if (ok.Success === true) {
       // this.router.navigateByUrl('/dashboard');
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

  ngOnInit(): void {
    console.log("ngOnInit APLICATION ROLES");
    this.getRolesList(this.selected);
    //this.dataSource = new MatTableDataSource<Permiso>(this.rolService.permisos);
  }
}

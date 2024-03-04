import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadosEnum } from 'src/app/protected/enums/estados.enum';
import { Rol } from 'src/app/protected/interfaces/rol';
import { RolService } from 'src/app/protected/services/rol.service';

@Component({
  selector: 'app-rol-select',
  templateUrl: './rol-select.component.html',
  styleUrls: ['./rol-select.component.css']
})
export class RolSelectComponent implements OnInit {
  rolesList: Rol[] = [];

  constructor(private rolService: RolService) { }

  ngOnInit(): void {
    // Agregar roles por defecto
    if (this.rolService.isUserSessionMaster()) {
      this.rolesList.push({ id: 1, Nombre: 'Master', Descripcion: 'Rol de administrador', estado: EstadosEnum.Activo });
      this.rolesList.push({ id: 0, Nombre: 'Consumidor', Descripcion: 'Rol de consumidor', estado: EstadosEnum.Activo });
    }

    // Cargar roles adicionales desde el servicio
    this.loadRolesList(EstadosEnum.Activo);
    //this.selectedRol = this.rolesList[0].id;
   
  }

  loadRolesList(_state: string) {

    this.rolService.getRolesByState(_state)
      .subscribe(ok => {
        if (ok.Success === true) {
          // Concatenar los roles obtenidos del servicio con los roles por defecto
          this.rolesList = this.rolesList.concat(ok.Data);
          if (this.preselectedRol !== undefined) {
            this.selectedRol = this.preselectedRol;
          }
        }
      });
  }

  selectedRol: number | undefined;

  @Output() rolSelected = new EventEmitter<number>();
  @Input() classes: string[] = [];
  @Input() required: boolean = false;
  @Input() preselectedRol: number | undefined; 
  @Input() name: string = "roles";

  onRolChange() {
    if (this.selectedRol !== undefined) {
      this.rolSelected.emit(this.selectedRol);
    }
  }
}

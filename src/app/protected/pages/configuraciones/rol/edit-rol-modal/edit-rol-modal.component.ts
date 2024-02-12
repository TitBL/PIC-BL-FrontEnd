import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EstadosEnum } from 'src/app/protected/enums/estados.enum';
import { Permissions } from 'src/app/protected/interfaces/permiso';
import { Rol, UpdateRol } from 'src/app/protected/interfaces/rol';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { RolService } from 'src/app/protected/services/rol.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-edit-rol-modal',
  templateUrl: './edit-rol-modal.component.html',
  styleUrls: ['./edit-rol-modal.component.css']
})
export class EditRolModalComponent implements OnInit {
  @Input() IsNew: boolean = true;
  @Input() idRol: number = 0;
  @Output() guardarRol = new EventEmitter<UpdateRol>();

  rol: Rol = {
    id: 0,
    Descripcion: '',
    estado: EstadosEnum.Activo,
    Nombre: ''
  };

  nuevoFormulario: FormGroup;
  selectedSecurityType: number | undefined;
  loading: boolean = false;
  permissionsList: Permissions[] = [];
  groupedPermissions: { [key: string]: Permissions[] } = {};
  checkedPermissions: number[] = [];



  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    public commonService: CommonService,
    private permissionsService: PermissionsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.nuevoFormulario = this.fb.group({
      Descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });


  }

  // Método llamado al hacer clic en el botón "Guardar" en el modal
  onSaveClick() {
    var _rol: UpdateRol = {
      Descripcion : this.rol.Descripcion,
      Nombre : this.rol.Nombre,
      id : this.rol.id,
      Permisos : this.checkedPermissions
    } 
    this.guardarRol.emit(_rol);
  }


  getRolById(_id: number) {
    this.rolService.getRolById(_id)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.rol = ok.Data;
          this.checkedPermissions = ok.Data.permisos;
          console.log(this.checkedPermissions);
          console.log(this.rol);

        } else {
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }
      })
  }

  getPermissions() {
    this.permissionsService.getPermissions()
      .subscribe(ok => {
        if (ok.Success === true) {
          this.permissionsList = ok.Data;
          this.groupPermissionsByModule();
        }
      })
  }

  // Función para agrupar permisos por módulo
  groupPermissionsByModule(): void {
    this.permissionsList.forEach(permission => {
      if (permission.modulo !== undefined && permission.modulo !== null) {
        if (!this.groupedPermissions[permission.modulo]) {
          this.groupedPermissions[permission.modulo] = [];
        }
        this.groupedPermissions[permission.modulo].push(permission);
      }
    });
  }

  getGroupedPermissionsKeys(): string[] {
    return Object.keys(this.groupedPermissions);
  }

  // Función para manejar el cambio de estado del checkbox
  onCheckboxChange(permissionId: number): void {
    const index = this.checkedPermissions.indexOf(permissionId);
    if (index === -1) {
      this.checkedPermissions.push(permissionId);
    } else {
      this.checkedPermissions.splice(index, 1);
    }
  }


  ngOnInit(): void {
    this.getPermissions();
    this.IsNew = this.data['IsNew'];
    this.idRol = this.data['IdRol'];
    this.rol.id = this.idRol;
    if (!this.IsNew) {
      this.getRolById(this.idRol);
    }
  }
}

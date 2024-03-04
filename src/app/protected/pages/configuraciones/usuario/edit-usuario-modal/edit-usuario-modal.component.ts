import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissionsEnum } from 'src/app/protected/enums/permissions.enum';
import { ViewEmpresaSession } from 'src/app/protected/interfaces/empresa';
import { Usuario } from 'src/app/protected/interfaces/usersession';
import { EmpresaService } from 'src/app/protected/services/empresa.service';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { UsuarioService } from 'src/app/protected/services/usuario.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-edit-usuario-modal',
  templateUrl: './edit-usuario-modal.component.html',
  styleUrls: ['./edit-usuario-modal.component.css']
})
export class EditUsuarioModalComponent implements OnInit {
  @Input() IsNew: boolean = true;
  @Input() IdUsuario: number = 0;
  @Output() guardarUsuario = new EventEmitter<Usuario>();

  businessList: ViewEmpresaSession[] = [];
  crearUsuarioForm: FormGroup;

  loading: boolean = false;
  checkedBusiness: number[] = [];
  repetirContrasena: string | undefined;

  usuario: Usuario = {
    id: -1,
    Direccion: '',
    DNI: '',
    Email: '',
    Empresas: [],
    IdRol: -1,
    NombreCompleto: '',
    NombreUsuario: '',
    Contrasena: '',
    TerminosCondiciones: {
      Aceptado: true,
      FechaRegistro: '',
      TerminosyCondiciones: 'ACEPTADO TERMINOS Y CONDICIONES'
    }
  };

  asignarEmpresasAUsuario: boolean = true;

  constructor(
    private fb: FormBuilder,
    private permissionsService: PermissionsService,
    private commonService: CommonService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.crearUsuarioForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(20)]],
      nombreUsuario: ['', [Validators.required, Validators.maxLength(100)]],
      nombreCompleto: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      roles: ['', [Validators.required]],
      email: ['', [Validators.maxLength(100)]],
      contrasena: ['', [Validators.maxLength(50)]],
      repetirContrasena: ['', [Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.asignarEmpresasAUsuario = this.hasPermission(PermissionsEnum.AsignarEmpresasAUsuario);
    this.businessList = this.empresaService.getBusinessOfUserSession();
    this.businessList.sort((a, b) => a.nombreComercial.localeCompare(b.nombreComercial));
    this.IsNew = this.data['IsNew'];
    this.IdUsuario = this.data['IdUsuario'];
    if (!this.IsNew) {
      this.getUserById(this.IdUsuario);
    }
  }

  /**
  * Checks if the user has the specified permission.
  * @param permisoId The ID of the permission to check.
  * @returns True if the user has the permission, otherwise false.
  */
  hasPermission(permisoId: number): boolean {
    return this.permissionsService.hasPermission(permisoId);
  }

  onSaveUserClick(): void {
    const contrasenaControl = this.crearUsuarioForm.get('contrasena');
    const repetirContrasenaControl = this.crearUsuarioForm.get('repetirContrasena');

    //Verificar si los controles existen y si las contraseñas coinciden
    if (contrasenaControl && repetirContrasenaControl &&
      contrasenaControl.value !== repetirContrasenaControl.value) {
      this.commonService.notifyErrorResponse('Contraseñas no coinciden');
      return;
    }
    this.usuario.Empresas = this.checkedBusiness;
    this.guardarUsuario.emit(this.usuario);
  }

  getUserById(_id: number) {
    this.usuarioService.getUserById(_id)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.usuario = {
            id: ok.Data.id,
            DNI: ok.Data.DNI,
            Direccion: ok.Data.Direccion,
            Email: ok.Data.Email,
            Empresas: [],
            IdRol: parseInt(ok.Data.IdRol),
            NombreCompleto: ok.Data.NombreCompleto,
            NombreUsuario: ok.Data.NombreUsuario,
            Contrasena: ''
          };
          if (ok.Data.TerminosCondiciones !== null) {
            this.usuario.TerminosCondiciones = {
              Aceptado: ok.Data.TerminosCondiciones.Aceptado === "1" ? true : false,
              TerminosyCondiciones: ok.Data.TerminosCondiciones.Terminos,
            }
          }
          // this.usuario.IdRol = parseInt(ok.Data.IdRol);
          if (ok.Data.Empresas.length !== 0) {
            ok.Data.Empresas.forEach((element: { id: number; nombrecomercial: string}) => {
              this.usuario.Empresas.push(element.id);
              this.checkedBusiness.push(element.id);
            });
          }
        } else {
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }
      })
  }



  // Función para manejar el cambio de estado del checkbox
  onCheckboxChange(businessId: number): void {
    const index = this.checkedBusiness.indexOf(businessId);
    if (index === -1) {
      this.checkedBusiness.push(businessId);
    } else {
      this.checkedBusiness.splice(index, 1);
    }
  }

  onRolSelected(rol: number) {
    this.usuario.IdRol = rol;
  }
}

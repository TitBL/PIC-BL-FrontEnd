import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEmpresaSession } from 'src/app/protected/interfaces/empresa';
import { NewUsuario } from 'src/app/protected/interfaces/usersession';
import { EmpresaService } from 'src/app/protected/services/empresa.service';
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
  @Output() guardarUsuario = new EventEmitter<NewUsuario>();

  businessList: ViewEmpresaSession[] = [];
  crearUsuarioForm: FormGroup;

  loading: boolean = false;
  checkedBusiness: number[] = [];
  repetirContrasena: string | undefined;

  usuario: NewUsuario = {
    Contrasena: '',
    Direccion: '',
    DNI: '',
    Email: '',
    Empresas: [],
    IdRol: 0,
    NombreCompleto: '',
    NombreUsuario: '',
    TerminosCondiciones: 'ACEPTO TERMINOS Y CONDICIONES',
    TerminosCondicionesAcceptacion: true
  };

  constructor(
    private fb: FormBuilder,
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
    this.businessList = this.empresaService.getBusinessOfUserSession();
    this.businessList.sort((a, b) => a.nombreComercial.localeCompare(b.nombreComercial));
    this.IsNew = this.data['IsNew'];
    this.IdUsuario = this.data['IdUsuario'];
    if (!this.IsNew) {
      this.getUserById(this.IdUsuario);
    }
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
    console.log('OBJETO', this.usuario);
    console.log('FORMULARIO', this.crearUsuarioForm.value);
    this.guardarUsuario.emit(this.usuario);
  }

  getUserById(_id: number) {
    this.usuarioService.getUserById(_id)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.usuario = ok.Data;
          console.log(ok.Data);
          console.log(this.usuario);
          this.usuario.Empresas = ok.Data.Empresas;
          this.checkedBusiness = ok.Data.Empresas;
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
    console.log(rol);
    this.usuario.IdRol = rol;
  }
}

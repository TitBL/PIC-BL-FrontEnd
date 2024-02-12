import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

  businessList : ViewEmpresaSession[] = [];
  crearUsuarioForm: FormGroup;
  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'USER', label: 'Usuario' },
    // Agrega otros roles según tu aplicación
  ];
  loading: boolean = false;

  usuario: NewUsuario = {
    Contrasena: '',
    Direccion: '',
    DNI: '',
    Email: '',
    Empresas: [],
    IdRol: 0,
    NombreCompleto: '',
    NombreUsuario: '',
    TerminosCondiciones: '',
    TerminosCondicionesAcceptacion: false
  };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private empresaService : EmpresaService,
    private usuarioService : UsuarioService,
    public dialogRef: MatDialogRef<EditUsuarioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    this.crearUsuarioForm = this.fb.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rol: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required],
      repetirContrasena: ['', Validators.required],
      email: ['', Validators.required],
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

  onSubmit() {
    const contrasenaControl = this.crearUsuarioForm.get('contrasena');
    const repetirContrasenaControl = this.crearUsuarioForm.get('repetirContrasena');

    // Verificar si los controles existen y si las contraseñas coinciden
    if (contrasenaControl && repetirContrasenaControl &&
      contrasenaControl.value !== repetirContrasenaControl.value) {
      this.commonService.notifyErrorResponse('Contraseñas no coinciden');
      return;
    }

    this.guardarUsuario.emit(this.crearUsuarioForm.value);
    this.dialogRef.close();
  }

  getUserById(_id: number) {
    this.usuarioService.getUserById(_id)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.usuario = ok.Data;
          console.log(ok.Data);
          console.log(this.usuario);
          
        } else {
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }
      })
  }

  onEmpresaSelected(empresa: number) {
    this.usuario.Empresas.push();
  }
}

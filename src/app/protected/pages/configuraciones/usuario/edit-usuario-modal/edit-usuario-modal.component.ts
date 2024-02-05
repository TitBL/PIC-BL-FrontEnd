import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NewUsuario } from 'src/app/protected/interfaces/usersession';
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
    public dialogRef: MatDialogRef<EditUsuarioModalComponent>
  ) {
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
    // Puedes realizar inicializaciones adicionales aquí si es necesario
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

  onEmpresaSelected(empresa: number) {
    this.usuario.Empresas.push();
  }
}

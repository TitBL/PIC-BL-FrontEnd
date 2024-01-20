import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Empresa } from 'src/app/protected/interfaces/empresa';
import { EmpresaService } from 'src/app/protected/services/empresa.service';

@Component({
  selector: 'app-edit-empresa-modal',
  templateUrl: './edit-empresa-modal.component.html',
  styleUrls: ['./edit-empresa-modal.component.css']
})
export class EditEmpresaModalComponent implements OnInit {
  @Input() IsNew: boolean = true;
  @Input() idEmpresa : number = 0;
  @Output() guardarEmpresa = new EventEmitter<any>();
  
  empresa: Empresa = {
    RUC: '',
    RazonSocial: '',
    NombreComercial: '',
    PuedeEnviarCorreo: false,
    UsaConfiguracionSMTP: true,
    Email: '',
    Servidor: '',
    Puerto: 0,
    TipoSeguridad: 0,
    UsuarioSMTP: '',
    PasswordSMTP: '',
    APIKey: '',
    Logo: ''
  };

  nuevoFormulario: FormGroup;
  apiKeyGenerada: string = ''; // Variable para almacenar la API Key generada


  constructor(private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private empresaService: EmpresaService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.nuevoFormulario = this.fb.group({
      ruc: ['', [Validators.required, Validators.maxLength(20)]],
      razonSocial: ['', [Validators.required, Validators.maxLength(100)]],
      nombreComercial: ['', [Validators.required, Validators.maxLength(100)]],
      puedeEnviarCorreos: [false, [Validators.required]],
      usarConfigSMTP: [true],
      emailParaEnvio: ['', [Validators.maxLength(100)]],
      servidorSMTP: ['', [Validators.maxLength(50)]],
      puertoSMTP: ['', [Validators.pattern(/^\d{1,8}$/)]],  // Tipo numérico con una longitud hasta 8 dígitos
      tipoSeguridadSMTP: ['', [Validators.pattern(/^\d{1}$/)]],  // Tipo numérico con una longitud hasta 1 dígito
      usuarioSMTP: ['', [Validators.maxLength(100)]],
      contrasenaSMTP: ['', [Validators.maxLength(50)]],
      apiKey: [''],  // Campo para mostrar la API Key generada
      logo: [''],  // Agregar lógica para manejar la carga de logos (opcional)
    });
    // Escuchar cambios en el campo 'usarConfigSMTP' para activar/desactivar los campos correspondientes
    this.nuevoFormulario.get('usarConfigSMTP')?.valueChanges.subscribe((value) => {
      const camposSMTP = ['emailParaEnvio', 'servidorSMTP', 'puertoSMTP', 'tipoSeguridadSMTP', 'usuarioSMTP', 'contrasenaSMTP'];
      camposSMTP.forEach((campo) => {
        if (value) {
          this.nuevoFormulario.get(campo)?.setValidators(null);
        } else {
          this.nuevoFormulario.get(campo)?.setValidators([Validators.required, Validators.maxLength(100)]);
        }
        this.nuevoFormulario.get(campo)?.updateValueAndValidity();
      });
    });
  }

 

  tiposSeguridadSMTP = [
    { value: '1', label: 'Tipo 1' },
    { value: '2', label: 'Tipo 2' },
    { value: '3', label: 'Tipo 3' }
  ];



  // Método llamado al hacer clic en el botón "Guardar" en el modal
  onSaveClick() {
    if (this.nuevoFormulario.valid) {
      // Emitir el evento para que el componente padre (EmpresaComponent) maneje la lógica de guardar
      this.guardarEmpresa.emit(this.nuevoFormulario.value);
    }
  }

  // Método llamado al hacer clic en el botón "Generar API Key"
  onGenerarApiKeyClick() {
    this.empresaService.getApiKey().subscribe(
      (respuesta) => {
        // Actualizar la variable con la API Key generada
        this.apiKeyGenerada = respuesta.Data['ApiKey'];
        // Asignar la API Key al campo del formulario
        this.nuevoFormulario.get('apiKey')?.setValue(this.apiKeyGenerada);
        this.empresa.APIKey = this.apiKeyGenerada;
      },
      (error) => {
        console.error('Error al generar la API Key:', error);
      }
    );
  }

  onCheckboxChange(checkboxName: string, isChecked: boolean) {
    const oppositeCheckbox = checkboxName === 'usarConfiguracionSMTP' ? 'puedeEnviarCorreos' : 'usarConfiguracionSMTP';

    this.nuevoFormulario.get(checkboxName)?.setValue(isChecked);
    this.nuevoFormulario.get(oppositeCheckbox)?.setValue(!isChecked);
  
    this.empresa.PuedeEnviarCorreo = checkboxName === 'usarConfiguracionSMTP' ? !isChecked : isChecked;
    this.empresa.UsaConfiguracionSMTP = checkboxName === 'usarConfiguracionSMTP' ? isChecked : !isChecked;
  }
  
  onLogoChange(event: any) {
    // Agrega aquí la lógica para manejar el cambio en la selección de logo.
    // Puedes acceder al archivo seleccionado a través de 'event.target.files'.
    // Guarda el archivo o realiza las operaciones necesarias según tus requisitos.
  }

  getBusinessById(_id: number) {
    this.empresaService.getBusinessById(_id)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.empresa = ok.Data;
          if (ok.Data['PuedeEnviarCorreo'] === "0") {
            this.empresa.PuedeEnviarCorreo = false;
          }
          //this.applyFilter(); 
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
    this.IsNew = this.data['IsNew'];
    this.idEmpresa = this.data['IdEmpresa'];
    if (!this.IsNew) {
      this.getBusinessById(this.idEmpresa);
    }
  }
}

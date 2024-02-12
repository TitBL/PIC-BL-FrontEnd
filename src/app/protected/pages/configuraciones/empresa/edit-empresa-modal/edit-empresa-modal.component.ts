import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empresa } from 'src/app/protected/interfaces/empresa';
import { EmpresaService } from 'src/app/protected/services/empresa.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-edit-empresa-modal',
  templateUrl: './edit-empresa-modal.component.html',
  styleUrls: ['./edit-empresa-modal.component.css']
})
export class EditEmpresaModalComponent implements OnInit {
  @Input() IsNew: boolean = true;
  @Input() idEmpresa : number = 0;
  @Output() guardarEmpresa = new EventEmitter<Empresa>();
  
  empresa: Empresa = {
    id: 0,
    RUC: '',
    RazonSocial: '',
    NombreComercial: '',
    PuedeEnviarCorreo: false,
    UsaConfiguracionSMTP: false,
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
  apiKeyGenerada: string = ''; 
  selectedSecurityType: number | undefined;
  loading: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    this.nuevoFormulario = this.fb.group({
      ruc: ['', [Validators.required, Validators.maxLength(20)]],
      razonSocial: ['', [Validators.required, Validators.maxLength(100)]],
      nombreComercial: ['', [Validators.required, Validators.maxLength(100)]],
      puedeEnviarCorreos: [false, [Validators.required]],
      usarConfigSMTP: [false],
      emailParaEnvio: ['', [Validators.maxLength(100)]],
      servidorSMTP: ['', [Validators.maxLength(50)]],
      puertoSMTP: ['', [Validators.pattern(/^\d{1,8}$/)]],
      tipoSeguridadSMTP: ['', [Validators.pattern(/^\d{1}$/)]], 
      usuarioSMTP: ['', [Validators.maxLength(100)]],
      contrasenaSMTP: ['', [Validators.maxLength(50)]],
      apiKey: [''], 
      logo: [''], 
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


  // Método llamado al hacer clic en el botón "Guardar" en el modal
  onSaveClick() {
    this.guardarEmpresa.emit(this.empresa);
    if (this.nuevoFormulario.valid) {
      // Emitir el evento para que el componente padre (EmpresaComponent) maneje la lógica de guardar
    }
  }

  onDeleteLogoClick(){
    this.nuevoFormulario.get('logo')?.setValue('');
    this.empresa.Logo = '';
  }

  // Método llamado al hacer clic en el botón "Generar API Key"
  onGenerarApiKeyClick() {
     // Bloquear la pantalla
     this.loading = true;
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
    ).add(() => {
      this.loading = false;
    });
  }

  onCheckboxChange(checkboxName: string, isChecked: boolean) {
      this.nuevoFormulario.get(checkboxName)?.setValue(isChecked);
    if (checkboxName === 'puedeEnviarCorreos') {
      this.empresa.PuedeEnviarCorreo = isChecked;
    } else {
      this.empresa.UsaConfiguracionSMTP = isChecked;
    }
  }
  

  getBusinessById(_id: number) {
    this.empresaService.getBusinessById(_id)
      .subscribe(ok => {
        if (ok.Success === true) {
          this.empresa = ok.Data;
          console.log(ok.Data);
          console.log(this.empresa);
          ok.Data['PuedeEnviarCorreo'] === "0" ? 
            this.empresa.PuedeEnviarCorreo = false : 
            this.empresa.PuedeEnviarCorreo = true; 
          ok.Data['UsaConfiguracionSMTP'] === "0" ? 
            this.empresa.UsaConfiguracionSMTP = false : 
            this.empresa.UsaConfiguracionSMTP = true; 
        } else {
          this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
        }
      })
  }

  onSecurityTypeSelected(securityType: number) {
    this.selectedSecurityType = securityType;
    this.empresa.TipoSeguridad = securityType;
  }

  ngOnInit(): void {
    this.IsNew = this.data['IsNew'];
    this.idEmpresa = this.data['IdEmpresa'];
    this.empresa.id = this.idEmpresa;
    if (!this.IsNew) {
      this.getBusinessById(this.idEmpresa);
    }
  }
}
